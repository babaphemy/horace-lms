import { lab } from "./factory"
export const m3 = [
  lab(
    "Lab: packet analysis with Wireshark",
    3,
    "hybrid",
    ["packets", "forms"],
    "Turn network evidence into a defensible incident timeline.",
    [
      "Scope the capture",
      "Filter suspicious traffic",
      "Tag at least five IOCs",
      "Order the timeline",
      "Export the summary",
    ],
    ["IOC list", "Ordered timeline"],
    ["Packet analysis", "Incident triage"]
  ),
  lab(
    "Lab: vulnerability scan and remediation",
    3,
    "local-vm",
    ["forms"],
    "Validate that remediation measurably reduces exposure.",
    [
      "Run the baseline scan",
      "Prioritize findings",
      "Apply remediation",
      "Run the validation scan",
    ],
    ["Before and after scans", "Remediation record"],
    ["Vulnerability management", "Remediation"]
  ),
  lab(
    "Job practical: write a vulnerability ticket",
    3,
    "browser",
    ["forms"],
    "Produce an actionable, risk-based vulnerability ticket.",
    [
      "Review the finding",
      "Score business impact",
      "Write reproduction steps",
      "Set owner and acceptance criteria",
    ],
    ["Completed vulnerability ticket"],
    ["Risk communication", "Ticket writing"]
  ),
]
