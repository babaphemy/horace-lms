# Q

How have you generated new alert types, drill down queries and workflows using RCM?

Certainly! Here's a strong, professional-level response to the interview question on how you’ve generated **new alert types, drill-down queries, and workflows** using **RCM (Risk Case Manager)** in NICE Actimize:

---

**"Throughout my work as a senior Actimize developer, I’ve regularly created and customized new alert types, drill-down queries, and workflows in RCM to support fraud detection, AML investigations, and regulatory compliance use cases. These efforts ensured that alerts were more actionable, investigations more efficient, and workflows aligned tightly with client processes."**

---

### 🚨 **Creating New Alert Types:**

- I’ve configured **custom alert types** by modifying the **AlertType.xml** configuration, often tailored to:

  - New detection logic in AIS or Modeler,
  - Specific transaction channels (e.g., mobile, wire, or crypto),
  - Risk scoring bands, or
  - Jurisdictional compliance (e.g., FATF-region alerts).

- For each new alert type:

  - Defined **custom alert fields** and **data mappings**,
  - Registered them in the RCM metadata,
  - Linked them with **user profiles and workflows** to ensure correct routing.

---

### 🔍 **Building Drill-Down Queries:**

- Created **custom drill-downs** to allow investigators to explore:

  - Transaction histories,
  - Related accounts/entities,
  - Cross-channel behavior (e.g., ATM + online fraud signals).

- Implemented these via:

  - SQL-based drill-down query templates,
  - Integration with external data sources (like KYC/CDD systems),
  - JSON or XML payload rendering for external viewers.

- Ensured performance by indexing relevant DB columns and applying filters like time windows or segmentation to avoid data overload.

---

### 🔄 **Designing & Customizing Workflows:**

- Designed **custom investigation workflows** in the **RCM Workflow Editor**, matching real-world case handling processes.

- Added stages like **Initial Review**, **Escalation**, **SAR Recommendation**, **Quality Check**, and **Closure**.

- Configured workflow rules for:

  - Auto-assignment by team, region, or workload,
  - Conditional branching (e.g., escalate if risk_score > threshold),
  - SLA tracking and audit trail logging.

- Developed and deployed **custom Java plugins** to enrich alert data or automate rule-based transitions (e.g., auto-close alerts based on known false-positive patterns).

---

### ✅ **Impact:**

- Reduced average case handling time by enabling smarter drill-downs and pre-enrichment.
- Increased investigator productivity and reduced alert fatigue by delivering context-rich, well-routed alerts.
- Helped compliance teams meet SLA and audit requirements with robust workflow design and tracking.

---
