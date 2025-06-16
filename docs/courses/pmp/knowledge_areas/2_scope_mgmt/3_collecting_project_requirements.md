### **Collecting Project Requirements in PMP**

**Collecting Project Requirements** is the process of identifying and documenting stakeholder needs, objectives, and expectations to define the project's scope. This step ensures that the project delivers exactly what is required while avoiding misalignment between stakeholders and project teams.

---

### **Knowledge Area in PMBOK Guide**

Collecting requirements belongs to the **Project Scope Management** knowledge area. It plays a critical role in defining the scope and ensuring that the final deliverables align with business needs.

Additionally, it interacts with:
✅ **Stakeholder Management** – Understanding stakeholder expectations.  
✅ **Integration Management** – Aligning requirements with project goals.  
✅ **Quality Management** – Ensuring deliverables meet predefined acceptance criteria.

---

### **How to Achieve Effective Requirement Collection**

To ensure **accurate and comprehensive** requirement gathering, follow these best practices:

1️⃣ **Stakeholder Identification & Engagement**

- Determine key stakeholders early in the project.
- Conduct interviews or surveys to understand their expectations.

2️⃣ **Requirement Elicitation Techniques**

- **Interviews:** One-on-one discussions to gather insights.
- **Focus Groups:** Bringing together experts for collaborative input.
- **Surveys & Questionnaires:** Structured data collection from a broad audience.
- **Workshops:** Engaging teams to refine and document requirements.

3️⃣ **Creating a Requirements Traceability Matrix (RTM)**

- Link each requirement to project objectives to prevent unnecessary changes.
- Ensure traceability from conception to implementation.

4️⃣ **Prioritization & Validation**

- Categorize requirements based on urgency and business impact.
- Validate with stakeholders to confirm completeness and clarity.

5️⃣ **Managing Changes Through Change Control**

- Establish an **Integrated Change Control (ICC)** process to evaluate and approve modifications to requirements.

---

### **Skills & Techniques Needed for Effective Requirement Collection**

✅ **Active Listening & Communication** – Understanding stakeholder needs accurately.  
✅ **Critical Thinking & Analytical Skills** – Evaluating feasibility and constraints.  
✅ **Negotiation & Conflict Resolution** – Aligning conflicting requirements.  
✅ **Facilitation & Documentation** – Conducting requirement workshops and maintaining clear records.  
✅ **Process Mapping & Visualization** – Using **Mermaid diagrams** or flowcharts to illustrate requirements.

---

### **Example: Requirement Collection for a Web Application Deployment**

Imagine you’re deploying a **Next.js application** with **NGINX**. Requirement gathering might involve:  
🔹 **Stakeholder Interviews** – Collecting client expectations for security and authentication features.  
🔹 **Workshops** – Defining backend API requirements with developers.  
🔹 **Requirements Traceability Matrix** – Mapping OAuth authentication requests to security goals.  
🔹 **Validation Sessions** – Ensuring that deployment pipelines align with DevOps best practices.
=====

Here’s a structured **Requirements Document Template** to help you collect and manage project requirements effectively. You can tailor it based on your project needs.

---

### **Project Requirements Document Template**

#### **1. Project Overview**

**Project Name:** [Enter project name]  
**Project Manager:** [Your name]  
**Project Sponsor:** [Sponsor name or organization]  
**Project Objectives:** [Brief summary of project goals]  
**Stakeholders:** [List key individuals or teams]

---

#### **2. Requirement Collection Approach**

**Methodologies Used:**

- [Interviews, Surveys, Workshops, Focus Groups, Observations]  
  **Tools & Documentation:**
- [Jira, Confluence, GitHub Issues, Requirements Traceability Matrix (RTM)]

---

#### **3. Business Requirements**

