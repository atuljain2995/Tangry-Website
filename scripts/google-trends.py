"""
Fetch 5 years of Google Trends interest (India) for Tangry product terms, plus
12-month related queries for peri peri masala and kashmiri chilli.

Google Trends caps each request at 5 terms, so every group includes ANCHOR and
is rescaled onto the first group's anchor to put all terms on one scale.
pytrends is unofficial: Google may rate-limit it (HTTP 429), so retry later.

  python3 -m venv /tmp/trends-venv && /tmp/trends-venv/bin/pip install pytrends pandas
  /tmp/trends-venv/bin/python scripts/google-trends.py reports/google-trends-YYYY-MM-DD

Do not pass retries/backoff_factor to TrendReq: pytrends 4.9 uses a urllib3
argument removed in urllib3 2.x and fails with a TypeError.
"""
import time, json, sys
import pandas as pd
from pytrends.request import TrendReq

ANCHOR = "pav bhaji masala"
GROUPS = [
    ["peri peri masala", "chai masala", "sambhar masala", "chaas masala"],
    ["dabeli masala", "jeeravan masala", "gun powder podi", "kashmiri chilli"],
    ["lemon pickle", "green chilli pickle", "peri peri fries", "tomato ketchup"],
]
OUT = sys.argv[1] if len(sys.argv) > 1 else "reports/google-trends"

import os
os.makedirs(OUT, exist_ok=True)

py = TrendReq(hl="en-IN", tz=-330, timeout=(10, 30))


def fetch(kw, timeframe):
    for attempt in range(5):
        try:
            py.build_payload(kw, timeframe=timeframe, geo="IN")
            return py.interest_over_time()
        except TypeError:
            raise
        except Exception as e:
            wait = 30 * (attempt + 1)
            print(f"  retry {attempt + 1} after {type(e).__name__}: {e} (sleep {wait}s)", flush=True)
            time.sleep(wait)
    raise SystemExit("giving up")


frames = []
for i, g in enumerate(GROUPS):
    kw = [ANCHOR] + g
    print("group", i, kw, flush=True)
    df = fetch(kw, "today 5-y").drop(columns=["isPartial"], errors="ignore")
    frames.append(df)
    time.sleep(15)

# Rescale every group onto the first group's anchor so all terms share one scale.
base = frames[0][ANCHOR].mean()
combined = frames[0].copy()
for df in frames[1:]:
    factor = base / df[ANCHOR].mean() if df[ANCHOR].mean() else 1
    for c in df.columns:
        if c != ANCHOR:
            combined[c] = df[c] * factor
combined.to_csv(f"{OUT}/interest_5y.csv")

# Related queries for the two terms that matter most to the site.
related = {}
for term in ["peri peri masala", "kashmiri chilli"]:
    time.sleep(15)
    for attempt in range(4):
        try:
            py.build_payload([term], timeframe="today 12-m", geo="IN")
            rq = py.related_queries()[term]
            related[term] = {
                k: (v.head(15).to_dict("records") if v is not None else [])
                for k, v in rq.items()
            }
            break
        except Exception as e:
            print(f"  related retry {attempt + 1}: {e}", flush=True)
            time.sleep(30 * (attempt + 1))
json.dump(related, open(f"{OUT}/related.json", "w"), indent=1, default=str)
print("done")
