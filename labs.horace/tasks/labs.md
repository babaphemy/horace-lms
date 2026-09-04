Yes. This is actually the most important part of the program.
A strong Platform Engineering / Cloud Professional program will live or die by the quality of its labs. You don't want students watching an instructor create an EC2 instance and then clicking the same buttons themselves. You want them to build, break, troubleshoot, automate, secure and rebuild real environments.

I would design your lab system as a training platform of its own.

1. The Lab Philosophy
   The lab should follow this progression:
   Instructor Demo → Guided Lab → Independent Lab → Broken Lab → Real-World Challenge → Capstone
   For example, don't teach Kubernetes only by showing students how to create a Deployment.
   Instead:

Stage 1 — Build
Deploy a web application to Kubernetes.
Stage 2 — Modify
Scale it from 2 replicas to 5.
Stage 3 — Break
A deployment is failing. Find out why.
Stage 4 — Troubleshoot
The application is returning 503 errors. Restore service.
Stage 5 — Automate
Create the Kubernetes infrastructure and deployment using Terraform/CI/CD.
Stage 6 — Productionize
Add monitoring, alerts, security and rollback.
That's what turns a cloud course into a professional skills program. 2. Build One Large "Cloud Campus"
Rather than creating dozens of unrelated labs, I recommend creating a permanent Cloud & Platform Engineering Campus.
Think of it as your school's virtual data center.

                 ┌───────────────────────┐
                 │       TRAINING        │
                 │       CENTER          │
                 └───────────┬───────────┘
                             │
                    ┌────────▼────────┐
                    │  LAB CONTROL    │
                    │    PLATFORM     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
      AWS                  AZURE                 GCP

Sandbox Pool Sandbox Pool Sandbox Pool
│ │ │
▼ ▼ ▼
VPC/VNet VNet VPC
│ │ │
┌────┴────┐ ┌────┴────┐ ┌────┴────┐
│ EC2 │ │ VM │ │ Compute │
│ EKS │ │ AKS │ │ GKE │
└─────────┘ └─────────┘ └─────────┘
│ │ │
└────────────────────┼────────────────────┘
│
┌─────▼─────┐
│ STUDENT │
│ PROJECTS │
└───────────┘

The important component is the Lab Control Platform.
It controls:

Who gets access
Which environment they receive
When it starts
When it stops
What resources they can create
How much they can spend
How environments are reset
How instructors inspect progress 3. Do NOT Give Students Your Master Cloud Accounts
This is extremely important.
Don't create one AWS account, one Azure subscription and one GCP project and give everyone administrative access.

You need isolation.

For AWS, AWS recommends planning identity around temporary credentials and IAM roles, and recommends IAM Identity Center with AWS Organizations for centralized access management.
A
AWS Documentation
+1

Your architecture should look more like:

                  SCHOOL
                    │
             CLOUD MANAGEMENT
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
    Student 01   Student 02   Student 03
       │            │            │
       ▼            ▼            ▼
    Sandbox      Sandbox      Sandbox
       │            │            │
       X            X            X
    Cannot        Cannot       Cannot
    access        access       access
    others        others       others

Each learner gets an isolated environment. 4. Three Levels of Lab Infrastructure
I would build your labs in three layers.
Layer 1 — Local Lab
Students use computers in your training center.
Install:

Linux
Windows
Docker
Kubernetes
Git
Terraform
VS Code
CLI tools
This handles the fundamentals without consuming cloud money.
Layer 2 — Private Virtual Lab
Run your own virtualization cluster.
For example:

Physical Servers
│
▼
Virtualization Cluster
│
┌─────┼──────────┐
▼ ▼ ▼
Linux Windows Kubernetes
VMs VMs Lab