| **Requirement ID** | **Requirement Description**                           | **Priority** | **Stakeholder** | **Status** |
| ------------------ | ----------------------------------------------------- | ------------ | --------------- | ---------- |
| BR001              | The system must support OAuth authentication          | High         | Security Team   | Pending    |
| BR002              | Users should be able to upload profile pictures       | Medium       | Product Owner   | Approved   |
| BR003              | Payment processing should support multiple currencies | High         | Finance Team    | In Review  |

---

#### **4. Functional Requirements**

| **Requirement ID** | **Functionality** | **Acceptance Criteria**               | **Priority** |
| ------------------ | ----------------- | ------------------------------------- | ------------ |
| FR001              | Login System      | User must log in using OAuth tokens   | High         |
| FR002              | File Upload       | System allows JPEG and PNG formats    | Medium       |
| FR003              | Search Feature    | Users can search via keyword matching | High         |

---

#### **5. Non-Functional Requirements**

| **Requirement ID** | **Constraint/Standard** | **Description**                   | **Priority** |
| ------------------ | ----------------------- | --------------------------------- | ------------ |
| NFR001             | Security Compliance     | Must comply with GDPR & ISO 27001 | High         |
| NFR002             | Performance             | Page load time must be <3 seconds | Medium       |
| NFR003             | Availability            | System must have 99.9% uptime     | High         |

---

#### **6. Requirements Traceability Matrix (RTM)**

| **Requirement ID** | **Source**    | **Linked Deliverable**      | **Test Case ID** |
| ------------------ | ------------- | --------------------------- | ---------------- |
| BR001              | Security Team | OAuth authentication module | TC101            |
| FR002              | UX Team       | File upload interface       | TC202            |
| NFR003             | DevOps        | Server monitoring setup     | TC303            |

---

#### **7. Change Control Process for Requirements**

- **Change Request Submission:** [Define process for stakeholders to request changes]
- **Impact Assessment:** [How will changes affect project scope, cost, and timeline?]
- **Approval Mechanism:** [Specify who reviews and approves changes]
- **Implementation & Documentation:** [Outline how changes are integrated into project workflow]

---

#### **8. Approval & Sign-Offs**

| **Stakeholder**    | **Role** | **Approval Status** |
| ------------------ | -------- | ------------------- |
| [Stakeholder Name] | [Role]   | Approved/Pending    |
| [Stakeholder Name] | [Role]   | Approved/Pending    |

---

This template ensures **clarity, traceability, and stakeholder alignment** in requirement collection.

### **Nominal Group Technique (NGT) for Requirements Gathering**

The **Nominal Group Technique (NGT)** is a structured method used in requirements gathering to **prioritize stakeholder input**, generate ideas, and reach consensus efficiently. It is particularly useful for **facilitating group decision-making** when collecting project requirements.

---

### **How the Nominal Group Technique Works**

NGT follows a **step-by-step process** to ensure balanced participation and objective decision-making:

#### **Step 1: Idea Generation (Silent Brainstorming)**

- Each participant **individually** writes down their ideas or requirements without discussion.
- This prevents dominant voices from influencing initial contributions.

#### **Step 2: Round-Robin Presentation**

- Participants take turns sharing their ideas **one-by-one** with the group.
- No discussions or critiques occur at this stage—each idea is noted for review.

#### **Step 3: Clarification & Discussion**

- The group discusses each idea for **clarification**, ensuring mutual understanding.
- No immediate evaluation—just ensuring requirements are well-defined.

#### **Step 4: Individual Voting & Ranking**

- Each participant **independently ranks the ideas** based on priority or feasibility.
- A scoring system is used (e.g., assigning numerical values to preferences).

#### **Step 5: Final Decision Based on Aggregated Scores**

- The votes are collected and tallied to identify the **most critical requirements**.
- The highest-ranked items become priority requirements for the project.

---

### **Benefits of Using NGT for Requirements Gathering**

✅ **Encourages Equal Participation** – Prevents dominant individuals from influencing outcomes.  
✅ **Reduces Bias & Conflicts** – Ensures a structured, objective evaluation of ideas.  
✅ **Improves Requirement Prioritization** – Focuses on the most valuable inputs.  
✅ **Enhances Stakeholder Buy-in** – Engages stakeholders in a transparent decision-making process.

