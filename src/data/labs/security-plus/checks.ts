import { PlaygroundToolId } from "../types"

interface LabCheck {
  tool: PlaygroundToolId
  rule: string
  requirements: RegExp[]
  message: string
}

// These checks validate submitted checkpoint evidence, not external VM execution.
export const labChecks: Record<string, LabCheck> = {
  "pbq-select-and-layer-security-controls": {
    tool: "controls",
    rule: "classify-controls",
    requirements: [
      /policy.*administrative/i,
      /badge.*physical/i,
      /edr.*technical/i,
      /guard.*physical/i,
    ],
    message:
      "Classify the policy as administrative, badge reader and guard as physical, and EDR as technical.",
  },
  "lab-hash-encrypt-sign-and-verify": {
    tool: "crypto",
    rule: "encryption-round-trip",
    requirements: [
      /plaintext\s*:\s*\S+/i,
      /ciphertext\s*:\s*\S+/i,
      /decrypted\s*:\s*\S+/i,
    ],
    message:
      "Provide plaintext:, ciphertext:, and decrypted: values; decrypted text must match plaintext.",
  },
  "lab-certificate-troubleshooting": {
    tool: "cert",
    rule: "expired-leaf",
    requirements: [/expir/i, /notafter|validity/i, /renew|reissue|replace/i],
    message:
      "Identify expiry, cite NotAfter or validity evidence, and describe renewal or replacement.",
  },
  "lab-packet-analysis-with-wireshark": {
    tool: "packets",
    rule: "suspicious-traffic",
    requirements: [/192\.0\.2\.44/, /beacon|uncommon port/i],
    message: "Identify 192.0.2.44 and its beacon or uncommon-port traffic.",
  },
  "lab-vulnerability-scan-and-remediation": {
    tool: "forms",
    rule: "prioritize-vulnerabilities",
    requirements: [
      /finding\s*:\s*\S+/i,
      /impact\s*:\s*\S+/i,
      /priority\s*:\s*\S+/i,
    ],
    message: "Provide finding:, impact:, and priority: evidence.",
  },
  "job-practical-write-a-vulnerability-ticket": {
    tool: "forms",
    rule: "business-impact",
    requirements: [
      /asset\s*:\s*\S+/i,
      /impact\s*:\s*\S+/i,
      /severity\s*:\s*\S+/i,
    ],
    message: "Provide affected asset:, business impact:, and severity:.",
  },
  "lab-design-a-segmented-small-enterprise-network": {
    tool: "network",
    rule: "allowed-flows",
    requirements: [
      /source\s*:\s*\S+/i,
      /destination\s*:\s*\S+/i,
      /port\s*:\s*\d+/i,
      /allow/i,
    ],
    message: "Document an allowed flow with source:, destination:, and port:.",
  },
  "lab-backup-and-restore-validation": {
    tool: "forms",
    rule: "backup-job-record",
    requirements: [
      /source\s*:\s*\S+/i,
      /backup\s*:\s*\S+/i,
      /status\s*:\s*(success|completed)/i,
    ],
    message:
      "Record source:, backup: location, and status: success or completed.",
  },
  "lab-linux-log-triage": {
    tool: "logs",
    rule: "failed-login-spike",
    requirements: [/192\.0\.2\.44/, /alex/i, /failed/i, /09:12/],
    message: "Identify failed logins for alex from 192.0.2.44 at 09:12.",
  },
  "lab-create-siem-detections": {
    tool: "detection",
    rule: "three-detection-rules",
    requirements: [
      /rule\s*1\s*:\s*\S+/i,
      /rule\s*2\s*:\s*\S+/i,
      /rule\s*3\s*:\s*\S+/i,
    ],
    message:
      "Submit three nonempty detection rules labelled Rule 1:, Rule 2:, and Rule 3:.",
  },
  "lab-iam-access-review": {
    tool: "iam",
    rule: "risky-identities",
    requirements: [/alex.*stale/i, /former\.contractor.*orphan/i],
    message: "Identify alex as stale and former.contractor as orphaned.",
  },
  "lab-phishing-investigation": {
    tool: "phishing",
    rule: "authentication-failures",
    requirements: [
      /spf\s*[=:]\s*fail/i,
      /dkim\s*[=:]\s*fail/i,
      /dmarc\s*[=:]\s*fail/i,
    ],
    message: "Record the fixture's SPF, DKIM, and DMARC failures.",
  },
  "lab-ransomware-tabletop": {
    tool: "tabletop",
    rule: "inject-response",
    requirements: [
      /inject\s*:\s*\S+/i,
      /action\s*:\s*\S+/i,
      /reason\s*:\s*\S+/i,
    ],
    message: "Document the inject:, response action:, and reason:.",
  },
  "lab-risk-register-and-treatment-plan": {
    tool: "forms",
    rule: "risk-scoring",
    requirements: [
      /risk\s*:\s*\S+/i,
      /likelihood\s*:\s*[1-5]\b/i,
      /impact\s*:\s*[1-5]\b/i,
    ],
    message: "Provide risk:, likelihood: (1–5), and impact: (1–5).",
  },
  "job-practical-vendor-security-review": {
    tool: "forms",
    rule: "vendor-questionnaire",
    requirements: [
      /question\s*:\s*\S+/i,
      /answer\s*:\s*\S+/i,
      /evidence\s*:\s*\S+/i,
    ],
    message:
      "Provide a questionnaire question:, answer:, and supporting evidence:.",
  },
  "security-awareness-campaign": {
    tool: "forms",
    rule: "campaign-audience",
    requirements: [/audience\s*:\s*\S+/i, /behavior\s*:\s*\S+/i],
    message: "Define the audience: and target behavior:.",
  },
  "capstone-investigate-a-compromised-company": {
    tool: "logs",
    rule: "correlate-evidence",
    requirements: [/alex/i, /192\.0\.2\.44/, /beacon/i, /spf\s*[=:]\s*fail/i],
    message:
      "Correlate alex and 192.0.2.44 with the packet beacon and email SPF failure.",
  },
  "capstone-hardening-and-30-day-improvement-plan": {
    tool: "forms",
    rule: "define-improvements",
    requirements: [
      /weakness\s*:\s*\S+/i,
      /improvement\s*:\s*\S+/i,
      /priority\s*:\s*\S+/i,
    ],
    message: "Document weakness:, improvement:, and priority:.",
  },
}

export function validateLabCheck(
  tool: PlaygroundToolId,
  rule: string,
  value: string
) {
  const check = Object.values(labChecks).find(
    (item) => item.tool === tool && item.rule === rule
  )
  if (!check)
    return {
      passed: false,
      message: "No automatic check is available for this tool.",
    }
  let passed = check.requirements.every((requirement) =>
    requirement.test(value)
  )
  if (rule === "encryption-round-trip") {
    const field = (name: string) =>
      value.match(new RegExp(`^${name}:\\s*(.+)$`, "im"))?.[1].trim()
    passed =
      passed &&
      field("plaintext") === field("decrypted") &&
      field("ciphertext") !== field("plaintext")
  }
  return {
    passed,
    message: passed ? "Checkpoint evidence check passed." : check.message,
  }
}
