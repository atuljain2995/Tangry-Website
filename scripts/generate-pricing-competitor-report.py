#!/usr/bin/env python3
"""Generate Tangry Spices competitor pricing & discount strategy PDF report."""

from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "reports" / "tangry-pricing-competitor-analysis-2026-07-26.pdf"

BRAND = colors.HexColor("#D32F2F")
MUTED = colors.HexColor("#555555")
LIGHT_BG = colors.HexColor("#FFF8F5")
TABLE_HEADER = colors.HexColor("#1F2937")


def build_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=28,
            textColor=BRAND,
            alignment=TA_CENTER,
            spaceAfter=12,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontSize=11,
            leading=14,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=24,
        ),
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=BRAND,
            spaceBefore=16,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=TABLE_HEADER,
            spaceBefore=12,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontSize=9.5,
            leading=13,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontSize=9.5,
            leading=13,
            leftIndent=14,
            bulletIndent=0,
            spaceAfter=4,
        ),
        "table_cell": ParagraphStyle(
            "TableCell",
            parent=base["Normal"],
            fontSize=8,
            leading=10,
        ),
        "table_header": ParagraphStyle(
            "TableHeader",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=colors.white,
        ),
        "footer": ParagraphStyle(
            "Footer",
            parent=base["Normal"],
            fontSize=8,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
    }


