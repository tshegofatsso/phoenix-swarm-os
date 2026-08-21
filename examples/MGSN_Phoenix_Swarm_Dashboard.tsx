import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// MGSN · FEWL · BBNC PARTNERSHIP — Phoenix-Swarm-OS Workflow
// Derived from the MGSN-FEWL-BBNC Operations Manual
// Orchestrated by THOMO Phoenix-Swarm-OS | Mabopane, Tshwane
// ═══════════════════════════════════════════════════════════════════════════════

// ── MGSN Brand Palette ────────────────────────────────────────────────────────
const M = {
  bg:     "#090f0f",
  sur:    "#0d1a19",
  panel:  "#111f1e",
  card:   "#152321",
  bdr:    "#1a2f2e",
  teal:   "#00A693",
  teal2:  "#1B5E5E",
  orange: "#FF8C42",
  yellow: "#FFD93D",
  red:    "#ef4444",
  muted:  "#3d5a58",
  text:   "#c8dbd9",
  dim:    "#5a7a78",
};

// ── Agent Registry ─────────────────────────────────────────────────────────────
const AGENTS = {
  THUSO:   { num:"01", role:"Chief of Staff",     spec:"Strategy & Orchestration",  color:"#f59e0b", orchestrator:true  },
  SIZWE:   { num:"02", role:"Backend Dev",         spec:"API & Infrastructure",      color:"#60a5fa", orchestrator:false },
  NALEDI:  { num:"03", role:"Community Lead",      spec:"MGSN & Outreach",           color:"#34d399", orchestrator:false },
  KGOSI:   { num:"04", role:"Security",            spec:"Auth & Compliance",         color:"#a78bfa", orchestrator:false },
  AMARA:   { num:"05", role:"Content",             spec:"Writing & Brand",           color:"#f472b6", orchestrator:false },
  LERATO:  { num:"06", role:"Client Relations",    spec:"Sales & Support",           color:"#fb923c", orchestrator:false },
  KATLEGO: { num:"07", role:"Investor Prep",       spec:"Pitch & Financial",         color:"#22d3ee", orchestrator:false },
  MONDE:   { num:"08", role:"Ops Scheduler",       spec:"Campaigns & Scheduling",   color:"#4ade80", orchestrator:false },
  LESEDI:  { num:"09", role:"Legal / Compliance",  spec:"Contracts & Regulation",   color:"#fbbf24", orchestrator:false },
  KEFILWE: { num:"10", role:"Investor Relations",  spec:"Capital & Partnerships",   color:"#e879f9", orchestrator:false },
};

const DOMAIN_C = {
  Governance:"#fbbf24", Community:"#34d399", Content:"#f472b6",
  Finance:"#22d3ee", Impact:"#a78bfa", Ops:"#f59e0b",
};