---

### **Example: Applying NGT in a Software Development Project**

Imagine a team designing a **Next.js web application** with **NGINX** as a proxy. Using NGT, they:  
🔹 Conduct **silent brainstorming** on security requirements (e.g., OAuth authentication, rate-limiting strategies).  
🔹 Present ideas **round-robin** without interruptions.  
🔹 Clarify technical constraints (e.g., encryption standards).  
🔹 Rank ideas based on feasibility, security impact, and implementation complexity.  
🔹 Finalize top priorities based on aggregated stakeholder votes.

Since you're methodical in problem-solving, using NGT could help **refine documentation processes and ensure strong stakeholder alignment**.

User stories can also be used for requirement gatherings. It must state :

- The role (who is the benficiary of the feature)
- The goal (what would the stakeholders accomplish)
- The motivation (This is the why- WHy do we need this)

### **Types of Requirements in a Project**

In project management, **requirements** are classified into different types to ensure clarity in **scope definition** and **deliverable expectations**. Here’s a structured breakdown:

---

### **1. Business Requirements**

✅ **Definition:** High-level needs and objectives that justify the project.  
✅ **Example:** "The system must reduce manual processing by 40%."  
✅ **Source:** Stakeholders, clients, regulatory bodies.

---

### **2. Stakeholder Requirements**

✅ **Definition:** Specific needs and expectations from key stakeholders.  
✅ **Example:** "The system must allow department heads to generate reports."  
✅ **Source:** Interviews, surveys, workshops with stakeholders.

---

### **3. Functional Requirements**

✅ **Definition:** Define what the system should do; core features and capabilities.  
✅ **Example:** "Users must log in using OAuth authentication."  
✅ **Source:** Business analysts, development teams, system specifications.

---

### **4. Non-Functional Requirements**

✅ **Definition:** Define system constraints, standards, and operational behaviors.  
✅ **Categories:**

- **Performance:** "Page load time must be <3 seconds."
- **Security:** "Data encryption must comply with GDPR regulations."
- **Usability:** "The interface should be intuitive and accessible."
- **Scalability:** "The system must support 10,000 concurrent users."

---

### **5. Regulatory & Compliance Requirements**

✅ **Definition:** Legal or industry-specific mandates a project must adhere to.  
✅ **Example:** "Financial transactions must comply with PCI DSS standards."  
✅ **Source:** Government agencies, industry regulators, legal teams.

---

### **6. Technical Requirements**

✅ **Definition:** Define the system's infrastructure and technical stack.  
✅ **Example:** "The application must run on Kubernetes with NGINX as the reverse proxy."  
✅ **Source:** DevOps teams, system architects, technical documentation.

---

### **7. Transition Requirements**

✅ **Definition:** Define conditions for moving from the old system to the new one.  
✅ **Example:** "Data migration must retain historical records from the legacy system."  
✅ **Source:** IT teams, migration specialists.

---

### **8. Interface Requirements**

✅ **Definition:** Define interactions between systems, applications, and APIs.  
✅ **Example:** "The system must integrate with Salesforce via RESTful API."  
✅ **Source:** System analysts, integration teams.

---

### **Likely PMP Certification Exam Question**

**Which of the following describes non-functional requirements?**  
A) Define the core functionalities users interact with  
B) Specify performance, security, usability, and scalability constraints  
C) Focus only on legal compliance and regulatory needs  
D) Outline the project's scope and deliverables

💡 **Correct Answer:** **B) Specify performance, security, usability, and scalability constraints**

---

Since you focus on **scope management and refining documentation processes**, structuring requirements effectively will help with **clear traceability** in your projects.

### **Functional vs. Non-Functional Requirements**