def table(data, col_widths=None, header_rows=1):
    styles = build_styles()
    wrapped = []
    for r, row in enumerate(data):
        wrapped_row = []
        for cell in row:
            if isinstance(cell, str):
                style = styles["table_header"] if r < header_rows else styles["table_cell"]
                wrapped_row.append(Paragraph(cell.replace("\n", "<br/>"), style))
            else:
                wrapped_row.append(cell)
        wrapped.append(wrapped_row)

    t = Table(wrapped, colWidths=col_widths, repeatRows=header_rows)
    style_commands = [
        ("BACKGROUND", (0, 0), (-1, header_rows - 1), TABLE_HEADER),
        ("TEXTCOLOR", (0, 0), (-1, header_rows - 1), colors.white),
        ("FONTNAME", (0, 0), (-1, header_rows - 1), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#E5E7EB")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]
    for i in range(header_rows, len(data)):
        if i % 2 == 0:
            style_commands.append(("BACKGROUND", (0, i), (-1, i), LIGHT_BG))
    t.setStyle(TableStyle(style_commands))
    return t


def add_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(2 * cm, 1.2 * cm, "Tangry Spices — Pricing & Competitor Analysis")
    canvas.drawRightString(A4[0] - 2 * cm, 1.2 * cm, f"Page {doc.page}")
    canvas.restoreState()


def build_story():
    s = build_styles()
    story = []
    today = date.today().strftime("%d %B %Y")

    story.append(Spacer(1, 2.5 * cm))
    story.append(Paragraph("Tangry Spices", s["title"]))
    story.append(Paragraph("Competitor Pricing &amp; Discount Strategy Analysis", s["title"]))
    story.append(Spacer(1, 0.4 * cm))
    story.append(
        Paragraph(
            f"Prepared: {today}<br/>Subject: www.tangryspices.com<br/>"
            "Benchmarks: Everest, Tata Sampann, ZOFF, Vasant, Mother&apos;s Recipe, MTR",
            s["subtitle"],
        )
    )
    story.append(Spacer(1, 1 * cm))
    story.append(
        Paragraph(
            "<b>Scope:</b> Like-for-like pack-size comparison using live Tangry catalog (23 variants) "
            "vs publicly listed competitor prices on BigBasket, Amazon, brand D2C sites, and quick-commerce "
            "platforms (July 2026).",
            s["body"],
        )
    )
    story.append(PageBreak())

    # Executive summary
    story.append(Paragraph("1. Executive Summary", s["h1"]))
    story.append(
        Paragraph(
            "Showing a discounted price on every product in the catalog is <b>not recommended</b>. "
            "Tangry&apos;s compare-at MRP is far above what the market uses for the same quantities, "
            "while selling prices are often <b>higher</b> than mass-market brands. That combination "
            "creates fake urgency rather than a genuine value proposition.",
            s["body"],
        )
    )
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        table(
            [
                ["Finding", "Detail"],
                [
                    "Discount badges",
                    "All 23 variants show 40–72% OFF because compare_at_price is set above price on every SKU",
                ],
                [
                    "MRP credibility",
                    "Tangry MRP is often 3–7× higher than real market MRP (e.g. Chai 50g: ₹399 vs Everest ~₹72)",
                ],
                [
                    "Selling price",
                    "On ~15 of 18 products, Tangry sell price exceeds Everest/Tata/Mother&apos;s at same weight",
                ],
                [
                    "Recommendation",
                    "Reset MRP to printed label values; remove universal % OFF badges; reprice or reposition by category",
                ],
            ],
            col_widths=[4.2 * cm, 12.3 * cm],
        )
    )

    story.append(Paragraph("2. How Competitors Handle Pricing", s["h1"]))
    story.append(
        table(
            [
                ["Brand type", "MRP vs sell", "Typical discount", "% OFF badge"],
                ["Everest / Tata Sampann / MDH", "Real printed MRP", "5–15% on quick commerce", "Rare on catalog"],
                ["ZOFF (D2C)", "MRP = website price", "~40% on marketplaces", "Not sitewide on every SKU"],
                ["Vasant (regional)", "MRP ₹38 → sell ₹27", "~29%, believable", "Modest"],
                ["Mother&apos;s Recipe", "MRP ₹55–60 → sell ₹51–56", "~7%", "Occasional"],
                ["Tangry (current)", "MRP ₹159–999", "40–72% on all variants", "Every product card"],
            ],
            col_widths=[4.5 * cm, 4.2 * cm, 4.2 * cm, 3.6 * cm],
        )
    )

    story.append(PageBreak())
    story.append(Paragraph("3. Blended Masalas — Same Quantity Comparison", s["h1"]))
    story.append(
        table(
            [
                ["Product", "Qty", "Tangry", "T-MRP", "Competitor", "C-MRP", "C-sell", "vs Market"],
                ["Chai Masala", "50g", "₹120", "₹399", "Everest", "₹72", "₹68", "~2× costlier; MRP 5× inflated"],
                ["Pav Bhaji", "50g", "₹75", "₹299", "Everest", "₹50", "₹47", "+60% sell"],
                ["Pav Bhaji", "100g", "₹135", "₹399", "Everest / ZOFF", "₹78/105", "₹78/105", "+73% / +29%"],
                ["Pav Bhaji", "200g", "₹255", "₹499", "Everest", "₹186", "₹186", "+37%"],
                ["Sambhar", "50g", "₹65", "₹159", "Everest", "₹50", "₹40", "+62%"],
                ["Jain Jeeravan", "50g", "₹75", "₹199", "Vasant", "₹38", "₹27", "+178%"],
                ["Chaas Masala", "50g", "₹55", "₹199", "Everest Chaat*", "₹50", "₹45", "+22%; MRP 4× inflated"],
                ["Peri Peri", "50g", "₹75", "₹199", "Keya (30g)", "—", "₹60", "Premium; not like-for-like"],
            ],
            col_widths=[2.4 * cm, 1.1 * cm, 1.3 * cm, 1.3 * cm, 2.2 * cm, 1.5 * cm, 1.3 * cm, 5.3 * cm],
        )
    )
    story.append(Paragraph("*Chaas vs chaat masala — closest mass-market analogue.", s["body"]))

    story.append(Paragraph("4. Basic Spices (Commodity)", s["h1"]))
    story.append(
        table(
            [
                ["Product", "Qty", "Tangry", "T-MRP", "Competitor", "C-MRP", "C-sell", "vs Market"],
                ["Turmeric", "200g", "₹150", "₹399", "Tata Sampann", "₹72", "₹63", "+138% sell; MRP 5.5× inflated"],
                ["Coriander", "200g", "₹99", "₹299", "Everest", "₹80", "₹78", "+27% sell"],
                ["Red Chilli", "200g", "₹150", "₹399", "Everest Tikhalal", "₹108", "₹92", "+63% sell"],
            ],
            col_widths=[2.4 * cm, 1.1 * cm, 1.3 * cm, 1.3 * cm, 2.8 * cm, 1.3 * cm, 1.3 * cm, 5.8 * cm],
        )
    )

    story.append(Paragraph("5. Pickles &amp; Condiments", s["h1"]))
    story.append(
        table(
            [
                ["Product", "Qty", "Tangry", "T-MRP", "Competitor", "C-MRP", "C-sell", "vs Market"],
                ["Green Chilli Pickle", "200g", "₹145", "₹399", "Mother&apos;s Recipe", "₹57", "₹51", "+184% sell"],
                ["Sweet Lemon Pickle", "250g", "₹240", "₹399", "Mother&apos;s (lime 200g)*", "₹60", "₹56", "~3.4× per gram"],
                ["Sweet Mango Relish", "250g", "₹300", "₹599", "Mother&apos;s mango 200g*", "₹57", "₹51", "~4× per gram"],
                ["Gun Powder (Podi)", "200g", "₹240", "₹499", "MTR chutney powder", "₹165", "₹158", "+52%"],
                ["Gun Powder", "100g", "₹140", "₹399", "MTR (est.)", "₹80", "₹45–72", "Premium"],
                ["Dabeli Masala", "200g", "₹190", "₹399", "Vedcare", "—", "₹219", "Tangry cheaper on sell"],
            ],
            col_widths=[2.6 * cm, 1.1 * cm, 1.3 * cm, 1.3 * cm, 2.6 * cm, 1.3 * cm, 1.3 * cm, 5.0 * cm],
        )
    )
    story.append(Paragraph("*Scaled comparison where exact pack size differs.", s["body"]))

    story.append(PageBreak())
    story.append(Paragraph("6. Per-Gram Premium Analysis", s["h1"]))
    story.append(
        table(
            [
                ["Category", "Tangry ₹/g", "Market leader ₹/g", "Tangry premium"],
                ["Turmeric 200g", "₹0.75", "Tata Sampann ₹0.31", "+142%"],
                ["Coriander 200g", "₹0.50", "Everest ₹0.39", "+28%"],
                ["Chai masala 50g", "₹2.40", "Everest ₹1.24–1.36", "~2×"],
                ["Pickles 200g", "₹0.73", "Mother&apos;s ₹0.26", "~2.8×"],
                ["Jeeravan 50g", "₹1.50", "Vasant ₹0.54", "~2.8×"],
            ],
            col_widths=[4.5 * cm, 3.5 * cm, 4.5 * cm, 4.0 * cm],
        )
    )

    story.append(Paragraph("7. MRP Credibility Gap (Examples)", s["h1"]))
    story.append(
        table(
            [
                ["SKU", "Tangry &quot;MRP&quot;", "Real market MRP"],
                ["Chai Masala 50g", "₹399", "Everest ~₹72"],
                ["Turmeric 200g", "₹399", "Tata Sampann ₹72"],
                ["Green Chilli Pickle 200g", "₹399", "Mother&apos;s Recipe ₹57"],
                ["Jain Jeeravan 50g", "₹199", "Vasant ₹38"],
            ],
            col_widths=[5.5 * cm, 5.0 * cm, 6.0 * cm],
        )
    )

    story.append(Paragraph("8. Strategic Options", s["h1"]))
    story.append(Paragraph("Option A — Honest Premium D2C (Recommended)", s["h2"]))
    for item in [
        "Reset compare_at_price to real printed MRP on each pack.",
        "Remove green “X% OFF” badge from product grid; keep strikethrough MRP only where genuine.",
        "Reserve badges for real promos: first order, festival sale, bundles, subscribe & save.",
        "Reprice commodity SKUs (turmeric, coriander, chilli) closer to ZOFF tier (+15–25% max).",
        "Keep specialty SKUs premium only with strong PDP proof (photos, ingredients, reviews).",
    ]:
        story.append(Paragraph(f"• {item}", s["bullet"]))

    story.append(Paragraph("Option B — Mass-Market Competitive", s["h2"]))
    for item in [
        "Align selling prices within 10–20% of Everest/ZOFF on blends.",
        "Remove compare-at where no separate MRP exists.",
        "Compete on reviews, origin story, and bundles — not fake % OFF.",
    ]:
        story.append(Paragraph(f"• {item}", s["bullet"]))

    story.append(Paragraph("Option C — Premium, No Discount Framing", s["h2"]))
    story.append(
        Paragraph(
            "Keep current selling prices but drop all discount framing; show single honest price "
            "(Two Brothers / Whole Truth model).",
            s["body"],
        )
    )

    story.append(Paragraph("9. Action Matrix by Product Group", s["h1"]))
    story.append(
        table(
            [
                ["Product group", "Discount UX", "Price vs market", "Decision"],
                ["Turmeric, coriander, chilli", "Fake 60%+ OFF", "Much higher", "Fix MRP + consider price cut"],
                ["Pav bhaji, sambhar, chai", "Fake 60–70% OFF", "Higher", "Fix MRP; remove badge; review price"],
                ["Pickles, mango relish", "Fake 50–64% OFF", "2.5–4× Mother&apos;s", "Fix MRP; reprice or premium story"],
                ["Jain Jeeravan", "Fake 62% OFF", "2.8× Vasant", "Fix MRP; artisan positioning"],
                ["Dabeli", "Fake 52% OFF", "Competitive vs Vedcare", "Fix MRP only"],
                ["Bundles / hampers", "Fake 40% OFF", "Unique SKU", "OK if bundle math is real"],
            ],
            col_widths=[4.0 * cm, 3.5 * cm, 3.5 * cm, 5.5 * cm],
        )
    )

    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph("10. Bottom Line", s["h1"]))
    story.append(
        table(
            [
                ["Question", "Answer"],
                ["Is whole-list discount display good?", "No — MRP anchors aren&apos;t credible vs competitors"],
                ["Is Tangry cheap vs competitors?", "Mostly no — often 20–180% more expensive at same weight"],
                ["Can premium pricing work?", "Only on regional/specialty SKUs with proof, not vs Mother&apos;s/Everest on basics"],
                ["Next steps", "Reset MRP → remove universal % OFF → reprice or reposition by category"],
            ],
            col_widths=[5.5 * cm, 11.0 * cm],
        )
    )

    story.append(Spacer(1, 0.6 * cm))
    story.append(
        Paragraph(
            "Sources: Tangry live Supabase catalog (pmknwgwbwfyvrkfbrccu); BigBasket, Amazon.in, "
            "ZOFF Foods, Vasant Masala, Mother&apos;s Recipe, Zepto product listings (July 2026). "
            "Prices fluctuate by city and promotion — re-benchmark quarterly.",
            s["footer"],
        )
    )

    return story


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        title="Tangry Spices — Competitor Pricing Analysis",
        author="Tangry Spices",
    )
    doc.build(build_story(), onFirstPage=add_footer, onLaterPages=add_footer)
    print(f"Generated: {OUTPUT}")


if __name__ == "__main__":
    main()