// ── Task Registry (23 tasks from Operations Manual) ────────────────────────────
const TASKS = [
  // ── GOVERNANCE ──
  {
    id:"G1", domain:"Governance", phase:"Governance",
    title:"NPC Constitutional Compliance & Steering Committee Protocol",
    partner:"MGSN",
    manual_ref:"§4.1, §5.1.4, §8",
    skillset:[
      "South African NPC Act (2008) interpretation",
      "CIPC annual return filing and deadline tracking",
      "Executive Steering Committee quorum, notice and voting rules",
      "Constitutional amendment drafting and ratification procedure",
      "Third-party financial commitment risk classification",
      "Fiduciary duty documentation for NPC board members",
    ],
    primary:"LESEDI",
    backup:"KGOSI",
    outputs:["CIPC compliance calendar","ESC resolution records","Constitutional amendment register"],
    deps:[],
    priority:"critical",
  },
  {
    id:"G2", domain:"Governance", phase:"Planning",
    title:"Project Proposal — Concept Note Writing & LogFrame",
    partner:"MGSN / All",
    manual_ref:"§5.1.1, §5.1.2",
    skillset:[
      "Logical Framework (LogFrame) methodology",
      "Theory of Change articulation with indicator linkage",
      "SMART objectives formulation for community programmes",
      "Budget estimation aligned to community project scale",
      "Risk-benefit narrative construction for ESC review",
      "NPC constitutional alignment statement drafting",
    ],
    primary:"THUSO",
    backup:"KATLEGO",
    outputs:["Concept note (1–2 pages)","Project brief","Risk summary"],
    deps:["G1"],
    priority:"high",
  },
  {
    id:"G3", domain:"Governance", phase:"Governance",
    title:"Formal Approval — 2/3 Majority Vote Facilitation",
    partner:"MGSN / All",
    manual_ref:"§5.1.4",
    skillset:[
      "Parliamentary procedure and structured meeting facilitation",
      "Multi-stakeholder consensus-building with conflict mediation",
      "Vote recording, documentation and archiving protocol",
      "Motion drafting and proposer/seconder assignment",
      "Contested decision arbitration and escalation pathways",
      "Post-vote action assignment and accountability tracking",
    ],
    primary:"THUSO",
    backup:"LESEDI",
    outputs:["Voting record","Ratified decision document","Action register"],
    deps:["G2","O1"],
    priority:"high",
  },
  {
    id:"G4", domain:"Governance", phase:"Governance",
    title:"Risk Register — Operational, Financial & Reputational",
    partner:"MGSN / All",
    manual_ref:"§7",
    skillset:[
      "Risk matrix construction (likelihood × impact scoring)",
      "NPC-sector risk taxonomy (programme, financial, regulatory, reputational)",
      "Reputational risk scenario modelling for community-facing organisations",
      "Contingency trigger protocol design with response thresholds",
      "Insurance and indemnity clause review for NPC activities",
      "Risk register maintenance and quarterly review facilitation",
    ],
    primary:"KGOSI",
    backup:"LESEDI",
    outputs:["Risk register (live document)","Mitigation action plan","Contingency protocols"],
    deps:["G1"],
    priority:"high",
  },
  {
    id:"G5", domain:"Governance", phase:"Governance",
    title:"Annual MoU Review & Partnership Assessment",
    partner:"MGSN / FEWL / BBNC",
    manual_ref:"§8",
    skillset:[
      "MoU clause-by-clause performance review methodology",
      "Partnership health assessment framework (accountability / communication / impact)",
      "Strategic planning facilitation for Year 2+ objectives",
      "Amendment drafting and ratification by all parties",
      "Lessons learned documentation (what worked / what failed / what to change)",
      "Renewal or renegotiation protocol with timeline management",
    ],
    primary:"THUSO",
    backup:"LESEDI",
    outputs:["Annual partnership review report","Amended MoU / addendum","Y2 strategic plan"],
    deps:["I3","F3","G3"],
    priority:"high",
  },
  {
    id:"G6", domain:"Governance", phase:"Governance",
    title:"FEWL Legal Status & Operational Capacity Due Diligence",
    partner:"MGSN / FEWL",
    manual_ref:"§4.2",
    skillset:[
      "Business registration verification (CIPC entity search)",
      "Tax clearance certificate validity assessment",
      "B-BBEE status and level verification for contracting",
      "Operational capacity assessment framework design",
      "Contractual scope of work drafting (services / deliverables / timelines)",
      "Accountability matrix update to reflect verified FEWL contribution",
    ],
    primary:"LESEDI",
    backup:"KEFILWE",
    outputs:["FEWL due diligence report","Scope of work annex","Updated accountability matrix"],
    deps:["G1"],
    priority:"critical",
  },
  // ── COMMUNITY ──
  {
    id:"C1", domain:"Community", phase:"Execution",
    title:"Community Mobilization & Engagement",
    partner:"MGSN",
    manual_ref:"§4.1",
    skillset:[
      "Ubuntu-grounded facilitation (collective decision-making, respect for elders)",
      "Setswana / isiNdebele multilingual communication and code-switching",
      "Township social capital mapping (key influencers, gatekeepers, networks)",
      "Ward committee and sub-council liaison protocol",
      "Grassroots leadership identification and activation strategy",
      "Community needs assessment using participatory appraisal (PRA) tools",
    ],
    primary:"NALEDI",
    backup:"LERATO",
    outputs:["Community engagement log","Stakeholder map","Ward liaison record"],
    deps:["G2","O1"],
    priority:"critical",
  },
  {
    id:"C2", domain:"Community", phase:"Planning",
    title:"Local Authority & Community Leader Relationship Management",
    partner:"MGSN",
    manual_ref:"§4.1",
    skillset:[
      "City of Tshwane municipal stakeholder protocol and hierarchy awareness",
      "Ward councillor communication etiquette and meeting request procedure",
      "Formal letter and memorandum drafting (official letterhead, reference numbers)",
      "Meeting minute production (verbatim decisions, action owners, deadlines)",
      "Intergovernmental relations navigation (district / metro / national interfaces)",
      "Follow-up action tracking and escalation pathway management",
    ],
    primary:"THUSO",
    backup:"LERATO",
    outputs:["Authority correspondence file","Municipal relationship log","Meeting minutes"],
    deps:["G2"],
    priority:"high",
  },
  {
    id:"C3", domain:"Community", phase:"Execution",
    title:"Monthly Upcycling Workshop — Curriculum Design & Facilitation",
    partner:"MGSN / FEWL",
    manual_ref:"§4.1, §4.2",
    skillset:[
      "Adult learning facilitation (andragogy — experiential, peer-to-peer learning)",
      "Hands-on skills transfer methodology (demonstrate → practice → assess)",
      "Upcycling material sourcing logistics and supplier relationship management",
      "Tool safety briefing design and workplace health compliance",
      "Participant skill acquisition assessment rubric (pre/post competency mapping)",
      "Workshop attendance register management and digital record transfer",
    ],
    primary:"NALEDI",
    backup:"AMARA",
    outputs:["Workshop curriculum","Skills assessment results","Attendance register"],
    deps:["C1","C5","N2"],
    priority:"critical",
  },
  {
    id:"C4", domain:"Community", phase:"Execution",
    title:"Community Clean-up & Awareness Activity Coordination",
    partner:"MGSN / BBNC",
    manual_ref:"§4.1, §4.3",
    skillset:[
      "Event logistics planning (site layout, tool library checkout, access management)",
      "Volunteer roster design with role-specific assignments and contingency cover",
      "Environmental health and safety briefing (PPE, hazard identification, first aid)",
      "Waste stream classification (recyclable / hazardous / organic / landfill)",
      "Post-event impact documentation (before/after photos, volume metrics)",
      "Co-ordination handover to BBNC for real-time documentation and social media",
    ],
    primary:"MONDE",
    backup:"NALEDI",
    outputs:["Event plan","Volunteer register","Impact measurement record","Media handover brief"],
    deps:["C1","C5","O1"],
    priority:"high",
  },
  {
    id:"C5", domain:"Community", phase:"Execution",
    title:"Community Volunteer Access Facilitation & Retention",
    partner:"MGSN",
    manual_ref:"§4.1",
    skillset:[
      "Volunteer database design and ongoing maintenance (name, skills, availability, contacts)",
      "Skills-based volunteer matching to specific programme roles",
      "Volunteer onboarding protocol (orientation, safety briefing, NPC values alignment)",
      "Volunteer retention strategy (recognition, progression pathways, community belonging)",
      "Community trust-building communication calendar design",
      "Volunteer recognition framework (certificates, public acknowledgement, references)",
    ],
    primary:"NALEDI",
    backup:"MONDE",
    outputs:["Volunteer database","Onboarding pack","Recognition framework"],
    deps:["C1"],
    priority:"high",
  },
  // ── CONTENT ──
  {
    id:"N1", domain:"Content", phase:"Execution",
    title:"Environmental Education Materials Development",
    partner:"MGSN / FEWL",
    manual_ref:"§4.1, §4.2",
    skillset:[
      "Plain-language environmental science writing calibrated to Grade 7–9 comprehension",
      "Setswana / English bilingual content production with consistent terminology",
      "Community literacy calibration (visual-dominant design for lower literacy audiences)",
      "Infographic design brief writing (layout, hierarchy, icon set, colour palette)",
      "Indigenous and traditional ecological knowledge integration",
      "Print specification management (format, paper stock, run quantity, printer liaison)",
    ],
    primary:"AMARA",
    backup:"NALEDI",
    outputs:["Education materials pack","Bilingual infographics","Print-ready files"],
    deps:["G2","C1"],
    priority:"medium",
  },
  {
    id:"N2", domain:"Content", phase:"Execution",
    title:"Photography & Videography Event Documentation (BBNC mandate)",
    partner:"BBNC",
    manual_ref:"§4.3",
    skillset:[
      "Impact narrative visual framing (hero shots, process documentation, community faces)",
      "Event photography direction brief (shot list, angles, lighting conditions, access plan)",
      "Short-form video storyboarding — 30–90 second reels optimised for social platforms",
      "Before/after environmental documentation methodology for measurable visual impact",
      "Participant media release form management and consent record keeping",
      "Media asset cataloguing, labelling, and structured handover to MGSN and FEWL",
    ],
    primary:"AMARA",
    backup:"MONDE",
    outputs:["Photo archive","Short-form video reels","Media handover pack","Release form register"],
    deps:["C4","C3","O1"],
    priority:"high",
  },
  {
    id:"N3", domain:"Content", phase:"Execution",
    title:"Social Media Strategy & Online Presence Management (BBNC mandate)",
    partner:"BBNC",
    manual_ref:"§4.3",
    skillset:[
      "Platform-specific content optimisation (Instagram Reels / Facebook / WhatsApp Status / TikTok)",
      "Township audience tone calibration (kasi vocabulary, local cultural references, celebration)",
      "Campaign hashtag strategy and community hashtag adoption planning",
      "Community management — comment response, DM handling, trust-building engagement",
      "Engagement analytics interpretation (reach, saves, shares, profile visits)",
      "Content calendar scheduling across all platforms with event-aligned posting cadence",
    ],
    primary:"AMARA",
    backup:"MONDE",
    outputs:["Content calendar","Platform analytics report","Community management log"],
    deps:["N2"],
    priority:"high",
  },
  {
    id:"N4", domain:"Content", phase:"Governance",
    title:"Co-branding & Multi-partner PR Approval Workflow",
    partner:"MGSN / FEWL / BBNC",
    manual_ref:"§5.4",
    skillset:[
      "Brand guideline enforcement across three independent organisations",
      "Multi-stakeholder approval chain design (designated representative per organisation)",
      "Press release drafting — structured, attribution-complete, journalist-ready",
      "Media attribution protocol — ensuring BBNC, MGSN, FEWL credit on all content",
      "Co-branding consistency checklist (logo placement, colour compliance, naming conventions)",
      "Crisis communication readiness — response protocol for negative media or community incidents",
    ],
    primary:"AMARA",
    backup:"LERATO",
    outputs:["Brand approval checklist","PR template library","Crisis response protocol"],
    deps:["G6","N2","N3"],
    priority:"high",
  },
  // ── FINANCE ──
  {
    id:"F1", domain:"Finance", phase:"Planning",
    title:"Project Budget Development — Activity-based Cost Estimation",
    partner:"MGSN / All",
    manual_ref:"§5.3",
    skillset:[
      "Activity-based costing aligned to project work breakdown structure",
      "Community project expense forecasting (materials, transport, catering, venue, facilitation)",
      "Cost-sharing formula design — proportional / equal split / contribution-in-kind valuation",
      "Funder and grant budget template compliance (SETA / CoT / private foundation formats)",
      "Contingency allocation standard (10–15%) with justification narrative",
      "Materials cost inflation sensitivity analysis for 12-month project periods",
    ],
    primary:"KATLEGO",
    backup:"LESEDI",
    outputs:["Project budget (Excel/PDF)","Cost-sharing schedule","Budget narrative for funders"],
    deps:["G2"],
    priority:"critical",
  },
  {
    id:"F2", domain:"Finance", phase:"Execution",
    title:"Revenue Sharing Mechanism — Market Day & Joint Initiative Proceeds",
    partner:"MGSN / FEWL / BBNC",
    manual_ref:"§5.3",
    skillset:[
      "Revenue waterfall structure design (priority of payment, surplus distribution)",
      "Pre-agreed sharing addendum drafting (legally binding MoU supplement)",
      "Vendor contribution tracking and market day revenue reconciliation",
      "Cash handling and reconciliation protocol for public event environments",
      "Income-generating activity financial modelling (break-even, margins, sustainability)",
      "SARS awareness: NPC trading income, exemption conditions, reporting thresholds",
    ],
    primary:"KATLEGO",
    backup:"LESEDI",
    outputs:["Revenue sharing addendum","Cash reconciliation template","Market day financial model"],
    deps:["F1","G3"],
    priority:"high",
  },
  {
    id:"F3", domain:"Finance", phase:"Reporting",
    title:"Financial Reporting — Project-level Statements & Audit Trail",
    partner:"MGSN",
    manual_ref:"§5.3, §6.2",
    skillset:[
      "Expense ledger management with activity and budget line code tagging",
      "Funder-compliant financial report narrative (spend vs budget, variance explanation)",
      "Receipts and invoices reconciliation with bank statement matching",
      "Bank statement and payment proof attachment and archiving workflow",
      "Financial dashboard design for non-finance stakeholders (visual, simplified)",
      "Audit trail documentation — paper and digital trail for external auditor access",
    ],
    primary:"KATLEGO",
    backup:"SIZWE",
    outputs:["Financial report (per project)","Reconciled expense ledger","Audit-ready folder"],
    deps:["F1","F2","I3"],
    priority:"high",
  },
  // ── IMPACT ──
  {
    id:"I1", domain:"Impact", phase:"Planning",
    title:"KPI Framework Design — Community, Environmental & Economic Metrics",
    partner:"MGSN",
    manual_ref:"§6.1",
    skillset:[
      "Theory of Change indicator derivation (output → outcome → impact linkage)",
      "Social Return on Investment (SROI) methodology for community programmes",
      "Environmental outcome quantification: waste volume (kg), green area (m²), dumping site reduction count",
      "Economic indicator tracking: vendor income (R), participant earnings, skills uplift wage premium",
      "Baseline data collection design — establishing pre-programme reference points",
      "KPI target-setting with realistic community programme benchmarks",
    ],
    primary:"KATLEGO",
    backup:"SIZWE",
    outputs:["KPI framework document","Baseline dataset","Target-setting rationale"],
    deps:["G2","F1"],
    priority:"critical",
  },
  {
    id:"I2", domain:"Impact", phase:"Execution",
    title:"Data Collection System — Participant Surveys & Event Records",
    partner:"MGSN / All",
    manual_ref:"§6.2",
    skillset:[
      "Participatory survey design: Likert scale + open-ended narrative balance",
      "Multilingual questionnaire adaptation (Setswana / English parallel versions)",
      "Attendance register digitisation (paper-to-digital transfer, de-duplication)",
      "Data entry validation rules (range checks, mandatory fields, duplicate detection)",
      "Offline-capable data collection tools for field use (no WiFi dependency)",
      "Data storage, backup protocol and access control for participant privacy",
    ],
    primary:"SIZWE",
    backup:"NALEDI",
    outputs:["Survey instruments","Attendance database","Data validation ruleset","Offline collection tool"],
    deps:["I1","C3","C4"],
    priority:"high",
  },
  {
    id:"I3", domain:"Impact", phase:"Reporting",
    title:"Quarterly Impact Report Compilation & Cross-partner Sign-off",
    partner:"MGSN / All",
    manual_ref:"§6.2",
    skillset:[
      "Multi-stream data aggregation across 3 partners and multiple programmes",
      "KPI vs target variance analysis with root cause narrative for underperformance",
      "Successes / challenges narrative synthesis (evidence-based, specific, honest)",
      "Infographic data brief for AMARA to visualise key metrics",
      "Funder and donor-grade report writing (clarity, evidence citation, impact framing)",
      "Cross-partner data reconciliation and three-party sign-off workflow management",
    ],
    primary:"KATLEGO",
    backup:"AMARA",
    outputs:["Quarterly impact report","KPI tracker","Infographic data brief","Signed sign-off record"],
    deps:["I2","F3","N3"],
    priority:"critical",
  },
  // ── OPS ──
  {
    id:"O1", domain:"Ops", phase:"Planning",
    title:"Monthly Check-in Meeting — Agenda, Minutes & Action Tracker",
    partner:"MGSN / FEWL / BBNC",
    manual_ref:"§5.2",
    skillset:[
      "Timed, outcome-oriented agenda design (objectives per item, discussion time allocation)",
      "Verbatim decision minute-taking with action owner, deadline and accountability assignment",
      "Rotating minute-taker roster management (quarterly schedule, advance notice)",
      "48-hour post-meeting minute circulation protocol with confirmation receipt",
      "Action tracker maintenance between meetings (colour-coded RAG status, escalation flags)",
      "Meeting evaluation — assessing whether objectives were met and what to improve",
    ],
    primary:"MONDE",
    backup:"THUSO",
    outputs:["Meeting agenda","Signed minutes","Action tracker (live)","Meeting effectiveness log"],
    deps:[],
    priority:"critical",
  },
  {
    id:"O2", domain:"Ops", phase:"Execution",
    title:"Primary Contact Communication Management — Email & Formal Correspondence",
    partner:"MGSN / FEWL / BBNC",
    manual_ref:"§5.2",
    skillset:[
      "Multi-stakeholder email protocol (CC / BCC discipline, reply-all hygiene, subject line standards)",
      "Formal business correspondence production (letterhead, reference numbers, addressee protocol)",
      "Response time SLA management per contact tier (partner / authority / funder / public)",
      "Email thread archiving and retrieval system (folder taxonomy, search tagging)",
      "Escalation path for unresolved issues (from contact → management → ESC)",
      "Correspondence filing system (digital and physical, indexed, access-controlled)",
    ],
    primary:"MONDE",
    backup:"LERATO",
    outputs:["Communication register","Correspondence archive","Escalation log","SLA compliance record"],
    deps:["O1"],
    priority:"medium",
  },
];

