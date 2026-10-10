import { lab } from "./factory"
export const m4 = [
  lab(
    "Lab: design a segmented small-enterprise network",
    3,
    "browser",
    ["network"],
    "Segment business assets and enforce least-privilege traffic flows.",
    [
      "Place assets into zones",
      "Define allowed flows",
      "Write ordered firewall rules",
      "Run reachability tests",
    ],
    ["Zone map", "Firewall rule table"],
    ["Network segmentation", "Firewall policy"]
  ),
  lab(
    "Lab: backup and restore validation",
    3,
    "hybrid",
    ["hash", "forms"],
    "Prove that a restored backup is usable and unchanged.",
    [
      "Hash the source",
      "Record the backup job",
      "Restore to an isolated location",
      "Compare hashes and document the test",
    ],
    ["Hash comparison", "Restore validation report"],
    ["Resilience", "Integrity validation"]
  ),
]
