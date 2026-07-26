#!/usr/bin/env bash
# Monthly SEO monitoring for tangryspices.com (Phase 3 / Task 10)
# Run from repo root. Requires Cursor MCP: search-console + analytics-mcp.

set -euo pipefail

SITE="tangryspices.com"
DATE="$(date +%Y-%m-%d)"
REPORT_DIR="reports"
REPORT_FILE="${REPORT_DIR}/seo-monthly-${DATE}.md"

mkdir -p "$REPORT_DIR"

cat <<EOF
SEO monthly check — ${DATE}
============================

Run these prompts in Cursor (MCP must be connected):

1. GSC site snapshot (28 days):
   "GSC site snapshot for sc-domain:${SITE} last 28 days"

2. GSC alerts (7 days):
   "GSC check_alerts for last 7 days"

3. GSC quick wins:
   "GSC quick_wins for sc-domain:${SITE}"

4. GA4 organic traffic (28 days):
   "GA4 report property 217030926: sessions by channel, last 28 days"

5. GA4 ecommerce funnel:
   "GA4 events: page_view, begin_checkout, purchase — last 28 days"

6. Manual checks:
   - GSC → Pages → indexed count trending up?
   - GSC → Sitemap → www sitemap indexed pages
   - site:${SITE} in Google — page count growing?
   - PageSpeed Insights on homepage + top 3 product URLs

Save full GSC report:
   generate_report → ${REPORT_FILE}

EOF

echo ""
echo "Live sitemap URL count:"
curl -sL "https://www.tangryspices.com/sitemap.xml" | rg -c "<loc>" || true