// ── Phase definitions ──────────────────────────────────────────────────────────
const PHASES = [
  { key:"Planning",    label:"Phase 1 — Planning",    color:"#f59e0b", desc:"Concept, budgets, KPIs, meeting cadence" },
  { key:"Execution",   label:"Phase 2 — Execution",   color:"#34d399", desc:"Community, content, data collection, ops" },
  { key:"Reporting",   label:"Phase 3 — Reporting",   color:"#60a5fa", desc:"Financial, impact, cross-partner sign-off" },
  { key:"Governance",  label:"Phase 4 — Governance",  color:"#fbbf24", desc:"Compliance, approvals, risk, annual review" },
];

// ── Workflow sequence (THUSO orchestration logic) ──────────────────────────────
const WORKFLOW = [
  { phase:"Planning",
    steps:[
      { from:"THUSO", to:"MONDE",   action:"Activate meeting cadence — monthly check-in (O1)" },
      { from:"THUSO", to:"THUSO",   action:"Draft concept notes & authority relationship plan (G2, C2)" },
      { from:"THUSO", to:"KATLEGO", action:"Commission budget development and KPI framework (F1, I1)" },
      { from:"LESEDI", to:"THUSO",  action:"Confirm FEWL legal status before engaging them (G6)" },
    ]
  },
  { phase:"Execution",
    steps:[
      { from:"THUSO", to:"NALEDI",  action:"Activate community mobilization and volunteer recruitment (C1, C5)" },
      { from:"NALEDI", to:"MONDE",  action:"Hand off event logistics for clean-ups and workshops (C3, C4)" },
      { from:"MONDE", to:"AMARA",   action:"Provide event brief for documentation and content (N2)" },
      { from:"AMARA", to:"AMARA",   action:"Parallel: education materials + social media (N1, N3)" },
      { from:"SIZWE", to:"NALEDI",  action:"Deploy data collection tools in field (I2)" },
      { from:"KATLEGO", to:"LESEDI",action:"Revenue sharing addendum before Market Day (F2)" },
    ]
  },
  { phase:"Reporting",
    steps:[
      { from:"SIZWE", to:"KATLEGO", action:"Transfer collected data for impact aggregation (I2 → I3)" },
      { from:"KATLEGO", to:"AMARA", action:"Commission infographic brief from impact data (I3)" },
      { from:"KATLEGO", to:"THUSO", action:"Submit financial + impact report for ESC review (F3, I3)" },
    ]
  },
  { phase:"Governance",
    steps:[
      { from:"LESEDI", to:"THUSO",  action:"NPC compliance calendar — trigger ESC where needed (G1)" },
      { from:"THUSO", to:"ALL",     action:"Facilitate 2/3 majority vote on significant proposals (G3)" },
      { from:"KGOSI", to:"THUSO",   action:"Risk register review — flag escalations (G4)" },
      { from:"THUSO", to:"LESEDI",  action:"Annual MoU review and amendment drafting (G5)" },
      { from:"AMARA", to:"THUSO",   action:"Co-branded materials approved before publication (N4)" },
    ]
  },
];