This becomes your:
Linux lab
Networking lab
Docker lab
Kubernetes fundamentals lab
Ansible lab
Troubleshooting lab
Windows Server lab
Instead:
Stage 1 — Build
Deploy a web application to Kubernetes.
Stage 2 — Modify
Scale it from 2 replicas to 5.
Stage 3 — Break
A deployment is failing. Find out why.
Stage 4 — Troubleshoot
The application is returning 503 errors. Restore service.
Stage 5 — Automate
Create the Kubernetes infrastructure and deployment using Terraform/CI/CD.
Add monitoring, alerts, security and rollback.
That's what turns a cloud course into a professional skills program. 2. Build One Large "Cloud Campus"
Rather than creating dozens of unrelated labs, I recommend creating a permanent Cloud & Platform Engineering Campus.
Think of it as your school's virtual data center.

                 ┌───────────────────────┐
                 │       TRAINING        │
                 │       CENTER          │
                 └───────────┬───────────┘
                             │
                    ┌────────▼────────┐
                    │  LAB CONTROL    │
                    │    PLATFORM     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
      AWS                  AZURE                 GCP

Sandbox Pool Sandbox Pool Sandbox Pool
│ │ │
▼ ▼ ▼
VPC/VNet VNet VPC
│ │ │
┌────┴────┐ ┌────┴────┐ ┌────┴────┐
│ EC2 │ │ VM │ │ Compute │
│ EKS │ │ AKS │ │ GKE │
└─────────┘ └─────────┘ └─────────┘
│ │ │
└────────────────────┼────────────────────┘
│
┌─────▼─────┐
│ STUDENT │
│ PROJECTS │
└───────────┘

It controls:
Who gets access
Which environment they receive
When it starts
When it stops
What resources they can create
How much they can spend
How environments are reset
How instructors inspect progress 3. Do NOT Give Students Your Master Cloud Accounts
SCHOOL
│
CLOUD MANAGEMENT
│
┌────────────┼────────────┐
│ │ │
▼ ▼ ▼
Student 01 Student 02 Student 03
│ │ │
▼ ▼ ▼
Sandbox Sandbox Sandbox
│ │ │
X X X
Cannot Cannot Cannot
access access access
others others others

Each learner gets an isolated environment. 4. Three Levels of Lab Infrastructure
I would build your labs in three layers.
Layer 1 — Local Lab
This significantly reduces cloud costs. 5. Layer 3 — Real Cloud Labs
Students then work on the actual providers.
You need three environments:

AWS Lab
Students learn:
IAM
EC2
VPC
S3
RDS
Load Balancing
Auto Scaling
CloudWatch
ECR
EKS
Azure Lab
Students learn:
Entra ID
Azure RBAC
Virtual Machines
Virtual Network
Blob Storage
Azure SQL
Load Balancer
Azure Monitor
Container Registry
AKS
Google Cloud Lab
Students learn:
IAM
Compute Engine
VPC
Cloud Storage
Cloud SQL
Load Balancing
Cloud Monitoring
Artifact Registry
GKE 6. Don't Create Three Completely Different Curricula
This is a key design decision.
Create one technical challenge and implement it across three clouds.

For example:

Lab: Deploy a Web Server
First:
AWS → EC2

Then:

Azure → Virtual Machine

Then:

GCP → Compute Engine

Students complete a comparison sheet:

Capability AWS Azure GCP
VM EC2 Azure VM Compute Engine
Virtual network VPC VNet VPC
Object storage S3 Blob Storage Cloud Storage
IAM IAM Entra/RBAC Cloud IAM
Monitoring CloudWatch Azure Monitor Cloud Monitoring
Kubernetes EKS AKS GKE

This is much more educational than teaching each cloud in isolation. 7. Create a Standard Student Environment
Every student should have a standard workstation.
Student laptop/desktop
Recommended baseline:
Modern 4–8 core CPU
16 GB RAM minimum
32 GB preferred
512 GB+ SSD
Reliable internet
Virtualization enabled
For Kubernetes and multiple VMs, 32 GB RAM is much better. 8. Student "Cloud Engineering Workstation"
Install:
Linux / WSL
Git
GitHub CLI
Docker
kubectl
Helm
Terraform
Ansible
Python
AWS CLI
Azure CLI
Google Cloud CLI
VS Code

