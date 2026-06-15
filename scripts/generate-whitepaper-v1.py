#!/usr/bin/env python3
"""Generate the ClawFarm whitepaper PDF.

The PDF is generated from structured text instead of patching pages in place.
That keeps paragraph flow, page breaks, headers, and tables deterministic.
"""

from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT_MAIN = ROOT / "public" / "whitepaper.pdf"
OUT_VERSIONED = ROOT / "public" / "ClawFarm_Whitepaper_v1.0.pdf"

TITLE = "ClawFarm: A Protocol for Mining AI Inference"
AUTHOR = "C. Wren"
EMAIL = "cwren.cf@protonmail.com"
VERSION = "Version 1.0"
STATUS = "Genesis Draft"


def clean(text: str) -> str:
    """Keep generated PDF text ASCII-clean and ReportLab-safe."""
    replacements = {
        "—": "-",
        "–": "-",
        "‑": "-",
        "“": '"',
        "”": '"',
        "‘": "'",
        "’": "'",
        "×": "x",
        "§": "Section ",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def p(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(clean(text), style)


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    page = canvas.getPageNumber()
    if page > 1:
        canvas.setFont("Helvetica-Oblique", 8)
        canvas.setFillColor(colors.HexColor("#777777"))
        canvas.drawRightString(width - 0.78 * inch, height - 0.48 * inch, TITLE)
        canvas.setFont("Helvetica", 8)
        canvas.drawCentredString(width / 2, 0.45 * inch, str(page))
    canvas.restoreState()


def styles():
    base = getSampleStyleSheet()
    body = ParagraphStyle(
        "Body",
        parent=base["BodyText"],
        fontName="Times-Roman",
        fontSize=10.4,
        leading=15.1,
        firstLineIndent=13,
        spaceAfter=8,
        alignment=TA_LEFT,
    )
    body_no_indent = ParagraphStyle(
        "BodyNoIndent",
        parent=body,
        firstLineIndent=0,
    )
    abstract = ParagraphStyle(
        "Abstract",
        parent=body_no_indent,
        fontSize=10.2,
        leading=14.8,
    )
    title = ParagraphStyle(
        "Title",
        parent=base["Title"],
        fontName="Helvetica",
        fontSize=28,
        leading=32,
        alignment=TA_LEFT,
        spaceAfter=8,
    )
    subtitle = ParagraphStyle(
        "Subtitle",
        parent=base["BodyText"],
        fontName="Times-Roman",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#222222"),
        alignment=TA_LEFT,
        spaceAfter=2,
    )
    h1 = ParagraphStyle(
        "H1",
        parent=base["Heading1"],
        fontName="Helvetica",
        fontSize=18,
        leading=22,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=base["Heading2"],
        fontName="Helvetica",
        fontSize=12.5,
        leading=16,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True,
    )
    toc = ParagraphStyle(
        "TOC",
        parent=base["BodyText"],
        fontName="Times-Roman",
        fontSize=11,
        leading=18,
        leftIndent=12,
        firstLineIndent=-12,
        spaceAfter=1,
    )
    kicker = ParagraphStyle(
        "Kicker",
        parent=base["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#555555"),
        spaceAfter=10,
    )
    table_cell = ParagraphStyle(
        "TableCell",
        parent=base["BodyText"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.5,
        spaceAfter=0,
    )
    table_head = ParagraphStyle(
        "TableHead",
        parent=table_cell,
        fontName="Helvetica-Bold",
    )
    mono = ParagraphStyle(
        "Mono",
        parent=base["BodyText"],
        fontName="Courier",
        fontSize=8.5,
        leading=11.5,
        spaceAfter=3,
    )
    return {
        "body": body,
        "body_no_indent": body_no_indent,
        "abstract": abstract,
        "title": title,
        "subtitle": subtitle,
        "h1": h1,
        "h2": h2,
        "toc": toc,
        "kicker": kicker,
        "table_cell": table_cell,
        "table_head": table_head,
        "mono": mono,
    }


SECTIONS = [
    (
        "1. Purpose",
        [
            "ClawFarm is a protocol for mining AI inference. It treats inference as an economic output that can be metered, priced, settled, and rewarded without requiring a platform operator to decide who may supply it or who may consume it.",
            "The central risk of the AGI era is not that models become more capable. It is that model capability, compute access, settlement rails, and reward distribution become locked inside a small number of institutional balance sheets. If the supply side of machine intelligence is captured, every application above it becomes downstream of the same narrow choke point.",
            "ClawFarm is designed to separate the supply side of machine intelligence from any single company, marketplace, or account system. Any wallet, any endpoint, and any source of inference capacity can enter the same settleable network, subject only to the protocol's proof, bond, settlement, and challenge rules.",
        ],
    ),
    (
        "2. What the protocol is",
        [
            "ClawFarm is not a model lab, a cloud provider, an inference reseller, or a hosted application. It is a settlement protocol for inference calls. The protocol records provider registration, escrowed user funds, dual-signed usage proofs, settlement events, treasury inflows, mining rewards, and burn events.",
            "Applications use a chat-completion compatible interface. Providers register an endpoint and declare model, price, and quality information. A call settles only after the user and provider both sign the same usage proof. The protocol does not inspect the inference itself and does not claim to verify model identity.",
            "This narrowness is deliberate. A protocol that decides which provider is legitimate becomes a platform. A protocol that only settles signed usage can remain identity-blind, source-blind, and forkable.",
        ],
    ),
    (
        "3. Supply neutrality",
        [
            "Inference capacity is not a single kind of resource. It may come from closed-model API resale, subscription credit pools, self-hosted open-weight models, leased GPU capacity, colocated infrastructure, or future sources that do not exist yet. The protocol does not record which source a provider uses.",
            "This is a structural property, not a slogan. Registration asks for a wallet, a bond, an endpoint, and declared offerings. Settlement asks for a dual-signed proof. Reward accounting reads settled volume and price. None of these operations requires the protocol to ask where capacity came from.",
            "Supply neutrality is the mechanism by which AGI capacity can be opened at scale. The protocol cannot make compute abundant by itself. It can remove the settlement and reward bottleneck that would otherwise force capacity through a small number of intermediaries.",
        ],
    ),
    (
        "4. Roles",
        [
            "A developer or user deposits USDC into an escrow PDA and consumes inference through an application or SDK. Funds leave escrow only through withdrawal or settlement against a dual-signed proof.",
            "A provider registers an endpoint by posting a 100 USDC bond. The provider receives 97 percent of each settled call in USDC and earns CLAF from the Provider Pool according to settled volume, price weight, and quality factors.",
            "A challenger is any party that posts a challenge bond against a suspect settlement. Challenges are permissionless. Enforcement is therefore not operator-driven; it is carried by the economic incentives of participants who can prove a fault.",
        ],
    ),
    (
        "5. Escrow",
        [
            "User funds are held in a Program Derived Address controlled by the escrow program. No private key controls the escrow account. No administrator can sweep balances. The program releases funds only according to the rules deployed at Genesis.",
            "A user may withdraw available funds at any time, subject to unsettled obligations. A settlement instruction transfers the provider share to the provider wallet and the protocol fee to the treasury PDA. The settlement path is deterministic and does not require human approval.",
        ],
    ),
    (
        "6. Dual-signed proof",
        [
            "A usage proof binds the request hash, response hash, model identifier, input token count, output token count, agreed price, timestamp, user wallet, and provider wallet. The user signs the proof. The provider signs the same proof. Settlement requires both signatures.",
            "Neither side can unilaterally distort the settlement amount. A provider cannot overstate tokens without the user's signature. A user cannot understate tokens without the provider's signature. The protocol validates signatures and accounting, not the semantic quality of the answer.",
            "This distinction matters. The protocol does not know whether an answer is good, whether a model is the exact version declared, or whether the upstream source is a frontier lab, a subscription account, or a local GPU. It knows that both parties signed the same metered receipt.",
        ],
    ),
    (
        "7. Settlement",
        [
            "For a settled call, the payment amount is calculated from the provider's declared price and the metered usage in the signed proof. The settlement split is fixed: 97 percent of USDC goes to the provider wallet and 3 percent goes to the protocol treasury.",
            "The split is not a fee schedule that can be updated by governance. There is no governance. There is no admin key. The split is a Genesis parameter. If different economics are desired, the remedy is a fork, not an upgrade.",
            "The 3 percent treasury inflow is not an operating budget. It is not allocated to a foundation, contributors, marketing, or maintenance. It is the input to the automatic buyback-and-burn mechanism.",
        ],
    ),
    (
        "8. Mining and emission",
        [
            "Each settled inference call mines CLAF. Emission is divided between two pools: 70 percent to the providing side and 30 percent to the consuming side. The schedule runs for ten years and halves every two years.",
            "The maximum emitted supply over the schedule is approximately 968.75 million CLAF. The remaining approximately 31.25 million CLAF is never emitted by the protocol. Total supply is fixed at 1,000,000,000 CLAF.",
            "Provider rewards are weighted by settled volume and by price relative to the network average. A provider that clears below the network average price receives a higher CLAF weight for the same volume. The mechanism subsidizes production of inference when USDC clearing price is below immediate marginal cost.",
            "Developer rewards are earned by settled consumption. This gives the demand side a share of emission and helps bootstrap both sides of the network at the same time.",
        ],
    ),
    (
        "9. Treasury and burn",
        [
            "The protocol treasury receives 3 percent of every settlement in USDC. At epoch boundaries, the treasury program evaluates whether accumulated USDC exceeds the configured threshold. If the threshold is met, USDC is swapped for CLAF through Jupiter and the acquired CLAF is burned.",
            "The default epoch length is one hour. The treasury swap threshold is 100 USDC. The slippage cap is 1 percent. The per-swap volume cap is 0.5 percent of relevant pool liquidity.",
            "This mechanism causes circulating supply to contract monotonically in protocol usage, subject to available liquidity and successful swap execution. No human trigger, admin key, or spending committee is involved.",
        ],
    ),
    (
        "10. Registry and routing",
        [
            "The registry stores provider wallets, endpoints, declared models, pricing, and status. It does not store legal identity, capacity source, or upstream account information. Any wallet that posts the required bond can register.",
            "Routing is performed by clients and applications against registry data. A route may prioritize price, latency, quality history, or a custom policy selected by the developer. The protocol does not operate a central router.",
            "The registry makes supply legible without making it permissioned. Developers can see which models have independent wallet-backed supply and what prices are being cleared, while providers remain peers rather than approved vendors.",
        ],
    ),
    (
        "11. Bond and challenge",
        [
            "Provider registration requires a 100 USDC bond. The bond creates a cost to spam registration and gives the challenge system an economic anchor. Deregistration includes a cooldown so recent settlements can still be challenged.",
            "Any party may challenge a suspect settlement by posting a small bond. If the challenge is upheld, the provider is slashed and the challenger receives a reward. If the challenge fails, the challenger forfeits the bond. The mechanism discourages both provider abuse and frivolous challenges.",
            "Challenge-driven enforcement is weaker than perfect cryptographic verification of inference, but it is available now and preserves source neutrality. Future cryptographic proof systems can be layered above or forked into a new protocol if they become practical.",
        ],
    ),
    (
        "12. Immutability",
        [
            "At Genesis, program parameters are initialized and upgrade authority is renounced. After that transaction, no original author, deployer, team, multisig, or governance process can modify the protocol.",
            "Immutability is costly. Bugs cannot be patched in place. Parameters cannot be adjusted to market conditions. The only path to a different rule set is a fork. That cost is accepted because a settlement layer that can be changed by insiders is not neutral infrastructure.",
            "The protocol has no team allocation, no investor allocation, no treasury spending authority, and no governance token rights. Rewards follow settled contribution.",
        ],
    ),
    (
        "13. Security limits",
        [
            "ClawFarm does not verify model identity. It does not know whether a provider served the exact model declared. It does not know the provider's upstream source. It does not solve all collusion or wash-usage attacks. It imposes costs, signatures, bonds, and challenge incentives.",
            "The protocol depends on Solana for execution, finality, censorship resistance, and token-account semantics. A base-layer failure or halt affects ClawFarm directly.",
            "These limits are not hidden. They define the boundary of the design. ClawFarm is a settlement and mining protocol for inference usage, not a universal truth machine for artificial intelligence.",
        ],
    ),
    (
        "14. Conclusion",
        [
            "AGI capacity should not be locked behind a small number of accounts, balance sheets, and settlement channels. If intelligence becomes a core economic input, the rails that admit supply and distribute rewards matter as much as the models themselves.",
            "ClawFarm makes inference supply permissionless and settleable. It lets any wallet register capacity, any application consume capacity, and both sides mine CLAF through real settled usage. The protocol does not ask who participates. It asks only that settled calls carry proof.",
            "Compute may centralize. Accounts may centralize. Platforms may centralize. Settlement does not have to.",
        ],
    ),
]


PARAMETERS = [
    ("Chain", "Solana"),
    ("Settlement asset", "USDC"),
    ("Reward token", "CLAF"),
    ("Total supply", "1,000,000,000 CLAF"),
    ("Maximum scheduled emission", "Approx. 968.75M CLAF"),
    ("Unemitted residual", "Approx. 31.25M CLAF"),
    ("Emission horizon", "10 years"),
    ("Halving interval", "2 years"),
    ("Default epoch length", "1 hour"),
    ("Provider pool", "70 percent of epoch emission"),
    ("Developer pool", "30 percent of epoch emission"),
    ("Provider settlement share", "97 percent of USDC settlement"),
    ("Protocol fee", "3 percent of USDC settlement"),
    ("Treasury disposition", "100 percent buyback-and-burn"),
    ("Treasury threshold", "100 USDC"),
    ("Swap slippage cap", "1 percent"),
    ("Swap volume cap", "0.5 percent of relevant pool liquidity"),
    ("Provider bond", "100 USDC"),
    ("Challenge mechanism", "Permissionless bond and slash"),
    ("Upgrade authority", "Renounced at Genesis"),
    ("Admin / governance", "None"),
]


REFERENCES = [
    "Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System.",
    "Poon, J., and Dryja, T. (2016). The Bitcoin Lightning Network: Scalable Off-Chain Instant Payments.",
    "Solana Foundation. Solana Program and Account Model documentation.",
    "Jupiter. Aggregator and swap program documentation.",
]


def build_story():
    s = styles()
    story = []

    story.append(Spacer(1, 1.1 * inch))
    story.append(p(TITLE, s["title"]))
    story.append(p(AUTHOR, s["subtitle"]))
    story.append(p(f"{EMAIL}  |  {VERSION}  |  {STATUS}", s["subtitle"]))
    story.append(Spacer(1, 1.2 * inch))
    story.append(p("Abstract", s["kicker"]))
    abstract_text = (
        "ClawFarm is a protocol for mining AI inference. Providers register endpoints, "
        "users deposit USDC into non-custodial escrow, and each settled call produces "
        "a dual-signed proof that determines payment and CLAF emission. Settlement is "
        "fixed at 97 percent to the provider and 3 percent to the protocol treasury. "
        "CLAF emission follows a ten-year halving schedule, with 70 percent assigned "
        "to providers and 30 percent assigned to developers and users. The protocol "
        "does not verify model identity or inspect inference content. It is source-blind "
        "by design, allowing any wallet, endpoint, and inference source to enter the same "
        "settleable network."
    )
    story.append(p(abstract_text, s["abstract"]))
    story.append(PageBreak())

    story.append(p("Contents", s["h1"]))
    for title, _paras in SECTIONS:
        story.append(p(title, s["toc"]))
    story.append(p("Appendix A. Genesis parameters", s["toc"]))
    story.append(p("References", s["toc"]))
    story.append(PageBreak())

    for title, paras in SECTIONS:
        story.append(p(title, s["h1"]))
        for para in paras:
            story.append(p(para, s["body"]))

    story.append(PageBreak())
    story.append(p("Appendix A. Genesis parameters", s["h1"]))
    table_data = [[p("Parameter", s["table_head"]), p("Value", s["table_head"])]]
    table_data.extend([[p(k, s["table_cell"]), p(v, s["table_cell"])] for k, v in PARAMETERS])
    table = Table(table_data, colWidths=[2.2 * inch, 3.8 * inch], hAlign="LEFT", repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F2F2F2")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#111111")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#BBBBBB")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(table)
    story.append(PageBreak())

    story.append(p("References", s["h1"]))
    for ref in REFERENCES:
        story.append(p(ref, s["body_no_indent"]))

    return story


def write_pdf(path: Path):
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=0.82 * inch,
        leftMargin=0.82 * inch,
        topMargin=0.78 * inch,
        bottomMargin=0.7 * inch,
        title=TITLE,
        author=AUTHOR,
        subject="ClawFarm whitepaper",
    )
    doc.build(build_story(), onFirstPage=header_footer, onLaterPages=header_footer)


def main():
    OUT_MAIN.parent.mkdir(parents=True, exist_ok=True)
    write_pdf(OUT_MAIN)
    write_pdf(OUT_VERSIONED)
    print(OUT_MAIN)
    print(OUT_VERSIONED)


if __name__ == "__main__":
    main()
