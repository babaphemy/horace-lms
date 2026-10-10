import { lab } from "./factory"
export const m1 = [
  lab(
    "Build a safe cybersecurity lab",
    1,
    "local-vm",
    [],
    "Create an isolated, repeatable environment for safe security practice.",
    [
      "Plan the isolated topology",
      "Configure snapshots and networking",
      "Prove isolation",
      "Document recovery steps",
    ],
    ["Lab diagram link", "Isolation proof"],
    ["Lab safety", "Virtualization", "Documentation"]
  ),
  lab(
    "PBQ: select and layer security controls",
    1,
    "browser",
    ["controls"],
    "Choose complementary controls for a clinic scenario.",
    [
      "Review the scenario",
      "Classify each control",
      "Layer the controls",
      "Explain residual risk",
    ],
    ["Completed control matrix", "Residual-risk note"],
    ["Security controls", "Defense in depth"]
  ),
]