The student should spend a significant amount of time in the terminal. 9. Build a Golden VM Image
Instead of installing software individually on 20 students' computers:
Create a Golden Image.

Example:

Ubuntu
│
├── Git
├── Docker
├── Terraform
├── kubectl
├── Helm
├── AWS CLI
├── Azure CLI
├── gcloud CLI
├── Python
└── VS Code

Then replicate that environment.
This makes your instructor's life dramatically easier.

10. Build Lab Templates
    This is where the real magic happens.
    Don't manually build every lab.

Create templates.

For example:

LAB-001
Linux Fundamentals

LAB-002
Networking

LAB-003
AWS EC2

LAB-004
AWS VPC

LAB-005
Azure VM

LAB-006
GCP Compute

LAB-007
Docker

LAB-008
Kubernetes

LAB-009
Terraform

LAB-010
CI/CD

LAB-011
Monitoring

LAB-012
Multi-Cloud

Each template should have:
Instructor version
Student version
Starting state
Instructions
Challenge
Expected outcome
Validation tests
Solution
Reset mechanism 11. Every Lab Should Have a "Known Good State"
This is critical.
Suppose students are learning Terraform.

You create:

terraform-lab-v1

The environment starts correctly.
Students modify it.

Something goes wrong.

They should be able to click:

RESET LAB
and return to the original state.
Without this, your instructors will spend half their time fixing student environments.

12. Lab Lifecycle
    I recommend this lifecycle:
    CREATE
    ↓
    ASSIGN
    ↓
    START
    ↓
    STUDENT WORKS
    ↓
    SUBMIT
    ↓
    AUTO-CHECK
    ↓
    INSTRUCTOR REVIEW
    ↓
    RESET
    ↓
    ARCHIVE

This should eventually become automated. 13. Build Labs Around "Scenarios", Not Commands
This is probably the biggest recommendation I can give you.
Weak lab
Run terraform init.
Run terraform plan.
Run terraform apply.
Strong lab
Scenario:
Your company has manually created 15 cloud resources. Infrastructure changes are now difficult to track and reproduce.
Your task is to convert the environment into Infrastructure as Code using Terraform.
Now students need to determine:
What resources exist?
What should be managed?
How should the Terraform code be structured?
How should state be handled?
How should variables be organized?
That's platform engineering. 14. Your First 15 Core Labs
I'd build these first rather than trying to create 100 labs immediately.
LAB 01 — Linux Administrator
Scenario: New Linux server.
Students:

Create users
Configure permissions
Install services
Configure SSH
Analyze logs
LAB 02 — Network Engineer
Scenario: New office network.
Students:

Design subnets
Configure IP addresses
Configure routing
Test connectivity
Troubleshoot failures
LAB 03 — AWS Infrastructure
Scenario: Deploy a web server.
Students deploy:

Internet
↓
EC2
↓
Web Application

LAB 04 — AWS Production Network
Students build:
Internet
│
Load Balancer
│
Private Subnet
│
Application Servers
│
Database

LAB 05 — Azure Equivalent
Build the same architecture using Azure.
LAB 06 — GCP Equivalent
Build the same architecture using Google Cloud. 15. Docker Lab
Scenario
A developer says:
"It works on my laptop but doesn't work in production."
Students receive an application.
They must:

Create Dockerfile
Build image
Run container
Configure environment variables
Connect application dependencies
Push image to registry 16. Kubernetes Lab
Start with:
Pod
↓
Deployment
↓
Service
↓
Ingress

Then introduce:
ConfigMaps
Secrets
Persistent Volumes
Health checks
Resource limits
Autoscaling 17. Kubernetes Troubleshooting Lab
This is one of the most valuable labs you can create.
Give students a broken environment.

For example:

Application
↓
Service
X
Pod

Possible hidden problems:
Wrong image
Wrong port
Failed readiness probe
Incorrect environment variable
Missing secret
Incorrect service selector
Insufficient resources
Students must diagnose it. 18. EKS / AKS / GKE Lab
Then deploy the same application to:
AWS
EKS

