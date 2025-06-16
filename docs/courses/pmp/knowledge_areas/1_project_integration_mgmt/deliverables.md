# Deliverables

In any project, you will be creating deliverables.

In **Project Management Professional (PMP)** terminology, **deliverables** refer to tangible or intangible outcomes, products, results, or capabilities that are produced during a project. They serve as milestones that indicate progress and completion of project objectives.

### **Types of Deliverables**

Deliverables can be classified into:

1. **Project Deliverables:** The final outcome that fulfills the project objective (e.g., a software product, a completed building, a marketing campaign).
2. **Process Deliverables:** Intermediate outputs necessary for managing the project effectively (e.g., project management plan, risk assessment reports, stakeholder engagement strategy).
3. **External Deliverables:** Items provided to customers or end-users outside the project team (e.g., a product prototype or a client report).
4. **Internal Deliverables:** Used within the organization for project management (e.g., training materials, documentation, test results).

### **Knowledge Area in PMBOK Guide**

Deliverables are primarily part of the **Project Scope Management** knowledge area in the **PMBOK Guide**, as they define what will be produced in the project. However, they also intersect with:

- **Project Integration Management** (ensuring deliverables align with project objectives)
- **Quality Management** (ensuring deliverables meet expected standards)
- **Risk Management** (analyzing risks related to deliverables)

Here’s an example of **project deliverables** for a **web application development project**:

### **Example: Web Application Development Deliverables**

#### **1. Project Deliverables (Final Output)**

- **Deployed Web Application** – A fully functional application available for users.
- **User Documentation** – A guide explaining features and usage.
- **Source Code Repository** – A well-structured GitHub repository with version control.

#### **2. Process Deliverables (Intermediate Steps)**

- **Project Charter** – Initial document defining goals and scope.
- **Project Management Plan** – Comprehensive document outlining execution strategies.
- **Design Wireframes & Mockups** – UI/UX layouts before development begins.
- **Testing Reports** – QA results documenting issues and fixes.
- **Sprint Reports** – Documentation of progress in Agile iterations.

#### **3. External Deliverables (For Clients/Users)**

- **Client Review Reports** – Status updates on development milestones.
- **Prototype Demonstration** – An early version for feedback.

#### **4. Internal Deliverables (Team Use)**

- **Development Guidelines** – Coding standards and best practices.
- **Deployment Scripts** – Automated tools for CI/CD pipelines.
- **Risk Assessment Reports** – Identified risks and mitigation plans.

Since you have experience with **Next.js and NGINX**, a similar approach could apply when managing a deployment pipeline for a web project. Would you like more details on how these deliverables integrate into a CI/CD workflow?
The relationship between **deliverables** and **change control** in project management is crucial because deliverables often evolve due to project changes. Here's how they connect:

### **1. Change Control Ensures Deliverable Integrity**

Change control is a formal process used to assess, approve, and manage modifications to project components, including deliverables. Without proper change control, uncontrolled scope changes (scope creep) can negatively impact project objectives.

### **2. Change Requests Often Affect Deliverables**

Whenever a stakeholder requests changes—such as adding features, adjusting specifications, or modifying deadlines—the change control process evaluates its impact on deliverables before approval.

### **3. Change Control Protects Against Unplanned Variations**

By using change control, the project team ensures that modifications are systematically reviewed. This prevents disruptions to the original project scope, timeline, and budget.

### **4. Tracking Changes to Deliverables**

The change control process includes:

- **Change Request Submission:** A formal request for modifications.
- **Impact Analysis:** Assessing effects on cost, time, quality, and risk.
- **Approval or Rejection:** Decision-making by project stakeholders or a change control board.
- **Implementation & Documentation:** Updating the project plan and relevant deliverables.

### **Example: Web Application Project**

Imagine you’re managing the deployment of a **Next.js** application with **NGINX**. If a stakeholder requests a security enhancement (e.g., integrating OAuth authentication), this would affect several deliverables, such as:

- Updated **source code repository** with authentication logic.
- Revised **user documentation** explaining authentication setup.
- Modified **deployment scripts** for OAuth integration.

A structured change control process ensures these deliverables are updated in a controlled manner without causing unexpected issues.
Alright! Here’s an example of a **Change Control Workflow** for a **web application project**, incorporating CI/CD best practices.

### **Scenario: OAuth Authentication Update in a Next.js App**

Your team is deploying a Next.js web application with NGINX as a reverse proxy. A stakeholder requests integrating **OAuth authentication**, requiring changes to multiple deliverables.

---

### **Step-by-Step Change Control Workflow (Example)**

#### **1. Change Request Submission**

- A stakeholder submits a formal request to implement OAuth authentication.
- The request is documented in the project’s change log.

#### **2. Impact Analysis**

- The technical team evaluates the impact on:

  - **Source Code Repository:** Adding authentication logic.
  - **Deployment Pipeline:** Updating CI/CD scripts to include OAuth keys.
  - **Security Configuration:** Ensuring NGINX reverse proxy settings align with OAuth.
  - **User Documentation:** Updating authentication instructions.

- The team estimates additional development time, potential risks, and cost implications.

#### **3. Change Control Board (CCB) Decision**

- The project manager and key stakeholders review the impact analysis.
- They either **approve** the change or **reject** it based on feasibility, budget, and timeline.

#### **4. Implementation Planning**

- If approved, tasks are assigned to developers for coding the OAuth feature.
- CI/CD pipeline adjustments are scheduled to deploy updated authentication settings.

#### **5. Change Execution**

- Developers integrate OAuth authentication into the Next.js app.
- Updates are pushed to the **Git repository** with clear commit messages.
- CI/CD pipeline automates deployment and testing.

#### **6. Testing & Validation**

- QA team ensures authentication works properly, with test cases including:
  - OAuth provider response validation.
  - Token expiration handling.
  - Role-based access control.

#### **7. Documentation & Deployment**

- **Deployment Scripts** are updated with OAuth configuration.
- **User Documentation** is revised with authentication setup details.
- The new feature is deployed via the CI/CD pipeline.

#### **8. Post-Implementation Review**

- A final review ensures the change didn’t introduce unforeseen issues.
- Stakeholders confirm successful integration.
- The project change log is updated to reflect the approved modification.

---

### **Why This Matters in CI/CD**

This structured process ensures changes don’t disrupt the stability of the deployment pipeline. By automating testing and deployment, CI/CD minimizes risks and ensures every update is properly validated.

Would you like a more detailed breakdown of how the CI/CD pipeline can handle authentication changes seamlessly?
