### 💡 What is Actimize IFM-X Install?

**Actimize IFM-X** (Integrated Fraud Management – Extended) is the modern, modular version of NICE Actimize's fraud detection platform. It includes updated capabilities such as:

- Real-time and batch fraud detection
- Enhanced performance and scalability
- Modular rule and model framework
- Integration with ActOne for unified investigation

An **IFM-X install** refers to the **installation and deployment** of this enhanced platform, typically in an **on-premises** or **hybrid** enterprise environment.

---

## 🧱 Key Components of an IFM-X Install

1. **AIS (Actimize Integration Services)**

   - Ingests external data (transactions, logins, etc.)
   - Maps to UDM

2. **UDM (Unified Data Model)**

   - Structured tables for Customers, Accounts, Transactions, Devices, etc.

3. **IFM-X Detection Models**

   - Evaluate data for fraud using rules, analytics, and machine learning
   - Replaces older "IFM Classic" model engine

4. **Alerts Engine**

   - Generates alerts based on rules and scores

5. **RCM/ActOne**

   - Workflow engine to handle alerts as cases

6. **Ops and Admin Tools**

   - Model Editor (for rule creation)
   - Alert and Case View Designers
   - Deployment tools and logging

7. **External Interfaces**

   - Integration with real-time transaction systems (e.g., APIs, MQs)
   - Regulatory reporting and dashboarding

---

## ⚙️ What's Involved in an IFM-X Install?

A typical installation may include:

### ✅ 1. **Infrastructure Setup**

- Servers (app, DB, web) and load balancers
- Java, Tomcat, Oracle/SQL Server
- Messaging middleware (Kafka, JMS, etc.)

### ✅ 2. **Installation Steps**

- Install **AIS**, **RCM**, **IFM-X components**
- Set up UDM schema
- Configure **data feeds** and **schedulers**
- Deploy detection models and rules
- Enable real-time interfaces (e.g., APIs)

### ✅ 3. **Environment Configuration**

- DEV, QA, UAT, PROD
- Configure logs, time zones, SLA thresholds
- Configure access (LDAP, roles)

### ✅ 4. **Deployment Tools**

- Actimize Deployment Manager (ADM)
- Model Deployment Tool (MDT)
- RCM/Alert configuration packages

---

## 🛠️ Sample Use Case: Banking Real-Time IFM-X Install

> A bank wants to deploy IFM-X to detect fraud in debit card and mobile transactions.

Steps:

1. Install AIS and configure real-time Kafka consumer
2. Map incoming JSON transaction data to UDM
3. Deploy IFM-X rules that monitor for:

   - High-risk geographies
   - Velocity patterns
   - Customer-device mismatches

4. Configure alert queues and routing in RCM
5. Deploy to ActOne for investigator workflows

---

## 📘 Key Differences Between IFM Classic and IFM-X

| Feature           | IFM Classic    | IFM-X                      |
| ----------------- | -------------- | -------------------------- |
| Architecture      | Monolithic     | Modular                    |
| Real-time Support | Limited        | Native                     |
| Model Framework   | Proprietary    | Flexible, analytics-first  |
| UI & Dev Tools    | Older Designer | Web-based Model Studio     |
| Performance       | Moderate       | High throughput / scalable |

---

Would you like a checklist of pre-requisites and post-install verification steps for an IFM-X install?