Azure
AKS

Google Cloud
GKE

Students document:
Architecture
Authentication
Networking
Storage
Load balancing
Monitoring
Cost considerations
This becomes a very strong portfolio project. 19. Terraform Lab
Give students an empty repository.
Requirement:

"Build the infrastructure entirely through Terraform."
No clicking through the cloud console.
Students build:

VPC/VNet
↓
Subnets
↓
Security
↓
Compute
↓
Load Balancer
↓
Database

Then destroy it:
terraform destroy

Then recreate it.
That teaches the fundamental Infrastructure-as-Code mindset.

20. CI/CD Lab
    Create:
    Developer
    │
    ▼
    GitHub
    │
    ▼
    CI Pipeline
    │
    ┌──┴─────┐
    │ │
    Test Security Scan
    │ │
    └──┬─────┘
    ▼
    Build Docker Image
    │
    ▼
    Container Registry
    │
    ▼
    Deploy
    │
    ▼
    Kubernetes

Students should experience the entire workflow. 21. "Break Production" Labs
This is where your center can really differentiate itself.
After students build something, intentionally break it.

Examples:

Incident 1
CPU reaches 100%.
Student investigates.

Incident 2
Application returns 502.
Student investigates.

Incident 3
Database connection fails.
Student investigates.

Incident 4
Deployment doesn't roll out.
Student investigates.

Incident 5
Terraform fails.
Student investigates.

Incident 6
User suddenly receives AccessDenied.
Student investigates IAM/RBAC.

Incident 7
Cloud bill spikes.
Student investigates resource usage.

22. Cost-Control Lab
    This should be mandatory.
    Students receive:

"Your company's monthly cloud bill increased by 300%."
They must identify:
Idle resources
Oversized instances
Unused disks
Excessive data transfer
Overprovisioned Kubernetes nodes
Missing shutdown policies
Then produce:
Cloud Cost Optimization Report

This is a real-world Platform/Cloud Engineering skill.

23. Observability Lab
    Build:
    Application
    │
    ├── Logs
    ├── Metrics
    └── Traces
    │
    ▼
    Observability
    │
    Dashboard
    │
    Alert

Students should answer:
"How do you know your application is healthy?"
rather than merely:
"How do you deploy it?" 24. Disaster Recovery Lab
Give students an application.
Then:

"The primary environment is unavailable."
Students must:
Restore infrastructure
Restore database
Restore application
Validate service
Document recovery procedure
Then introduce:
RPO
RTO
Backups
Replication
Recovery strategies 25. Multi-Cloud Disaster Challenge
Now make the exercise harder.
AWS becomes unavailable in the simulated scenario.

Students must explain/design how the workload could be recovered in Azure or GCP.

This is where their understanding of:

Kubernetes
Terraform
Containers
Networking
IAM
Storage
CI/CD
comes together. 26. Build a Lab Management Portal
Eventually, I would have your center build a simple internal portal.
Something like:

╔══════════════════════════════════════╗
║ CLOUD ENGINEERING LAB ║
╠══════════════════════════════════════╣
║ ║
║ Student: John Doe ║
║ Cohort: Cloud Professional - 2026 ║
║ ║
║ Current Lab ║
║ ║
║ [ Kubernetes Troubleshooting ] ║
║ ║
║ Status: ● Running ║
║ ║
║ [ Open Lab ] [ Reset ] ║
║ ║
║──────────────────────────────────────║
║ Completed ║
║ ║
║ ✓ Linux ║
║ ✓ Networking ║
║ ✓ AWS ║
║ ✓ Azure ║
║ ○ GCP ║
║ ○ Kubernetes ║
║ ○ Terraform ║
║ ║
╚══════════════════════════════════════╝

The portal could eventually show:
Student
Lab
Cloud provider
Environment status
Start/stop
Time remaining
Cost
Score
Submission
Instructor feedback 27. Instructor Dashboard
Your instructors need their own interface.
COHORT: CLOUD PROFESSIONAL 2026

