import { lab } from "./factory"
export const m5 = [
  lab(
    "Lab: Linux log triage",
    4,
    "browser",
    ["logs", "forms"],
    "Identify a brute-force source and the account it compromised.",
    [
      "Load the auth log and scope time",
      "Find the failed-login spike",
      "Identify the successful compromised login",
      "Recommend containment",
      "Export the incident summary",
    ],
    ["Evidence timeline", "Incident summary"],
    ["Log analysis", "Linux security", "Incident response"]
  ),
  lab(
    "Lab: create SIEM detections",
    4,
    "browser",
    ["detection"],
    "Create high-signal rules against labelled security events.",
    [
      "Explore the event set",
      "Write three detection rules",
      "Tune false positives",
      "Explain coverage gaps",
    ],
    ["Three tuned rules", "Coverage note"],
    ["Detection engineering", "SIEM"]
  ),
  lab(
    "Lab: IAM access review",
    4,
    "browser",
    ["iam"],
    "Find and remediate risky identities and access grants.",
    [
      "Review the export",
      "Find stale and orphaned accounts",
      "Find privilege conflicts",
      "Record each access decision",
    ],
    ["Access review decisions"],
    ["IAM", "Least privilege"]
  ),
  lab(
    "Automation and secure scripting",
    4,
    "local-vm",
    [],
    "Build a small defensive automation with secure coding safeguards.",
    [
      "Define the automation",
      "Implement input handling",
      "Test failure cases",
      "Review against the checklist",
    ],
    ["Repository link", "Secure-coding checklist"],
    ["Security automation", "Secure coding"]
  ),
  lab(
    "Lab: phishing investigation",
    4,
    "browser",
    ["phishing", "forms"],
    "Analyze headers and content to reach an evidence-based phishing verdict.",
    [
      "Trace the Received chain",
      "Review SPF DKIM and DMARC",
      "Extract and defang URLs",
      "Identify the spoofed sender",
      "Export the report",
    ],
    ["Verdict and evidence", "Incident report"],
    ["Email security", "Phishing analysis"]
  ),
  lab(
    "Lab: ransomware tabletop",
    4,
    "browser",
    ["tabletop", "forms"],
    "Make and document defensible decisions during a ransomware incident.",
    [
      "Start the exercise",
      "Respond to each inject",
      "Set containment priorities",
      "Complete the incident report",
    ],
    ["Inject responses", "Incident report"],
    ["Incident response", "Crisis decision-making"]
  ),
]