// ── HELPERS ────────────────────────────────────────────────────────────────────
function AgBadge({ name, size="sm" }) {
  const a = AGENTS[name];
  if (!a) return null;
  const fs = size === "lg" ? 11 : 9;
  const pad = size === "lg" ? "4px 10px" : "2px 6px";
  return (
    <span style={{ background: a.color + "18", border: `1px solid ${a.color}40`, borderRadius: 4, padding: pad, fontSize: fs, color: a.color, fontFamily: "monospace", fontWeight: 700, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: fs - 1, opacity: 0.7 }}>{a.num}</span> {name}
    </span>
  );
}

function PriorityDot({ p }) {
  const c = p === "critical" ? "#ef4444" : p === "high" ? "#f59e0b" : "#60a5fa";
  const label = p === "critical" ? "CRITICAL" : p === "high" ? "HIGH" : "MEDIUM";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 8, color: c, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c, display: "inline-block" }} />
      {label}
    </span>
  );
}

// ── TASK CARD ──────────────────────────────────────────────────────────────────
function TaskCard({ task, compact = false }) {
  const [open, setOpen] = useState(false);
  const dc = DOMAIN_C[task.domain] || "#9ca3af";
  const pa = AGENTS[task.primary];

  return (
    <div style={{ background: M.card, border: `1px solid ${open ? pa?.color + "40" : M.bdr}`, borderRadius: 8, marginBottom: 6, overflow: "hidden", transition: "border-color 0.2s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: compact ? "8px 10px" : "10px 13px", cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        <div style={{ width: 3, minHeight: 24, background: dc, borderRadius: 2, flexShrink: 0, alignSelf: "stretch" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: compact ? 11 : 12, fontWeight: 600, color: M.text, lineHeight: 1.4, marginBottom: 4 }}>{task.title}</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
            <AgBadge name={task.primary} />
            <span style={{ fontSize: 8, color: M.muted, background: M.sur, borderRadius: 3, padding: "1px 5px", fontFamily: "monospace" }}>backup: {task.backup}</span>
            <PriorityDot p={task.priority} />
            <span style={{ fontSize: 8, color: dc, background: dc + "12", borderRadius: 3, padding: "1px 5px", fontFamily: "monospace" }}>{task.domain}</span>
          </div>
        </div>
        <span style={{ fontSize: 10, color: M.muted, flexShrink: 0, marginTop: 2 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 13px 13px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 9, color: M.muted, fontFamily: "monospace" }}>Manual ref: {task.manual_ref} | Partner: {task.partner}</div>

          <div>
            <div style={{ fontSize: 9, color: M.teal, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "monospace", fontWeight: 700 }}>Required Skillset</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {task.skillset.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ color: M.teal, fontSize: 10, flexShrink: 0, marginTop: 1 }}>◆</span>
                  <span style={{ fontSize: 11, color: "#a0b8b5", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 9, color: M.teal, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, fontFamily: "monospace", fontWeight: 700 }}>Expected Outputs</div>
              {task.outputs.map((o, i) => <div key={i} style={{ fontSize: 11, color: M.text, marginBottom: 3, display: "flex", gap: 5, alignItems: "flex-start" }}><span style={{ color: "#34d399", fontSize: 9, marginTop: 2 }}>✓</span>{o}</div>)}
            </div>
            <div>
              <div style={{ fontSize: 9, color: M.teal, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5, fontFamily: "monospace", fontWeight: 700 }}>Agent Assignment</div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 9, color: M.dim, marginBottom: 3 }}>Primary</div>
                <AgBadge name={task.primary} size="lg" />
              </div>
              <div>
                <div style={{ fontSize: 9, color: M.dim, marginBottom: 3 }}>Backup / Competitor Stack</div>
                <AgBadge name={task.backup} size="lg" />
              </div>
            </div>
          </div>

          {task.deps.length > 0 && (
            <div style={{ background: M.sur, borderRadius: 6, padding: "8px 10px", fontSize: 10, color: M.dim }}>
              <span style={{ color: M.orange, fontWeight: 700 }}>Dependencies: </span>
              {task.deps.map(d => {
                const dep = TASKS.find(t => t.id === d);
                return <span key={d} style={{ color: M.text, marginRight: 8 }}>→ {dep?.title?.split("—")[0]?.trim() || d}</span>;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── WORKFLOW STEP ──────────────────────────────────────────────────────────────
function WorkflowStep({ step, idx }) {
  const fromA = AGENTS[step.from];
  const toA = AGENTS[step.to];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: M.card, borderRadius: 7, marginBottom: 5, border: `1px solid ${M.bdr}` }}>
      <span style={{ fontSize: 9, color: M.muted, fontFamily: "monospace", width: 14, flexShrink: 0 }}>{idx + 1}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: fromA?.color || M.teal, fontFamily: "monospace", fontWeight: 700 }}>{step.from}</span>
        <span style={{ fontSize: 12, color: M.muted }}>→</span>
        <span style={{ fontSize: 10, color: toA?.color || M.teal, fontFamily: "monospace", fontWeight: 700 }}>{step.to}</span>
      </div>
      <div style={{ fontSize: 11, color: M.text, lineHeight: 1.4 }}>{step.action}</div>
    </div>
  );
}

// ── AGENT HUB CARD ─────────────────────────────────────────────────────────────
function AgentHubCard({ name }) {
  const a = AGENTS[name];
  const primary = TASKS.filter(t => t.primary === name);
  const backup  = TASKS.filter(t => t.backup  === name);
  const [open, setOpen] = useState(false);
  const load = primary.length + backup.length * 0.3;
  const barW = Math.min(100, load / 8 * 100);

  return (
    <div style={{ background: M.card, border: `1px solid ${open ? a.color + "50" : M.bdr}`, borderRadius: 10, overflow: "hidden", transition: "border-color 0.2s" }}>
      <div style={{ padding: "13px 14px", cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 9, background: a.color + "18", border: `1px solid ${a.color}40`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 7, color: a.color, fontFamily: "monospace", lineHeight: 1 }}>{a.num}</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: a.color, lineHeight: 1 }}>{name.slice(0, 3)}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: M.text, display: "flex", alignItems: "center", gap: 6 }}>
              {name} {a.orchestrator && <span style={{ fontSize: 8, color: a.color, background: a.color + "15", border: `1px solid ${a.color}30`, borderRadius: 3, padding: "1px 5px", fontFamily: "monospace" }}>ORCH</span>}
            </div>
            <div style={{ fontSize: 10, color: a.color, marginBottom: 2 }}>{a.role}</div>
            <div style={{ fontSize: 9, color: M.dim }}>{a.spec}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: a.color, lineHeight: 1 }}>{primary.length}</div>
            <div style={{ fontSize: 8, color: M.muted, fontFamily: "monospace" }}>primary</div>
          </div>
        </div>
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 9, color: M.dim, fontFamily: "monospace" }}>task load</span>
            <span style={{ fontSize: 9, color: a.color, fontFamily: "monospace" }}>{primary.length}p + {backup.length}b</span>
          </div>
          <div style={{ height: 3, background: M.bdr, borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${barW}%`, background: a.color, borderRadius: 2 }} />
          </div>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 14px 14px" }}>
          {primary.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: a.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "monospace", fontWeight: 700 }}>Primary Tasks ({primary.length})</div>
              {primary.map(t => <TaskCard key={t.id} task={t} compact />)}
            </div>
          )}
          {backup.length > 0 && (
            <div>
              <div style={{ fontSize: 9, color: M.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "monospace", fontWeight: 700 }}>Backup / Competitor Skill Stack ({backup.length})</div>
              {backup.map(t => (
                <div key={t.id} style={{ display: "flex", gap: 6, marginBottom: 4, padding: "5px 8px", background: M.sur, borderRadius: 6 }}>
                  <AgBadge name={t.primary} />
                  <span style={{ fontSize: 11, color: M.dim }}>→ {t.title.split("—")[0].trim()}</span>
                </div>
              ))}
            </div>
          )}
          {primary.length === 0 && backup.length === 0 && (
            <div style={{ fontSize: 11, color: M.muted, fontStyle: "italic" }}>No tasks assigned in this partnership scope. Available for activation.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── PHOENIX-COMMAND LANGUAGE (PCL) v1.09-pre — log line formatter ─────────────
// Renders each swarm action as a real PCL command string for the convening console.
function pclLine(step, task) {
  if (step.to === "ALL") return `convene $MGSN-FEWL-BBNC :: "${step.action}" !critical`;
  if (task) {
    const dep = task.deps[0] ? ` <~ #${task.deps[0]}` : "";
    return `delegate #${task.id} -> @${step.to}${dep}`;
  }
  return `status @${step.to} :: "${step.action}"`;
}