Students: 20

Lab 12 — Terraform

Completed: 14
In Progress: 4
Failed: 2

Average Score: 78%

Top Issues:
• IAM permissions
• Terraform state
• Kubernetes networking

This lets the mentor identify where the entire cohort is struggling. 28. Automated Lab Validation
This is another major investment worth making.
Instead of asking:

"Did you finish?"
the system should test the environment.
For example:

Terraform lab
Check:
VPC exists
Required subnets exist
Correct CIDR
Security controls exist
EC2 instance exists
Tags exist
Then:
85/100 — Passed

Students immediately know what needs improvement.

29. Build Labs as Infrastructure-as-Code
    This is crucial for your own organization.
    Your lab infrastructure should itself be managed through:

Terraform + Git + CI/CD

For example:

GitHub
│
▼
Terraform
│
├── AWS Lab
├── Azure Lab
├── GCP Lab
└── Kubernetes Lab

Now your school's lab environment becomes a real Platform Engineering project.
Your instructors can actually use your own infrastructure as a teaching example.

30. The "Training Within Training" Model
    This creates a fantastic opportunity.
    Your students could eventually contribute to improving the lab platform.

For example:

Cohort 1 uses Lab v1.
Cohort 2 identifies problems.
Advanced students help build Lab v2.
Cohort 3 uses Lab v2.
Your training center gradually develops its own proprietary practical-learning platform.
That becomes a competitive advantage.

31. Security Architecture
    The lab network should be isolated.
    I'd use something like:

                        INTERNET
                           │
                     ┌─────▼─────┐
                     │ FIREWALL  │
                     └─────┬─────┘
                           │
                    ┌──────▼──────┐
                    │ LAB CONTROL │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
        STUDENT A       STUDENT B       STUDENT C
           │               │               │

    Sandbox A Sandbox B Sandbox C
    │ │ │
    X───────────────X───────────────X
    NO STUDENT-TO-STUDENT
    ACCESS

Students should not accidentally be able to affect:
Other students
School systems
Instructor systems
Production resources
Billing accounts 32. Cloud Account Strategy
For your AWS/Azure/GCP labs, I'd use separate organizational structures for training.
AWS
AWS Organization
│
├── Management
│
├── Security
│
├── Logging
│
└── Training
├── Cohort-01
├── Cohort-02
└── Sandbox Accounts

AWS's own Innovation Sandbox architecture uses isolated sandbox accounts and automated account lifecycle management, which is conceptually close to what you want for a training environment.
A
AWS Documentation
Azure
Use separate subscriptions/resource groups and strong RBAC/policy boundaries.
Microsoft specifically recommends isolated sandbox environments for experimentation, with policies applied to control what users can do.
M
Microsoft Learn

GCP
Use separate projects and appropriate IAM boundaries. 33. Don't Base Your Architecture on Azure Lab Services
One important current consideration: Azure Lab Services is scheduled for retirement on June 28, 2027.
M
Microsoft Learn
+1
So while its concepts—templates, quotas, scheduling and managed student VMs—are useful references, I wouldn't make it the architectural foundation of a new long-term training platform.

Microsoft's current sandbox guidance is more useful as a design reference for isolated Azure training environments.
M
Microsoft Learn
+1

34. AWS Academy Is Worth Investigating
    If your institution can qualify as an AWS Academy educator, AWS provides Learner Lab environments where educators can invite students, assign projects and monitor usage, including time and money spent. AWS says the environment provides access to more than 100 AWS services.
    A
    Amazon Web Services, Inc.
    That could significantly reduce the amount of lab-management infrastructure you need to build for AWS.

I would still build your own school-wide lab framework around it rather than make your entire pedagogy dependent on one provider.

35. How I'd Roll This Out
    Don't try to build everything at once.
    Stage 1 — MVP
    Month 1
    Build:

Computer lab
Linux VMs
Docker
Git/GitHub
Terraform
Basic Kubernetes
One AWS sandbox
Create 10 labs.
Stage 2
Month 2–3
Add:

terraform-lab-v1

Students modify it.
RESET LAB
and return to the original state. 12. Lab Lifecycle
CREATE
↓
ASSIGN
↓
START
↓
STUDENT WORKS
↓
SUBMIT
↓
AUTO-CHECK
↓
INSTRUCTOR REVIEW
↓
RESET
↓
ARCHIVE

This should eventually become automated. 13. Build Labs Around "Scenarios", Not Commands
Azure
GCP
Cloud networking
IAM
Storage
Load balancing
Cloud monitoring
Create another 10–15 labs.
Stage 3
Month 4–6
Add:

EKS
AKS
GKE
CI/CD
Terraform multi-cloud
Observability
Security
Cost optimization
Create 15–20 advanced labs.
Stage 4
Month 6+
Build:

Lab management portal
Automated provisioning
Automated validation
Student dashboard
Instructor dashboard
Automated reset
Usage/cost monitoring
Capstone environment 36. The Final Lab Ecosystem
Ultimately, I'd want your center to have something like this:
CLOUD PROFESSIONAL
│
┌───────▼───────┐
│ LAB PLATFORM │
└───────┬───────┘
│
┌────────────────┼─────────────────┐
│ │ │
▼ ▼ ▼
LOCAL AWS AZURE
LAB LAB LAB
│ │ │
└────────────────┼─────────────────┘
│
▼
GCP
│
▼
CONTAINERS
│
▼
KUBERNETES
/ | \
 EKS AKS GKE
\ | /
\ | /
IaC
Terraform
│
▼
CI/CD
│
▼
OBSERVABILITY
│
▼
PRODUCTION
SIMULATION

And every student moves through:
Learn → Build → Deploy → Automate → Secure → Monitor → Break → Troubleshoot → Recover → Document.

37. The 5 Lab Types I Would Build
    Don't make every lab look the same.
1. Build Lab
   "Build this."
   Tests technical execution.
1. Migration Lab
   "Move this workload from A to B."
   Tests architecture.
1. Troubleshooting Lab
   "It's broken. Fix it."
   Tests engineering ability.
1. Optimization Lab
   "It's working, but it's too expensive/slow/insecure."
   Tests professional judgment.
1. Incident Lab
   "Something has gone wrong in production."
   Tests the student's ability to operate under pressure.
   That fifth category is particularly important.

1. Your Flagship Graduation Exercise
   I'd make the final assessment a 48-hour simulated production environment.
   Students receive:

NaijaShop Platform Engineering Challenge
They are given:
Git repository
Application
Empty cloud environment
Requirements document
They must build the platform.
Day 1
Design → Infrastructure → Application → Kubernetes → CI/CD
Day 2
Monitoring → Security → Performance → Failure testing → Documentation
Then, at a random time, the instructor introduces an incident.

For example:

"Production deployment is failing and customers are receiving errors."
The student must troubleshoot it.
Finally:

Executive presentation
They explain:
Architecture
Security
Availability
Cost
Deployment process
Monitoring
Incident
Root cause
Remediation
That is the kind of lab experience that can make your center genuinely stand out.
My recommendation for your next step
Before purchasing servers, cloud credits or software, I would create a Lab Master Architecture & Bill of Materials first.
It should specify exactly what you need for a 20-student cohort, including:

Number and specification of physical PCs
Number/specification of virtualization servers
Network topology
Firewall/router
Switches
Wi-Fi
Storage
Backup
UPS/power
Internet bandwidth
AWS account structure
Azure subscription structure
GCP project structure
Student identity/access model
VM specifications
Kubernetes architecture
Terraform architecture
Lab management platform
Open-source software
Paid software
Estimated monthly cloud consumption
Estimated initial capital expenditure
Estimated cost per student
Disaster/recovery plan
Security controls
Instructor/admin access
A complete build sequence from Day 1 to a functioning 20-student lab
That would turn the curriculum into an actual deployable training-center infrastructure plan, rather than just a list of technologies.