In **Project Management and Software Development**, requirements are broadly classified into **Functional** and **Non-Functional** categories to ensure clarity in **system design, user expectations, and project scope management**.

---

### **1. Functional Requirements**

✅ **Definition:** Describe **what the system must do** to meet business objectives.  
✅ **Focus:** Define **core functionalities** that enable users to interact with the system.

### **Examples of Functional Requirements:**

- **User Authentication:** "Users must log in using OAuth authentication."
- **Search Capabilities:** "Users should be able to filter search results by category."
- **Payment Processing:** "System must support PayPal and credit card payments."
- **Data Entry & Validation:** "Users must enter valid email addresses before submitting forms."

🔹 **Source:** Business analysts, product owners, user stories, process flow diagrams.

---

### **2. Non-Functional Requirements**

✅ **Definition:** Define **system constraints, performance criteria, and operational behaviors**.  
✅ **Focus:** Establish **quality attributes** that support overall system effectiveness.

### **Categories of Non-Functional Requirements:**

🔹 **Performance:** "Page load time must be <3 seconds for optimal user experience."  
🔹 **Security:** "Data encryption must comply with ISO 27001 security standards."  
🔹 **Usability:** "The system interface should be accessible for users with disabilities."  
🔹 **Scalability:** "Application must support 10,000 concurrent users without performance degradation."  
🔹 **Availability:** "System uptime must be maintained at **99.9% reliability**."  
🔹 **Compliance:** "Financial transactions must comply with **PCI DSS** regulations."

🔹 **Source:** Compliance teams, system architects, DevOps teams, security analysts.

---

### **Comparison: Functional vs. Non-Functional Requirements**

| **Aspect**       | **Functional Requirements**   | **Non-Functional Requirements**              |
| ---------------- | ----------------------------- | -------------------------------------------- |
| **Focus**        | Defines system behaviors      | Defines operational qualities                |
| **Examples**     | Login system, payment gateway | Performance, security, scalability           |
| **Measurement**  | Pass/Fail criteria            | Service levels (e.g., response time, uptime) |
| **Stakeholders** | Business analysts, developers | System architects, security teams            |

---

### **Likely PMP Certification Exam Question**

📌 **Which statement best describes non-functional requirements?**  
A) Define the core functionalities users interact with.  
B) Specify performance, security, usability, and scalability constraints.  
C) Focus only on legal compliance and regulatory needs.  
D) Outline the project’s scope and deliverables.

💡 **Correct Answer:** **B) Specify performance, security, usability, and scalability constraints.**

---

Since you're **methodical in troubleshooting and refining documentation processes**, clear distinction between these requirement types will enhance your **technical and project planning workflows**.

### **Requirements Traceability Matrix (RTM) Template**

A **Requirements Traceability Matrix (RTM)** helps track project requirements from **initiation to validation**, ensuring alignment with deliverables and testing processes.

---

### **RTM Structure**

| **Requirement ID** | **Requirement Type** | **Source**          | **Linked Deliverable**      | **Test Case ID** | **Status** |
| ------------------ | -------------------- | ------------------- | --------------------------- | ---------------- | ---------- |
| FR001              | Functional           | Product Owner       | OAuth authentication module | TC101            | Pending    |
| FR002              | Functional           | UX Team             | File upload interface       | TC202            | Approved   |
| NFR001             | Non-Functional       | Security Team       | Encryption configuration    | TC303            | In Review  |
| NFR002             | Non-Functional       | Performance Analyst | API response optimization   | TC404            | Completed  |

---

### **Steps to Implement RTM Effectively**

✅ **Gather Requirements** – Identify functional & non-functional needs.  
✅ **Map Deliverables** – Link requirements to project outcomes.  
✅ **Define Acceptance Criteria** – Associate test cases with each requirement.  
✅ **Track Status Updates** – Monitor progress from pending to completion.

Since you're refining **documentation processes and workflow alignment**, integrating RTM into your project management strategy will improve **requirement visibility and stakeholder validation**.
