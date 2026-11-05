# Google Trends — India, Oct 2021 to Nov 2026

Pulled 5 Nov 2026 with `scripts/google-trends.py` (pytrends, weekly data, geo `IN`).

Values are relative search interest, not search volumes. Google Trends allows 5 terms per request, so each group included "pav bhaji masala" as a shared reference and was rescaled onto the first group. All columns in `interest-5y-india.csv` are on that common scale.

## Files

- `interest-5y-india.csv` — weekly interest for 13 terms, 262 weeks
- `related-queries.json` — top and rising related searches (last 12 months) for "peri peri masala" and "kashmiri chilli"

## Summary

| Term | Last 12 months | vs previous 12 months | vs 5 years ago | Peak month |
|---|---|---|---|---|
| Tomato ketchup | 85.5 | +20% | +26% | Aug |
| Chai masala | 72.4 | +31% | +46% | Dec |
| Peri peri masala | 40.8 | +15% | +44% | Jul |
| Kashmiri chilli | 29.9 | +17% | +31% | Mar |
| Pav bhaji masala | 23.5 | −1% | −14% | Jan |
| Lemon pickle | 22.5 | −5% | −30% | Jan |
| Peri peri fries | 18.6 | +17% | −10% | Jul |
| Sambhar masala | 15.5 | +20% | +68% | Jul |
| Chaas masala | 10.5 | +17% | +101% | Apr |
| Dabeli masala | 8.1 | +4% | −10% | Jan |
| Green chilli pickle | 5.5 | −24% | −30% | Nov |
| Jeeravan masala | 3.8 | +19% | +169% | Feb |
| Gun powder podi | ~0 | – | – | – |

Chaas masala is the most seasonal term: April interest is about 7 times January's.

Related searches:

- **Peri peri masala (top):** peri peri fries, recipe, price, how to make, Catch peri peri masala, ingredients, Keya peri peri masala. Rising: "catch peri peri masala", "how to make peri peri masala at home".
- **Kashmiri chilli (top):** chilli powder, kashmiri chilli powder, price, 1kg, whole, Everest kashmiri chilli powder. Rising: "hathi kashmiri chilli powder".

## Takeaways

- Chai masala is the largest and fastest-growing masala term, peaking in December–January.
- Chaas masala content needs to be live and indexed by February to catch the March–May peak.
- Peri peri masala searchers compare price and brands (Catch, Keya) and look for homemade recipes.
- Kashmiri chilli searchers want to buy the powder; Tangry sells only `red-chilli-powder`.
- Sambhar masala is growing steadily (+68% in 5 years) while Tangry's page is at position ~9.6.
- Pickle searches are declining.
- "Gun powder podi" has almost no search interest; Search Console shows people use "gun powder masala" and "ghee podi idli".