// Flatten WORKFLOW into a single ordered sequence with phase tags + PCL lines
function buildConveneSequence() {
  const seq = [];
  WORKFLOW.forEach(wf => {
    wf.steps.forEach(step => {
      const relatedTask = TASKS.find(t => t.phase === wf.phase && t.primary === step.to);
      seq.push({
        phase: wf.phase,
        from: step.from,
        to: step.to,
        action: step.action,
        pcl: pclLine(step, relatedTask),
        taskId: relatedTask?.id || null,
      });
    });
  });
  // Closing commit line
  seq.push({ phase: "Governance", from: "THUSO", to: "ALL", action: "Swarm convening complete — all phases acknowledged", pcl: `commit $MGSN-FEWL-BBNC :: "23 tasks delegated across 8 agents, 4 phases"`, taskId: null });
  return seq;
}
const CONVENE_SEQ = buildConveneSequence();

// ── NEW: Agent suggestion engine (problem-driven) ──────────────────────────────
const SKILL_MAP = {
  THUSO:   ["strategy","orchestration","planning","governance","coordination","approval","steering"],
  SIZWE:   ["data","survey","database","offline","collection","backend","api","infrastructure"],
  NALEDI:  ["community","volunteer","workshop","mobilisation","engagement","upcycling","clean-up","outreach","grassroots"],
  KGOSI:   ["security","risk","auth","compliance","safety","threat"],
  AMARA:   ["content","education","materials","video","photo","social","media","brand","infographic","pr"],
  LERATO:  ["client","support","relationship","communication","sales","customer"],
  KATLEGO: ["budget","finance","kpi","financial","revenue","cost","impact","report","investor"],
  MONDE:   ["logistics","event","schedule","clean-up","coordination","volunteer","access","operations"],
  LESEDI:  ["compliance","legal","npc","contract","governance","regulatory","mou","due diligence"],
  KEFILWE: ["investor","capital","partnership","financial","pitch","funding"],
};

function suggestAgents(problemText) {
  const words = problemText.toLowerCase().split(/\s+/);
  const scores = {};
  Object.keys(SKILL_MAP).forEach(agent => {
    scores[agent] = SKILL_MAP[agent].filter(kw => words.some(w => w.includes(kw) || kw.includes(w))).length;
  });
  // Sort descending, take top scorers with score > 0, max 5
  const sorted = Object.entries(scores).filter(([a, s]) => s > 0).sort((a,b) => b[1]-a[1]);
  return sorted.slice(0, 5).map(([a]) => a);
}

function buildDynamicSequence(selectedAgents, problemText) {
  // Find tasks where primary is in selectedAgents
  const relevantTasks = TASKS.filter(t => selectedAgents.includes(t.primary));
  // Sort by phase order
  const phaseOrder = ["Planning", "Execution", "Reporting", "Governance"];
  const sorted = relevantTasks.sort((a,b) => phaseOrder.indexOf(a.phase) - phaseOrder.indexOf(b.phase));
  // Convert to PCL steps (like CONVENE_SEQ format)
  return sorted.map(task => ({
    phase: task.phase,
    from: "THUSO",
    to: task.primary,
    action: `Delegate ${task.id} – ${task.title}`,
    pcl: `delegate #${task.id} -> @${task.primary}`,
    taskId: task.id
  }));
}

