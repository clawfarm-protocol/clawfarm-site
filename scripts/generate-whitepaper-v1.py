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
            "ClawFarm is not a model lab, a cloud provider, an inference reseller, or a hosted application. It is a settlement protocol for inference calls. Across the masterpool and treasury programs, the protocol records provider registration, escrowed user funds, dual-signed usage proofs, settlement events, treasury inflows, treasury split events, mining rewards, burn events, and protocol-owned liquidity additions.",
            "Applications use a chat-completion compatible interface. Providers register an endpoint and declare model, price, and quality information. A call settles only after the user and provider both sign the same usage proof. The protocol does not inspect the inference itself and does not claim to verify model identity.",
            "This narrowness is deliberate. A protocol that decides which provider is legitimate becomes a platform. A protocol that only settles signed usage can remain identity-blind, source-blind, and forkable.",
        ],
    ),
    (
        "3. Supply neutrality",
        [
            "Inference capacity is not a single kind of resource. It may come from closed-model API resale, subscription credit pools, self-hosted open-weight models, leased GPU capacity, colocated infrastructure, or future sources that do not exist yet. The protocol does not record which source a provider uses.",
            "This is a structural property, not a slogan. Registration asks for a wallet, a bond, an endpoint, and declared offerings. Settlement asks for a dual-signed proof. Reward accounting reads settled volume and price. None of these operations requires the protocol to ask where capacity came from.",
            "The treasury operates with the same neutrality. Buyback and add-LP slices are submitted by any wallet that pays gas; the treasury program enforces bounds on timing, sizing, slippage, liquidity, and fund flow, not the identity of the caller.",
            "Supply neutrality is the mechanism by which AGI capacity can be opened at scale. The protocol cannot make compute abundant by itself. It can remove the settlement and reward bottleneck that would otherwise force capacity through a small number of intermediaries.",
        ],
    ),
    (
        "4. Roles",
        [
            "A developer or user deposits USDC into an escrow PDA and consumes inference through an application or SDK. Funds leave escrow only through withdrawal or settlement against a dual-signed proof.",
            "A provider registers an endpoint by posting a 100 USDC bond. The provider selects a protocol-fee tier from 0.5 percent to 3.0 percent, in 0.5 percent increments. The provider receives the settlement remainder after the selected fee and earns CLAF from the Provider Pool according to actual fee contribution, price weight, and quality factors.",
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
            "For a settled call, the payment amount A is calculated from the provider's declared price and the metered usage in the signed proof. The provider selects a protocol-fee rate r from the allowed set: 0.5 percent, 1.0 percent, 1.5 percent, 2.0 percent, 2.5 percent, or 3.0 percent. Treasury receives A x r. Provider pending revenue receives A x (1 - r).",
            "The fee tier is provider-selected, not governance-selected. The AIRouter settlement layer accepts only the allowed fee tiers before submitting payment records on-chain. Lower fee tiers reduce the treasury contribution and reduce CLAF reward weight in the same proportion. A provider may choose lower friction for users, but cannot keep the same mining weight while contributing less to the protocol.",
            "The protocol-fee inflow is not an operating budget. It is not allocated to a foundation, contributors, marketing, maintenance, or infrastructure. It is the accounting input that links settlement volume to mining weight and treasury accumulation.",
        ],
    ),
    (
        "8. Mining and emission",
        [
            "Each settled inference call mines CLAF. Emission is divided between two pools: 70 percent to the providing side and 30 percent to the consuming side. The schedule runs for ten years and halves every two years.",
            "The maximum emitted supply over the schedule is approximately 968.75 million CLAF. The remaining approximately 31.25 million CLAF is never emitted by the protocol. Total supply is fixed at 1,000,000,000 CLAF. No portion of the schedule is pre-allocated to any party. Where CLAF donated by early community members is used for initial pool seeding in Appendix A, it is surrendered to the pool and the resulting LP is burned, ensuring no donor or team wallet retains a claim to that liquidity.",
            "Within each pool, reward weight follows actual protocol-fee contribution rather than nominal settlement volume alone. A call settled at a lower fee tier contributes less mining weight than the same call settled at a higher fee tier. Token distribution therefore follows the amount of USDC fee paid into the protocol.",
            "Provider rewards are additionally weighted by price relative to the network average. A provider that clears below the network average price receives a higher CLAF weight for the same fee contribution. The mechanism subsidizes production of inference when USDC clearing price is below immediate marginal cost.",
            "Developer rewards are earned by settled consumption and inherit the same fee-contribution weighting. This gives the demand side a share of emission and helps bootstrap both sides of the network at the same time.",
        ],
    ),
    (
        "9. Treasury and burn",
        [
            "The protocol treasury receives the provider-selected fee from every settlement in USDC. The allowed fee tiers range from 0.5 percent to 3.0 percent in 0.5 percent increments.",
            "The masterpool program records settlement, mining, and reward state. The treasury / buyback program consumes treasury inflows and executes the buyback pipeline.",
            "The treasury operates on a daily buyback cycle, measured by UTC day. This cycle is independent of the hourly mining epoch defined in Section 8; the two run on separate timers and do not need to align. Each cycle, 100 percent of accumulated USDC in the intake vault is moved to the buyback vault by a permissionless split crank. No portion is allocated to maintenance, infrastructure, or any other operational stream. Team operational costs are funded outside the treasury.",
            "The buyback vault drives two non-discretionary actions against the CLAF/USDC liquidity pool: buy-and-burn and buy-and-add-LP. Buy-and-burn removes CLAF from circulation. Buy-and-add-LP buys CLAF with treasury USDC, then deposits the bought CLAF plus an equal share of treasury USDC into the pool; the minted LP tokens are sent to a code-locked vault from which the protocol has no withdrawal path. The split between the two actions is a function of the pool's liquidity ratio L = pool TVL / circulating market cap, with a target band that prefers add-LP when L is below target and burn when L is above target.",
            "Slices within a daily buyback cycle are randomized in count, size, and timing within bounds enforced on-chain: minimum and maximum slice size, minimum interval, daily cumulative cap, and min-out slippage tolerance. Randomization is generated by a CSPRNG from a committed seed before execution. CSPRNG means cryptographically secure pseudorandom number generator. The on-chain swap is a direct CPI to a constant-product pool program; the swap instruction is composed off-chain so a different pool program can be substituted without contract changes.",
            "No privileged operator or spending committee initiates a buyback. Cycle opening, split cranking, and slice execution are permissionless; the treasury program enforces the bounds. The treasury program has no fund-spending instruction path: the admin multisig cannot move USDC out of any vault, and the protocol-owned liquidity vault exposes no withdrawal instruction.",
        ],
    ),
    (
        "9a. Anti-MEV",
        [
            "Two layers protect buyback execution from frontrunning and price manipulation: per-slice min-out and randomized timing and size.",
            "Every swap instruction enforces a minimum CLAF output, computed off-chain from the current pool reserves using the same constant-product math the on-chain pool program runs. The maximum slippage tolerance is a configurable parameter bounded by the admin. A swap that would receive less than the min-out reverts on-chain.",
            "Within each daily buyback cycle, slice count, individual size, and firing times are generated by a CSPRNG from a committed seed before execution. The committed schedule is constrained on-chain by minimum and maximum slice size, minimum interval, daily cumulative cap, minimum pool liquidity, and min-out slippage tolerance. Adjacent slices respect the minimum interval. Where bundled execution is available, slices are submitted in private bundles to reduce mempool visibility.",
            "A minimum pool liquidity threshold prevents buyback during periods of thin or drained liquidity. The threshold is admin-tunable and starts at a conservative floor relative to the seed pool size.",
            "The protocol does not consult an external price oracle. Adding an on-chain oracle as a third defense layer was considered and deferred: at launch the pool is shallow enough that a pool-derived TWAP is itself cheaply manipulable, and CLAF has no independent oracle feed. The composition of min-out, randomized execution, and liquidity floor is the operating defense; an external oracle may be added later if it becomes practical.",
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
        "12. Governance scope",
        [
            "The protocol distinguishes between structural and operational state. Structural state - mints, vault addresses, PDA seeds, program ID, and the 100 percent buyback allocation - is fixed at Genesis and cannot be changed by any party after deployment.",
            "Operational state - daily-window timing, slice size bounds, slippage tolerance, minimum pool liquidity threshold, and minimum buyback threshold - is bounded and can be tuned by an admin multisig. Within the treasury program, the admin multisig can tune those parameters, pause or unpause the buyback engine, and permanently renounce emergency pause authority. It has no fund-spending path anywhere in the treasury program.",
            "A single Squads multisig at Genesis holds both program upgrade authority and the on-chain admin role. Threshold is 2-of-3, with launch-period signers drawn from the founding team. All non-pause admin actions and all program upgrades pass through an on-chain 24-hour timelock before execution. Emergency pause is exempt from the timelock to preserve its emergency function; pause can halt the buyback engine, but cannot redirect, withdraw, or otherwise move funds.",
            "The protocol will not renounce upgrade authority. A settlement protocol that custodies user USDC and operates against external DEX liquidity must retain the ability to patch safety-critical bugs. Renouncing upgrade authority would convert any future safety-critical bug into a permanent loss condition. The protocol chooses bounded, observable upgradeability over performative immutability.",
            "The trust model is bounded by timelock, public signer accountability, immutable fund-flow constraints, and the absence of any treasury withdrawal path, not by renounced upgrade authority. Every proposal, approval, and execution is a public on-chain transaction with named signers, observable in real time.",
            "The protocol has no team allocation in the emission schedule and no investor allocation. Rewards follow settled contribution. A separate cold-start commitment describes how initial pool liquidity is provided by CLAF donated by early community members and immediately surrendered.",
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
        "14. Cold-start commitment",
        [
            "CLAF launches with no schedule pre-allocation to the team, investors, foundation, marketing, or maintenance, and with no pre-existing market. The protocol bootstraps initial liquidity with 10,000,000 CLAF, 1.0 percent of total supply, donated by early community members. This portion is publicly verifiable on-chain and is not retained by any donor or team wallet.",
            "The donated CLAF is paired with 5,000 USDC of team-provided capital, creating a Raydium CPMM pool at an initial fully diluted valuation of 500,000 USDC and an opening price of 0.0005 USDC per CLAF.",
            "The LP tokens received from pool creation are burned. No donor or team wallet retains any claim on the seed liquidity. The 5,000 USDC and 10,000,000 CLAF become surrendered pool depth that supports subsequent buyback and add-LP activity.",
            "Once revenue begins, treasury buyback can add further protocol-owned liquidity through the code-locked vault described in Section 9. The protocol-owned LP position grows with successful add-LP execution, subject to market conditions and execution success.",
        ],
    ),
    (
        "15. Conclusion",
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
    ("Mining / reward epoch length", "1 hour"),
    ("Treasury buyback cycle length", "24 hours, measured by UTC day and distinct from the mining epoch"),
    ("Provider pool", "70 percent of epoch emission"),
    ("Developer pool", "30 percent of epoch emission"),
    ("Provider settlement share", "99.5 to 97.0 percent of USDC settlement"),
    ("Protocol fee", "0.5 to 3.0 percent, provider-selected in 0.5 percent increments"),
    ("Reward weight basis", "Proportional to actual USDC protocol fee contributed"),
    ("Treasury allocation", "100 percent buyback pipeline; no maintenance, infrastructure, foundation, contributor, or marketing stream"),
    ("Buyback action mix", "Dynamic by liquidity ratio L = pool TVL / circulating market cap; target L = 17.5 percent. Cold start fixed at 70 percent add-LP / 30 percent burn until L exceeds target."),
    ("DEX", "Raydium CPMM constant-product pool. Swap and deposit are composed off-chain and executed by the treasury / buyback program through direct CPI."),
    ("Min buyback threshold", "10 USDC at cold start; 100 USDC at steady state"),
    ("Min slice size", "1 USDC at cold start; 50 USDC at steady state"),
    ("Max slice size", "5,000 USDC"),
    ("Min slice interval", "30 seconds"),
    ("Slippage tolerance", "0.5 percent, configurable through bounded admin controls"),
    ("Min pool liquidity", "0 at deploy; raised to 5,000 USDC after pool seeding; intended to ratchet up"),
    ("Protocol-owned liquidity", "LP minted by buy-and-add-LP is sent to a code-locked vault with no withdrawal path"),
    ("Initial pool seeding", "5,000 USDC + 10,000,000 CLAF, with seed LP burned at pool creation"),
    ("Provider bond", "100 USDC mainnet target"),
    ("Challenge mechanism", "Permissionless bond and slash target"),
    ("Upgrade authority", "Single Squads multisig at Genesis, threshold 2-of-3, team-held, never renounced; all upgrades pass through a 24-hour on-chain timelock"),
    ("Admin / governance", "Same Squads multisig, bounded to operational parameter tuning, pause, unpause, and emergency-pause renouncement; no fund-spending path anywhere in the treasury program"),
    ("Emergency pause", "Admin multisig pauser role, timelock-exempt, scoped to buyback engine, cannot move funds, renounceable"),
    ("Total multisigs at Genesis", "One, holding both upgrade authority and on-chain admin"),
    ("Timelock duration", "24 hours for all non-pause admin actions and all upgrades; pause exempt"),
]



REFERENCES = [
    "Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System.",
    "Poon, J., and Dryja, T. (2016). The Bitcoin Lightning Network: Scalable Off-Chain Instant Payments.",
    "Solana Foundation. Solana Program and Account Model documentation.",
    "Raydium. Constant Product AMM program documentation.",
    "Squads. Multisig and timelock execution documentation.",
    "Jito. Bundled transaction execution documentation.",
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
        "a dual-signed proof that determines payment and CLAF emission. Providers select "
        "a protocol-fee tier between 0.5 percent and 3.0 percent, in 0.5 percent increments. "
        "For settlement amount A and selected rate r, treasury receives A x r and provider "
        "pending revenue receives A x (1 - r). "
        "CLAF emission follows a ten-year halving schedule, with 70 percent assigned "
        "to providers and 30 percent assigned to developers and users, weighted by "
        "actual protocol-fee contribution. The target treasury policy routes 100 percent of protocol "
        "fees through a buyback pipeline that dynamically allocates between burn and protocol-owned liquidity. "
        "The protocol does not verify model identity or inspect inference content. It is source-blind "
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
