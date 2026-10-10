import { lab } from "./factory"
export const m2 = [
  lab(
    "Lab: hash, encrypt, sign, and verify",
    2,
    "hybrid",
    ["hash", "crypto"],
    "Apply integrity, confidentiality, and authenticity controls to sample data.",
    [
      "Hash the evidence",
      "Encrypt and decrypt it",
      "Sign and verify it",
      "Tamper with a copy and retest",
    ],
    ["Digest values", "Verification results"],
    ["Cryptography", "Integrity validation"]
  ),
  lab(
    "Lab: certificate troubleshooting",
    2,
    "browser",
    ["cert", "forms"],
    "Diagnose common trust and identity failures in certificate chains.",
    [
      "Inspect the valid chain",
      "Diagnose the expired leaf",
      "Find the hostname mismatch",
      "Write a remediation ticket",
    ],
    ["Certificate diagnoses", "Remediation ticket"],
    ["PKI", "Certificate analysis"]
  ),
]