// ── MAIN ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]       = useState("overview");
  const [domainF, setDomainF] = useState("All");
  const [phaseF, setPhaseF]   = useState("All");
  const [search, setSearch]   = useState("");
  const [agentF, setAgentF]   = useState("All");

  // Autonomous Swarm Convening state (existing)
  const [convening, setConvening]     = useState(false);
  const [conveneLog, setConveneLog]   = useState([]);
  const [conveneIdx, setConveneIdx]   = useState(0);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const timerRef = useRef(null);

  // NEW: Problem-driven convening states
  const [problem, setProblem]         = useState("");
  const [proposedAgents, setProposedAgents] = useState([]);
  const [dynamicSeq, setDynamicSeq]   = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDynamic, setIsDynamic]     = useState(false);   // flag to use dynamic sequence

  // ── Filtered tasks ──
  const allDomains  = ["All", "Governance", "Community", "Content", "Finance", "Impact", "Ops"];
  const allPhases   = ["All", "Planning", "Execution", "Reporting", "Governance"];
  const allAgents   = ["All", ...Object.keys(AGENTS)];

  const filtered = TASKS.filter(t =>
    (domainF === "All" || t.domain === domainF) &&
    (phaseF  === "All" || t.phase  === phaseF)  &&
    (agentF  === "All" || t.primary === agentF || t.backup === agentF) &&
    (search === "" || t.title.toLowerCase().includes(search.toLowerCase()) || t.skillset.some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  // ── Autonomous Swarm Convening engine (enhanced for dynamic) ──
  const startConvene = (dynamic = false, seq = null) => {
    setConveneLog([]);
    setConveneIdx(0);
    setConvening(true);
    setConsoleOpen(true);
    setIsDynamic(dynamic);
    if (dynamic && seq) {
      setDynamicSeq(seq);
    } else {
      setDynamicSeq([]);
    }
  };

  const stopConvene = () => {
    setConvening(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetConvene = () => {
    stopConvene();
    setConveneLog([]);
    setConveneIdx(0);
    setIsDynamic(false);
    setDynamicSeq([]);
  };

  // ── Effect to drive the convening timer ──
  useEffect(() => {
    if (!convening) return;
    const seq = isDynamic ? dynamicSeq : CONVENE_SEQ;
    if (seq.length === 0) {
      setConvening(false);
      return;
    }
    timerRef.current = setInterval(() => {
      setConveneIdx(i => {
        const next = i + 1;
        if (next > seq.length) {
          clearInterval(timerRef.current);
          setConvening(false);
          return i;
        }
        setConveneLog(log => [...log, { ...seq[i], ts: Date.now() }]);
        return next;
      });
    }, 850);
    return () => clearInterval(timerRef.current);
  }, [convening, isDynamic, dynamicSeq]);

  const conveneComplete = conveneIdx >= (isDynamic ? dynamicSeq.length : CONVENE_SEQ.length) && conveneLog.length > 0;
  const totalSteps = isDynamic ? dynamicSeq.length : CONVENE_SEQ.length;
  const convenePct = totalSteps > 0 ? Math.round((conveneIdx / totalSteps) * 100) : 0;

  // ── Handlers for problem-driven flow ──
  const handleAnalyse = () => {
    if (!problem.trim()) return;
    const agents = suggestAgents(problem);
    setProposedAgents(agents);
    if (agents.length > 0) {
      const seq = buildDynamicSequence(agents, problem);
      setDynamicSeq(seq);
      setShowConfirmModal(true);
    } else {
      alert("No agents matched your problem. Please rephrase or browse tasks manually.");
    }
  };

  const handleConfirmDynamic = () => {
    setShowConfirmModal(false);
    if (dynamicSeq.length > 0) {
      startConvene(true, dynamicSeq);
    }
  };

  const handleCancelDynamic = () => {
    setShowConfirmModal(false);
    setProposedAgents([]);
    setDynamicSeq([]);
  };

  // ── PDF Export (browser print-to-PDF) ──
  const exportPDF = (viewLabel) => {
    document.title = `MGSN-FEWL-BBNC · ${viewLabel} · Phoenix-Swarm-OS`;
    window.print();
  };

  const VIEWS = [
    { k: "overview",  label: "Overview"       },
    { k: "solver",    label: "🧠 Solver"      }, // NEW
    { k: "workflow",  label: "⬡ Workflow"     },
    { k: "tasks",     label: "◈ Task Registry" },
    { k: "agents",    label: "◆ Agent Hub"    },
  ];

  const totalCritical = TASKS.filter(t => t.priority === "critical").length;
  const totalHigh     = TASKS.filter(t => t.priority === "high").length;

  return (
    <div style={{ minHeight: "100vh", background: M.bg, color: M.text, fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input:focus,select:focus{outline:none;}
        ::-webkit-scrollbar{width:4px;background:${M.bg}}
        ::-webkit-scrollbar-thumb{background:${M.bdr};border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%{opacity:0.35}50%{opacity:1}100%{opacity:0.35}}
        .fu{animation:fadeUp 0.3s ease forwards}
        .no-print{}
        @media print {
          body{background:#fff!important;}
          .no-print{display:none!important;}
          .print-area{background:#fff!important;color:#111!important;}
          .print-area *{color:#111!important;}
          .print-area div{background:transparent!important;border-color:#ccc!important;}
        }
        /* Modal overlay */
        .modal-overlay {
          position: fixed;
          top:0; left:0; width:100%; height:100%;
          background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 999;
        }
        .modal-content {
          background: ${M.panel};
          border: 1px solid ${M.teal}40;
          border-radius: 16px;
          max-width: 640px;
          width: 90%;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          max-height: 80vh;
          overflow-y: auto;
        }
      `}</style>

      {/* HEADER */}
      <div className="no-print" style={{ background: M.sur, borderBottom: `1px solid ${M.bdr}`, padding: "0 20px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: M.teal, letterSpacing: "0.08em", fontFamily: "monospace" }}>MGSN · FEWL · BBNC</span>
            <span style={{ fontSize: 9, color: M.dim, fontFamily: "monospace" }}>Phoenix-Swarm-OS · Operations Workflow</span>
          </div>
          <div style={{ fontSize: 9, color: M.muted, marginTop: 1 }}>Mabopane Green Space Network NPC · Orchestrated by THUSO (01)</div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={convening ? stopConvene : startConvene} style={{ display: "flex", alignItems: "center", gap: 6, background: convening ? "#ef444415" : M.teal + "18", border: `1px solid ${convening ? "#ef444440" : M.teal + "40"}`, borderRadius: 6, padding: "5px 11px", cursor: "pointer", fontSize: 10, color: convening ? "#ef4444" : M.teal, fontFamily: "monospace", fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: convening ? "#ef4444" : M.teal, display: "inline-block", animation: convening ? "pulse 1s infinite" : "none" }} />
            {convening ? "Stop Convening" : conveneComplete ? "Re-convene Swarm" : "⬡ Convene Swarm"}
          </button>
          {conveneLog.length > 0 && <button onClick={() => setConsoleOpen(o => !o)} style={{ background: "transparent", border: `1px solid ${M.bdr}`, borderRadius: 6, padding: "5px 9px", cursor: "pointer", fontSize: 10, color: M.dim, fontFamily: "monospace" }}>{consoleOpen ? "Hide Console" : "Show Console"}</button>}
          <div style={{ width: 1, height: 22, background: M.bdr }} />
          <div style={{ background: "#ef444415", border: "1px solid #ef444430", borderRadius: 5, padding: "3px 8px", fontSize: 9, color: "#ef4444", fontFamily: "monospace" }}>{totalCritical} CRITICAL</div>
          <div style={{ background: M.orange + "15", border: `1px solid ${M.orange}30`, borderRadius: 5, padding: "3px 8px", fontSize: 9, color: M.orange, fontFamily: "monospace" }}>{totalHigh} HIGH</div>
          <div style={{ background: M.teal + "15", border: `1px solid ${M.teal}30`, borderRadius: 5, padding: "3px 8px", fontSize: 9, color: M.teal, fontFamily: "monospace" }}>{TASKS.length} TOTAL TASKS</div>
        </div>
      </div>

      {/* SWARM CONVENING CONSOLE — visible across all tabs while open */}
      {consoleOpen && conveneLog.length > 0 && (
        <div className="no-print" style={{ maxWidth: 1060, margin: "10px auto 0", padding: "0 14px" }}>
          <div style={{ background: "#050a09", border: `1px solid ${convening ? M.teal + "50" : "#34d39940"}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 13px", borderBottom: `1px solid ${M.bdr}`, background: M.sur }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: M.teal, fontFamily: "monospace", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>⬡ Swarm Convening Console</span>
                <span style={{ fontSize: 9, color: M.dim, fontFamily: "monospace" }}>phoenix-command language v1.09-pre</span>
                {isDynamic && <span style={{ fontSize: 8, color: M.yellow, background: M.yellow+"20", borderRadius: 3, padding: "1px 6px" }}>dynamic</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: conveneComplete ? "#34d399" : M.teal, fontFamily: "monospace" }}>{conveneComplete ? "✓ complete" : `${convenePct}%`}</span>
                <button onClick={resetConvene} style={{ background: "transparent", border: `1px solid ${M.bdr}`, borderRadius: 4, color: M.muted, fontSize: 9, padding: "1px 7px", cursor: "pointer" }}>Clear</button>
              </div>
            </div>
            <div style={{ height: 2, background: M.bdr }}>
              <div style={{ height: "100%", width: `${convenePct}%`, background: conveneComplete ? "#34d399" : M.teal, transition: "width 0.3s" }} />
            </div>
            <div style={{ maxHeight: 220, overflowY: "auto", padding: "10px 13px", display: "flex", flexDirection: "column", gap: 5, fontFamily: "monospace" }}>
              {conveneLog.map((entry, i) => {
                const fromA = AGENTS[entry.from], toA = AGENTS[entry.to];
                return (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 11, alignItems: "baseline" }}>
                    <span style={{ color: M.muted, fontSize: 9, flexShrink: 0 }}>{new Date(entry.ts).toLocaleTimeString("en-ZA", { hour12: false })}</span>
                    <span style={{ color: M.teal, flexShrink: 0 }}>$</span>
                    <span style={{ color: "#8ee8d8" }}>{entry.pcl}</span>
                  </div>
                );
              })}
              {convening && <div style={{ fontSize: 11, color: M.teal, display: "flex", gap: 6, alignItems: "center" }}><span style={{ animation: "pulse 1s infinite" }}>▋</span> awaiting next command…</div>}
            </div>
          </div>
        </div>
      )}

      <div className="print-area" style={{ maxWidth: 1060, margin: "0 auto", padding: "14px 14px 0", display: "flex", flexDirection: "column", gap: 11 }}>

        {/* NAV */}
        <div className="no-print" style={{ display: "flex", gap: 3, background: M.sur, borderRadius: 10, padding: 4, border: `1px solid ${M.bdr}` }}>
          {VIEWS.map(v => (
            <button key={v.k} onClick={() => setView(v.k)} style={{ padding: "6px 16px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: view === v.k ? M.teal + "20" : "transparent", color: view === v.k ? M.teal : M.muted, transition: "all 0.15s" }}>{v.label}</button>
          ))}
        </div>

        {/* ══ OVERVIEW ══ */}
        {view === "overview" && (
          <div className="fu" style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Intro */}
            <div style={{ background: M.panel, borderRadius: 12, padding: 18, border: `1px solid ${M.teal}30` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: M.teal, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace" }}>⬡ Phoenix-Swarm-OS — MGSN Partnership Orchestration</div>
                <button className="no-print" onClick={() => exportPDF("Overview")} style={{ background: "transparent", border: `1px solid ${M.bdr}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 9, color: M.dim, fontFamily: "monospace", flexShrink: 0 }}>📄 Export PDF</button>
              </div>
              <p style={{ fontSize: 12, color: "#a0b8b5", lineHeight: 1.8, marginBottom: 12 }}>
                This is the operational translation of the MGSN · FEWL · BBNC Operations Manual into the Phoenix-Swarm-OS framework. Every task from the manual has been decomposed into a precise skillset requirement, mapped to the most capable available agent, and assigned a backup competitor skill stack. THUSO (01) orchestrates the full workflow across four sequential phases.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 8 }}>
                {[
                  ["23", "Tasks Extracted", M.teal],
                  ["6", "Operational Domains", M.yellow],
                  ["4", "Workflow Phases", M.orange],
                  ["8", "Active Agents", "#34d399"],
                  ["2", "Backup-only Agents", M.dim],
                  ["7", "Critical Priority", "#ef4444"],
                ].map(([val, label, color]) => (
                  <div key={label} style={{ background: M.card, borderRadius: 8, padding: "10px 12px", border: `1px solid ${M.bdr}` }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1, marginBottom: 3 }}>{val}</div>
                    <div style={{ fontSize: 10, color: M.dim }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8 }}>
              {PHASES.map(ph => {
                const pTasks = TASKS.filter(t => t.phase === ph.key);
                const agents = [...new Set(pTasks.map(t => t.primary))];
                return (
                  <div key={ph.key} style={{ background: M.panel, borderRadius: 10, padding: 14, border: `1px solid ${ph.color}30` }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: ph.color, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace", marginBottom: 6 }}>{ph.label}</div>
                    <div style={{ fontSize: 11, color: M.dim, marginBottom: 10, lineHeight: 1.5 }}>{ph.desc}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: ph.color, marginBottom: 4 }}>{pTasks.length} <span style={{ fontSize: 11, fontWeight: 400, color: M.dim }}>tasks</span></div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {agents.map(a => <AgBadge key={a} name={a} />)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Domain breakdown */}
            <div style={{ background: M.panel, borderRadius: 12, padding: 16, border: `1px solid ${M.bdr}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: M.teal, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace", marginBottom: 12 }}>Domain Distribution</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {allDomains.slice(1).map(d => {
                  const n = TASKS.filter(t => t.domain === d).length;
                  const c = DOMAIN_C[d];
                  const agents = [...new Set(TASKS.filter(t => t.domain === d).map(t => t.primary))];
                  return (
                    <div key={d}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, color: c, fontWeight: 600 }}>{d}</span>
                          <div style={{ display: "flex", gap: 3 }}>{agents.map(a => <AgBadge key={a} name={a} />)}</div>
                        </div>
                        <span style={{ fontSize: 10, color: M.dim, fontFamily: "monospace" }}>{n} tasks</span>
                      </div>
                      <div style={{ height: 4, background: M.bdr, borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${(n / 6) * 100}%`, background: c, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architectural note */}
            <div style={{ background: M.panel, borderRadius: 12, padding: 16, border: `1px solid ${M.bdr}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: M.yellow, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace", marginBottom: 10 }}>Orchestration Logic — How THUSO Coordinates</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8 }}>
                {[
                  { icon:"⬡", title:"Dependency Management", body:"No agent starts a task until upstream dependencies are confirmed complete. G6 (FEWL due diligence) must clear before any FEWL-involving task activates." },
                  { icon:"◈", title:"Backup Activation", body:"If a primary agent is unavailable, THUSO activates the backup. Backup agents share adjacent skill stacks — never a mismatched capability substitute." },
                  { icon:"◆", title:"Phase Gating", body:"THOMO enforces phase gates. Planning tasks must complete before Execution tasks launch. Reporting tasks aggregate Execution outputs. Governance runs concurrently but with ESC trigger authority." },
                  { icon:"⬡", title:"Load Balancing", body:"KATLEGO carries the heaviest primary load (5 tasks). LESEDI carries the heaviest backup load (5 tasks). LERATO and KEFILWE are reserved capacity — available for activation as scope grows." },
                ].map(item => (
                  <div key={item.title} style={{ background: M.card, borderRadius: 8, padding: 12, border: `1px solid ${M.bdr}` }}>
                    <div style={{ fontSize: 14, color: M.teal, marginBottom: 5 }}>{item.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: M.text, marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: M.dim, lineHeight: 1.65 }}>{item.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ SOLVER (NEW) ══ */}
        {view === "solver" && (
          <div className="fu" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: M.panel, borderRadius: 12, padding: 18, border: `1px solid ${M.teal}30` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: M.teal, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace" }}>🧠 Intelligent Swarm Convening</div>
                <button className="no-print" onClick={() => exportPDF("Solver")} style={{ background: "transparent", border: `1px solid ${M.bdr}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 9, color: M.dim, fontFamily: "monospace" }}>📄 Export PDF</button>
              </div>
              <p style={{ fontSize: 12, color: "#a0b8b5", lineHeight: 1.8, marginBottom: 14 }}>
                Describe your challenge or goal in plain language. The system will analyse key terms, suggest the most relevant agents, and propose a delegation sequence. You can confirm or edit before execution.
              </p>
              <textarea
                rows={4}
                value={problem}
                onChange={e => setProblem(e.target.value)}
                placeholder="e.g. We need to organise a community clean-up, create educational materials, and track our impact with surveys."
                style={{ width: "100%", background: M.card, border: `1px solid ${M.bdr}`, borderRadius: 8, color: M.text, fontSize: 13, padding: 12, fontFamily: "inherit", resize: "vertical" }}
              />
              <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                <button onClick={handleAnalyse} style={{ background: M.teal + "20", border: `1px solid ${M.teal}40`, borderRadius: 6, padding: "8px 18px", cursor: "pointer", fontSize: 11, color: M.teal, fontWeight: 700, fontFamily: "monospace" }}>
                  🔍 Analyse Problem
                </button>
                {proposedAgents.length > 0 && (
                  <button onClick={() => setShowConfirmModal(true)} style={{ background: "#34d39920", border: "1px solid #34d39940", borderRadius: 6, padding: "8px 18px", cursor: "pointer", fontSize: 11, color: "#34d399", fontWeight: 700, fontFamily: "monospace" }}>
                    ▶ Confirm & Convene
                  </button>
                )}
                <button onClick={() => { setProblem(""); setProposedAgents([]); setDynamicSeq([]); }} style={{ background: "transparent", border: `1px solid ${M.bdr}`, borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 11, color: M.muted, fontFamily: "monospace" }}>
                  Clear
                </button>
              </div>
              {proposedAgents.length > 0 && (
                <div style={{ marginTop: 16, background: M.card, borderRadius: 8, padding: 14, border: `1px solid ${M.teal}20` }}>
                  <div style={{ fontSize: 11, color: M.teal, marginBottom: 8, fontFamily: "monospace", fontWeight: 700 }}>Proposed Agents:</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {proposedAgents.map(a => <AgBadge key={a} name={a} size="lg" />)}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 10, color: M.dim, fontFamily: "monospace" }}>
                    {dynamicSeq.length} tasks identified in sequence. Click "Confirm & Convene" to start.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ WORKFLOW ══ */}
        {view === "workflow" && (
          <div className="fu" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: M.panel, borderRadius: 12, padding: 14, border: `1px solid ${M.bdr}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: M.teal, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace" }}>⬡ Swarm Workflow — Sequential Orchestration by Phase</div>
                <button className="no-print" onClick={() => exportPDF("Workflow")} style={{ background: "transparent", border: `1px solid ${M.bdr}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 9, color: M.dim, fontFamily: "monospace", flexShrink: 0 }}>📄 Export PDF</button>
              </div>
              <p style={{ fontSize: 11, color: M.dim, lineHeight: 1.65 }}>THUSO (01) coordinates all inter-agent handoffs. Each arrow represents a deliberate delegation or data transfer. Tasks within a phase can run in parallel unless a dependency is indicated.</p>
            </div>

            {WORKFLOW.map(wf => {
              const ph = PHASES.find(p => p.key === wf.phase);
              const pTasks = TASKS.filter(t => t.phase === wf.phase);
              return (
                <div key={wf.phase} style={{ background: M.panel, borderRadius: 12, border: `1px solid ${ph?.color + "30" || M.bdr}`, overflow: "hidden" }}>
                  <div style={{ background: ph?.color + "12", borderBottom: `1px solid ${ph?.color + "25"}`, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: ph?.color, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace" }}>{ph?.label}</div>
                      <div style={{ fontSize: 11, color: M.dim, marginTop: 2 }}>{ph?.desc}</div>
                    </div>
                    <div style={{ fontSize: 9, color: ph?.color, fontFamily: "monospace", background: ph?.color + "18", borderRadius: 5, padding: "3px 8px" }}>{pTasks.length} tasks · {wf.steps.length} handoffs</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                    {/* Handoffs */}
                    <div style={{ padding: "12px 14px", borderRight: `1px solid ${M.bdr}` }}>
                      <div style={{ fontSize: 9, color: M.teal, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "monospace", fontWeight: 700 }}>Agent Handoff Sequence</div>
                      {wf.steps.map((step, i) => <WorkflowStep key={i} step={step} idx={i} />)}
                    </div>

                    {/* Tasks */}
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: 9, color: M.teal, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "monospace", fontWeight: 700 }}>Tasks in Phase (click to expand)</div>
                      {pTasks.map(t => <TaskCard key={t.id} task={t} compact />)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ TASK REGISTRY ══ */}
        {view === "tasks" && (
          <div className="fu" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: M.panel, borderRadius: 12, padding: 14, border: `1px solid ${M.bdr}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: M.teal, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace" }}>◈ Task Registry — {filtered.length} of {TASKS.length} tasks</div>
                <button className="no-print" onClick={() => exportPDF("Task Registry")} style={{ background: "transparent", border: `1px solid ${M.bdr}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 9, color: M.dim, fontFamily: "monospace", flexShrink: 0 }}>📄 Export PDF</button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input style={{ flex: "1 1 200px", padding: "7px 11px", background: M.card, border: `1px solid ${M.bdr}`, borderRadius: 7, color: M.text, fontSize: 12, fontFamily: "inherit" }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks or skillsets…" />
                <select style={{ background: M.card, border: `1px solid ${M.bdr}`, color: M.teal, borderRadius: 7, fontSize: 11, padding: "7px 10px", cursor: "pointer" }} value={domainF} onChange={e => setDomainF(e.target.value)}>
                  {allDomains.map(d => <option key={d}>{d}</option>)}
                </select>
                <select style={{ background: M.card, border: `1px solid ${M.bdr}`, color: M.orange, borderRadius: 7, fontSize: 11, padding: "7px 10px", cursor: "pointer" }} value={phaseF} onChange={e => setPhaseF(e.target.value)}>
                  {allPhases.map(p => <option key={p}>{p}</option>)}
                </select>
                <select style={{ background: M.card, border: `1px solid ${M.bdr}`, color: M.yellow, borderRadius: 7, fontSize: 11, padding: "7px 10px", cursor: "pointer" }} value={agentF} onChange={e => setAgentF(e.target.value)}>
                  {allAgents.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div style={{ background: M.panel, borderRadius: 12, padding: 14, border: `1px solid ${M.bdr}` }}>
              {filtered.length === 0 && <div style={{ fontSize: 12, color: M.muted, fontStyle: "italic", textAlign: "center", padding: "24px 0" }}>No tasks match current filters.</div>}
              {filtered.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          </div>
        )}

        {/* ══ AGENT HUB ══ */}
        {view === "agents" && (
          <div className="fu" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: M.panel, borderRadius: 12, padding: 14, border: `1px solid ${M.bdr}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: M.teal, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "monospace" }}>◆ Agent Hub — Task Delegation Map</div>
                <button className="no-print" onClick={() => exportPDF("Agent Hub")} style={{ background: "transparent", border: `1px solid ${M.bdr}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 9, color: M.dim, fontFamily: "monospace", flexShrink: 0 }}>📄 Export PDF</button>
              </div>
              <p style={{ fontSize: 11, color: M.dim, lineHeight: 1.65 }}>Each agent card shows primary tasks owned and backup tasks where they serve as the closest competitor skill stack. LERATO and KEFILWE have no primary tasks in the current scope — they are available for activation as scope expands.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 8 }}>
              {Object.keys(AGENTS).map(name => <AgentHubCard key={name} name={name} />)}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ textAlign: "center", fontSize: 9, color: M.muted, paddingTop: 8, fontFamily: "monospace", lineHeight: 1.8 }}>
          MGSN · FefeDesigns/FEWL · BBNC Productions — Phoenix-Swarm-OS Operational Workflow<br />
          Derived from Operations Manual · Orchestrated by THOMO · Mabopane, Tshwane · © 2026 Phoenix Digital Services
        </div>
      </div>

      {/* ── CONFIRMATION MODAL (NEW) ── */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancelDynamic}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 14, fontWeight: 700, color: M.teal, marginBottom: 6, fontFamily: "monospace" }}>Confirm Swarm Convening</div>
            <div style={{ fontSize: 11, color: M.dim, marginBottom: 16 }}>Based on your problem, the following agents and tasks will be activated.</div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: M.teal, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "monospace" }}>Agents</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {proposedAgents.map(a => <AgBadge key={a} name={a} size="lg" />)}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: M.teal, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "monospace" }}>Tasks (in order)</div>
              {dynamicSeq.length > 0 ? (
                <div style={{ background: M.card, borderRadius: 6, padding: "8px 10px", maxHeight: 160, overflowY: "auto" }}>
                  {dynamicSeq.map((step, idx) => (
                    <div key={idx} style={{ fontSize: 11, color: M.text, padding: "3px 0", borderBottom: idx < dynamicSeq.length-1 ? `1px solid ${M.bdr}` : "none" }}>
                      <span style={{ color: M.muted, fontSize: 9, fontFamily: "monospace" }}>{idx+1}.</span> {step.action}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 11, color: M.muted }}>No tasks generated. Please re‑analyse.</div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={handleCancelDynamic} style={{ background: "transparent", border: `1px solid ${M.bdr}`, borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontSize: 11, color: M.muted, fontFamily: "monospace" }}>Cancel</button>
              <button onClick={handleConfirmDynamic} style={{ background: "#34d39920", border: "1px solid #34d39940", borderRadius: 6, padding: "6px 18px", cursor: "pointer", fontSize: 11, color: "#34d399", fontWeight: 700, fontFamily: "monospace" }}>✓ Confirm & Start</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}