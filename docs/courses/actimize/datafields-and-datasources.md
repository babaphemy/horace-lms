In Actimize IFM (Integrated Fraud Management), data fields and their data sources are foundational concepts that define how transaction and customer data is ingested, mapped, and used for fraud detection.

🧾 What Are Data Fields in Actimize IFM?
Data fields are individual units of data (like transactionAmount, customerID, deviceID) that represent real-world information used by the IFM engine to evaluate fraud risks.

Each field has:

Attribute Description
Name Logical name (e.g., AccountNumber, TransactionAmount)
Data Type String, Number, Date, Boolean, etc.
UDM Mapping Field's mapping to the Unified Data Model
Source Originating system (e.g., Core Banking, Mobile App, ATM)
Usage Used in rules, models, and alerts

🧩 What Are Data Sources?
Data sources refer to external systems or interfaces that provide raw data to Actimize for processing. Examples include:

Data Source Type Description
Core Banking Customer, Account, Transaction data
Digital Channels Online/mobile transactions, device fingerprints
ATM/POS Systems Card-present transactions
External APIs KYC, blacklist, geolocation, etc.
Batch Files CSV, XML, JSON for offline/batch ingestion
Real-Time Events Kafka, JMS, MQ – live transaction feeds

🔁 How Do Data Fields Connect to Data Sources?
The flow works like this:

1. Source System
   E.g., Bank's transaction API sends a POST request with JSON:

json
Copy
Edit
{
"transactionId": "TXN123",
"amount": 5000,
"accountNumber": "1234567890",
"timestamp": "2025-05-27T10:15:00Z"
} 2. AIS (Actimize Integration Services)
Reads the incoming data via interface

Maps it to Data Fields

3. UDM Mapper
   Maps source fields → UDM fields
   E.g.,
   amount → TransactionAmount
   accountNumber → SourceAccountNumber

4. Unified Data Model (UDM)
   Stores the standardized data

Enables detection models to run consistently across systems

5. Detection Engine (IFM)
   Rules and machine learning models use these UDM fields to evaluate fraud risk
   E.g.,

IF TransactionAmount > 10,000 AND DeviceRiskScore > 70 THEN Flag

📦 Common Field Categories in IFM
Field Group Examples
Transaction Info TransactionAmount, TransactionType, Channel, MerchantName
Customer Info CustomerID, DOB, KYCStatus, RiskLevel
Account Info AccountNumber, AccountType, AccountStatus
Device Info DeviceID, GeoLocation, BrowserFingerprint
Login/Session Info LoginID, SessionID, IP Address
