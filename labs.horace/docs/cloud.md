The student should graduate able to take an application from developer laptop → source control → CI/CD → cloud infrastructure → containers → Kubernetes → monitoring → production, and be able to operate and troubleshoot it.

I would explicitly build the program around the three dominant hyperscale cloud platforms: Amazon Web Services (AWS), Microsoft Azure, and Google Cloud (GCP). The major providers have broadly comparable capabilities, while their services and terminology differ—for example, AWS EKS, Azure AKS and Google GKE are their managed Kubernetes offerings.
Google Cloud Documentation

Professional Platform Engineering & Cloud Mentorship Program
Program positioning
Duration: 6 months / 24 weeks
Format: 3 sessions per week
Session: 2.5–3 hours
Practical ratio: 70% hands-on / 30% theory
Level: Beginner → Job-ready practitioner
Cloud coverage: AWS + Azure + Google Cloud
Core philosophy: Build → Automate → Deploy → Secure → Monitor → Troubleshoot
Program promise
From Cloud Beginner to Platform Engineer — through hands-on infrastructure, automation, containers, Kubernetes, CI/CD and multi-cloud projects.

1. What Makes This Different From a Generic Cloud Course?
   The program should not be:
   "Learn AWS services for six months."
   Instead, students repeatedly build the same application/platform concepts across the three clouds.
   For example:

| Capability | AWS | Azure | Google Cloud |
| --- | --- | --- | --- |
| Virtual machines | EC2 | Azure Virtual Machines | Compute Engine |
| Object storage | S3 | Blob Storage | Cloud Storage |
| Identity | IAM | Microsoft Entra ID / Azure RBAC | Cloud IAM |
| Kubernetes | EKS | AKS | GKE |
| Container registry | ECR | Azure Container Registry | Artifact Registry |
| Serverless/container apps | Lambda / ECS | Functions / Container Apps | Cloud Run |
| Network | VPC | Virtual Network | VPC |
| Monitoring | CloudWatch | Azure Monitor | Cloud Monitoring |
| IaC | Terraform / CloudFormation | Terraform / Bicep | Terraform |
| CI/CD | CodePipeline/CodeBuild + GitHub | Azure DevOps/GitHub | Cloud Build/GitHub |

The purpose isn't to make students memorize 100 services.
It is to teach:

"I understand the underlying platform-engineering problem, so I can solve it regardless of the cloud provider."
Google's own service-comparison documentation maps comparable services across AWS, Azure and Google Cloud, which makes this cross-cloud approach particularly suitable for teaching transferable skills.
G
Google Cloud Documentation 2. GRADUATION OUTCOMES
By graduation, students should be able to:
For example:

| Capability | AWS | Azure | Google Cloud |
| --- | --- | --- | --- |
| Virtual machines | EC2 | Azure Virtual Machines | Compute Engine |
| Object storage | S3 | Blob Storage | Cloud Storage |
| Identity | IAM | Microsoft Entra ID / Azure RBAC | Cloud IAM |
| Kubernetes | EKS | AKS | GKE |
| Container registry | ECR | Azure Container Registry | Artifact Registry |
| Serverless/container apps | Lambda / ECS | Functions / Container Apps | Cloud Run |
| Network | VPC | Virtual Network | VPC |
| Monitoring | CloudWatch | Azure Monitor | Cloud Monitoring |
| IaC | Terraform / CloudFormation | Terraform / Bicep | Terraform |
| CI/CD | CodePipeline/CodeBuild + GitHub | Azure DevOps/GitHub | Cloud Build/GitHub |

The purpose isn't to make students memorize 100 services.
It is to teach:

"I understand the underlying platform-engineering problem, so I can solve it regardless of the cloud provider."
Google's own service-comparison documentation maps comparable services across AWS, Azure and Google Cloud, which makes this cross-cloud approach particularly suitable for teaching transferable skills. 2. GRADUATION OUTCOMES
By graduation, students should be able to:
Administer Linux systems.
Understand enterprise networking.
Work with Git and GitHub.
Build cloud infrastructure.
Deploy applications to AWS, Azure and Google Cloud.
Configure cloud networking.
Manage cloud identities and permissions.
Work with object and block storage.
Build container images.
Use Docker.
Deploy and manage Kubernetes.
Work with EKS, AKS and GKE.
Build CI/CD pipelines.
Write Infrastructure as Code.
Use Terraform.
Implement secrets management.
Configure monitoring and logging.
Troubleshoot production systems.
Implement cloud security fundamentals.
Understand reliability and high availability.
Implement autoscaling.
Optimize cloud costs.
Implement basic DevSecOps.
Design cloud architectures.
Document infrastructure.
Work collaboratively using Git.
Build a professional Platform Engineering portfolio.
PHASE 1 — IT & PLATFORM ENGINEERING FOUNDATIONS
Week 1 — Introduction to Cloud & Platform Engineering
Theory
What is cloud computing?
IaaS
PaaS
SaaS
Public/private/hybrid cloud
Regions and availability zones
Scalability
Elasticity
High availability
Fault tolerance
Disaster recovery
Shared responsibility
What is Platform Engineering?
DevOps vs Platform Engineering
SRE fundamentals
Infrastructure vs application engineering
Practical
Students design a cloud architecture for:
A Nigerian e-commerce company

They identify:

Users
Application
Database
Storage
Network
Security
Monitoring
Backup
Deliverable
Cloud Architecture Diagram v1
Week 2 — Linux & Command Line
Topics
Linux filesystem
Users/groups
Permissions
Processes
Services
SSH
Networking commands
Package management
Bash
Environment variables
Logs
Lab
Deploy Linux VMs and administer them entirely through the command line.
Challenge
"You have inherited a Linux server. Secure it, create users, configure SSH and investigate its logs."
Week 3 — Networking for Cloud Engineers
Topics
TCP/IP
OSI
IP addressing
CIDR
Subnetting
DNS
DHCP
HTTP/HTTPS
Ports
Routing
NAT
Firewalls
Load balancing
VPN
Private/public networks
Lab
Design and implement a virtual corporate network.
PHASE 2 — CLOUD FUNDAMENTALS & AWS
Week 4 — AWS Fundamentals
Introduce the AWS architecture and core services.
Focus
AWS accounts
Regions
Availability Zones
IAM
EC2
S3
VPC
Security Groups
CloudWatch
Students build their first AWS environment.
Project
Deploy a Linux web server on AWS.
Week 5 — AWS Networking
Topics
VPC
Subnets
Route tables
Internet Gateway
NAT Gateway
Security Groups
Network ACLs
Load Balancers
DNS
Lab
Build:
Internet
│
Load Balancer
│
Private Application Servers
│
Database

Students learn why production workloads should not simply expose every server to the public internet.
Week 6 — AWS Compute, Storage & Databases
Topics
EC2
Auto Scaling
Elastic Load Balancing
S3
EBS
RDS
Backup
Encryption
Practical
Deploy a three-tier application.
Deliverable
AWS Production Architecture
Week 7 — AWS Security & IAM
Students learn:
IAM users
Groups
Roles
Policies
Least privilege
MFA
Secrets
Encryption
Logging
Security monitoring
IAM policies control which principals can perform which actions on AWS resources, and AWS uses roles extensively for workload access.
A
AWS Documentation
+1
Project
Secure an AWS Environment
PHASE 3 — AZURE
Week 8 — Azure Fundamentals
Topics
Deliverable
IAM users
Groups
Roles
Policies
Least privilege
MFA
Secrets
Encryption
Logging
Security monitoring
Project
Secure an AWS Environment
PHASE 3 — AZURE
Week 8 — Azure Fundamentals
Topics
Azure subscriptions
Resource groups
Regions
Availability zones
Azure Portal
Azure CLI
Azure Resource Manager
Virtual Machines
Storage
Virtual Networks
Azure Monitor
Practical
Deploy an application to Azure.
Week 9 — Azure Networking
Topics
Virtual Networks
Subnets
Network Security Groups
Public/private IP
Azure Load Balancer
Application Gateway
VPN
DNS
VNet peering
Lab
Build a secure multi-tier Azure environment.
Week 10 — Azure Identity, Storage & Compute
Topics
Microsoft Entra ID
Azure RBAC
Managed identities
Virtual Machines
Blob Storage
Managed Disks
Azure SQL
Key Vault
Practical
Students implement an application that accesses Azure resources without embedding long-lived secrets.
Azure supports managed identities for VMs and integration with storage and identity controls.
M
Microsoft Learn

Week 11 — Azure Security & Operations
Topics
Azure Monitor
Log Analytics
Defender for Cloud concepts
Key Vault
RBAC
Policy
Security Center concepts
Cost Management
Project
Azure Cloud Security & Operations Assessment
PHASE 4 — GOOGLE CLOUD
Week 12 — Google Cloud Fundamentals
Topics
Google Cloud projects
Organizations
Folders
Regions
Zones
IAM
Compute Engine
Cloud Storage
VPC
Cloud Monitoring
Practical
Deploy a Linux application to Compute Engine.
Week 13 — Google Cloud Networking
Topics
VPC
Subnets
Routes
Firewall rules
Load balancing
Cloud NAT
DNS
VPN
Private connectivity
Project
Design a Highly Available Google Cloud Network
Week 14 — Google Cloud IAM, Storage & Compute
Topics
IAM roles
Service accounts
Compute Engine
Cloud Storage
Persistent Disk
Cloud SQL
Secrets
Logging
Google Cloud uses IAM roles to control access to resources, including permissions assigned to service accounts used by workloads.
G
Google Cloud Documentation
+1
Practical
Build a production-style application environment.
Week 15 — Google Cloud Operations
Topics
Cloud Logging
Cloud Monitoring
Alerts
Dashboards
Uptime checks
Error investigation
Cost controls
Project
GCP Monitoring & Operations Project
PHASE 5 — CONTAINERS
Week 16 — Docker & Containerization
Topics
Containers vs VMs
Docker architecture
Images
Containers
Dockerfiles
Volumes
Networks
Registries
Environment variables
Container security
Hands-on
Students containerize:
Frontend
Backend
Database
Project
Containerize a Full-Stack Application
PHASE 6 — KUBERNETES
This should be a major component of the program.
Week 17 — Kubernetes Fundamentals
Topics
Kubernetes architecture
Control plane
Nodes
Pods
Deployments
Services
Namespaces
ConfigMaps
Secrets
Labels
Selectors
Lab
Deploy an application to a local Kubernetes cluster.
Week 18 — Kubernetes Administration
Topics
Scheduling
ReplicaSets
Deployments
Rolling updates
Rollbacks
Health checks
Persistent volumes
Ingress
Resource limits
Autoscaling
Challenge
"Your application has crashed and users are reporting downtime. Diagnose and restore the Kubernetes deployment."
Week 19 — Managed Kubernetes: EKS, AKS & GKE
This is where your program explicitly brings the three cloud providers together.
AWS
Amazon EKS
Azure
Azure Kubernetes Service (AKS)
Google Cloud
Google Kubernetes Engine (GKE)
These are the respective managed Kubernetes platforms.
G
Google Cloud Documentation
+1

Students deploy the same application to all three.

Capstone Lab
GitHub
│
Docker Image
│
┌────────────┼────────────┐
▼ ▼ ▼
EKS AKS GKE
AWS Azure Google

Deliverable
Multi-Cloud Kubernetes Deployment
PHASE 7 — INFRASTRUCTURE AS CODE
Week 20 — Terraform
This should be one of the most important employability modules.
Topics
Infrastructure as Code
Terraform
Providers
Resources
Variables
Outputs
Modules
State
Remote state
Workspaces
Terraform plan/apply
Infrastructure lifecycle
Practical
Students use Terraform to provision:
AWS + Azure + Google Cloud infrastructure

The goal is to stop manually clicking through cloud consoles.

Week 21 — Advanced IaC & Configuration Management
Topics
Terraform modules
Reusable infrastructure
Environment separation
Dev/Staging/Production
Secrets
Configuration management
Ansible fundamentals
Azure
Azure Kubernetes Service (AKS)
Google Cloud
Google Kubernetes Engine (GKE)
These are the respective managed Kubernetes platforms.

Students deploy the same application to all three.

                 GitHub
                    │
              Docker Image
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
      EKS          AKS          GKE
      AWS         Azure        Google

PHASE 7 — INFRASTRUCTURE AS CODE
Week 20 — Terraform
This should be one of the most important employability modules.
Topics
Project
Build a Reusable Cloud Infrastructure Module
PHASE 8 — CI/CD & DEVOPS
Week 22 — Git, CI/CD & DevSecOps
Topics
Git
GitHub
Branching
Pull requests
Code review
CI
CD
Build
Test
Package
Deploy
Artifact repositories
Secrets
Pipeline security
Tools
Students work with:
GitHub Actions
Jenkins concepts
Cloud-native CI/CD tools
Google Cloud's Cloud Build/Cloud Deploy, AWS's CI/CD services and Azure DevOps/GitHub form comparable parts of the three ecosystems.
G
Google Cloud Documentation
Project
Automated Application Deployment Pipeline
PHASE 9 — OBSERVABILITY & SRE
Week 23 — Monitoring, Logging & Reliability
Topics
Monitoring
Logging
Metrics
Traces
Alerts
Dashboards
SLIs
SLOs
SLAs
Error budgets
Incident management
Root-cause analysis
High availability
Disaster recovery
Practical
Students intentionally break their application.
Then they must determine:

What broke? Why did it break? How did we detect it? How do we prevent it happening again?
PHASE 10 — PLATFORM ENGINEERING CAPSTONE
Week 24 — Build a Real Internal Developer Platform
This should be the graduation project, rather than a conventional written examination.
Scenario
Your students are hired as the Platform Engineering team for:
"NaijaShop"
A growing African e-commerce company.
The developers have complained:

"Deploying applications takes too long."
"Every team configures infrastructure differently."
"We don't know what is running in production."
"We have no standardized deployment process."
"Infrastructure changes are difficult to track."
The students must build a platform to solve those problems.
CAPSTONE REQUIREMENTS

1. Source Control
   GitHub repository containing:
   Application
   Infrastructure
   Kubernetes manifests
   Documentation
2. Infrastructure as Code
   Terraform provisions:
   Network
   Compute
   IAM
   Storage
   Kubernetes
   Monitoring
3. Container Platform
   Students containerize the application.
4. Kubernetes
   Application deployed to:
   AWS EKS
   Azure AKS
   Google GKE
   The same architecture should be used where practical, while allowing students to document provider-specific differences.
5. CI/CD
   Developer pushes code:
   Git Push
   ↓
   CI Pipeline
   ↓
   Test
   ↓
   Build
   ↓
   Security Scan
   ↓
   Container Image
   ↓
   Deployment
   ↓
   Kubernetes

6. Observability
   Students implement:
   Logs
   Metrics
   Dashboards
   Alerts
   Health checks
7. Security
   Students implement:
   Least privilege
   Secrets management
   Network segmentation
   TLS
   Image scanning
   Access control
   Audit logging
8. Reliability
   Students demonstrate:
   Rolling deployments
   Rollbacks
   Autoscaling
   Health checks
   Backup/recovery
   Failure testing

### 3-Cloud Architecture Challenge

The final assessment should ask students:

"If your company suddenly decides it wants to move from AWS to Azure or Google Cloud, how much of your platform can you reuse?"

This forces students to understand abstraction and portability, rather than memorizing AWS/Azure/GCP buttons.

### Student Portfolio

Every graduate should leave with:

- Linux administration project
- Cloud architecture diagram
- AWS deployment
- AWS networking project
- AWS security project
- Azure deployment
- Azure networking project
- Azure security project
- Google Cloud deployment
- Google Cloud networking project
- Google Cloud operations project
- Dockerized application
- Kubernetes project
- EKS deployment
- AKS deployment
- GKE deployment
- Terraform infrastructure project
- CI/CD pipeline
- Monitoring/observability project
- Final multi-cloud platform project

That's an extremely strong portfolio for a junior platform/cloud candidate.

### Practical Class Structure

I'd use the same philosophy as your Cybersecurity program.

#### Session 1 — Learn

Instructor:

Explain → Demonstrate → Discuss

Approximately 30% theory / 70% demonstration.

#### Session 2 — Build

Students reproduce the environment themselves.

#### Session 3 — Break & Fix

Give students a broken environment.

For example:

"The production API is returning 502 errors. You are the platform engineer. Find the problem and restore service."

This is extremely important.

Platform engineers get paid to solve infrastructure problems, not simply to create infrastructure.

### Cloud Rotation Model

One thing I strongly recommend is not teaching AWS for 8 weeks, then Azure for 8 weeks, then GCP for 8 weeks.

Students will forget the earlier platforms.

Instead, use comparison labs.

For example:

Lab: Deploy a Linux VM
AWS → EC2
Azure → Virtual Machines

GCP → Compute Engine

Then ask:

What's the same?
What's different?
How is networking implemented?
How is identity handled?
How is billing calculated?
How would Terraform abstract this?
This develops genuine cloud-engineering understanding.

### Assessment Model

| Component | Weight |
| --- | --- |
| Cloud Fundamentals | 10% |
| Hands-on Labs | 30% |
| Cloud Projects | 20% |
| Infrastructure as Code | 10% |
| CI/CD & Automation | 10% |
| Documentation | 5% |
| Capstone | 15% |
| Total | 100% |

Again, I would make practical demonstration mandatory.
A student shouldn't pass because they know:

"What is an AWS VPC?"
They should be able to:
Build a network, configure subnets and routes, secure it, deploy an application, monitor it and troubleshoot it.
MENTORSHIP MODEL
I'd structure mentors around real engineering roles.
Mentor 1 — Cloud Engineer
Focus:
AWS
Azure
GCP
Networking
IAM
Architecture
Mentor 2 — DevOps/Platform Engineer
Focus:
Git
CI/CD
Docker
Kubernetes
Terraform
Automation
Mentor 3 — SRE/Production Mentor
Focus:
Reliability
Monitoring
Troubleshooting
Incident response
Performance
Cost optimization
You don't necessarily need three full-time people. One experienced instructor can cover multiple roles, supplemented by guest industry mentors.
CAREER TRACKS
After the core curriculum, students can specialize.
Track A — Cloud Engineer
Focus on:
AWS
Azure
GCP
Networking
IAM
Compute
Storage
Databases
Cloud architecture
Possible roles:
Junior Cloud Engineer
Cloud Support Engineer
Cloud Operations Engineer
Track B — DevOps Engineer
Focus on:
Git
Linux
Docker
CI/CD
Terraform
Kubernetes
Automation
Possible roles:
Junior DevOps Engineer
DevOps Associate
Build/Release Engineer
Track C — Platform Engineer
Focus on:
Kubernetes
Terraform
Internal developer platforms
Golden paths
Automation
Developer experience
Observability
Reliability
Possible roles:
Junior Platform Engineer
Cloud Platform Engineer
Infrastructure Engineer
Track D — SRE
Focus on:
Reliability
Monitoring
Incident response
SLOs
Performance
Automation
Capacity planning
Possible roles:
Junior SRE
Reliability Engineer
Production Engineer
RECOMMENDED TECHNOLOGY STACK
I would standardize your lab around a relatively small core stack:
Foundation
Linux
Bash
Git
GitHub
Python basics
Cloud
AWS
Microsoft Azure
Google Cloud
Containers
Docker
Kubernetes
Infrastructure
Terraform
Ansible
CI/CD
GitHub Actions
Jenkins concepts
Cloud-native CI/CD
Kubernetes
Kubernetes
Helm
EKS
AKS
GKE
Observability
Prometheus
Grafana
Cloud-native monitoring tools
Security
IAM
Secrets management
TLS
Container/image scanning
Basic DevSecOps
CLOUD LAB DESIGN
I would create a Cloud & Platform Engineering Lab in your center.
Students should have access to:

                 GITHUB
                    │
                    ▼
              ┌───────────┐
              │ CI / CD   │
              └─────┬─────┘
                    │
             ┌──────▼──────┐
             │   DOCKER    │
             └──────┬──────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      AWS         AZURE        GCP
       │            │           │
      EKS          AKS         GKE
       │            │           │
       └────────────┼───────────┘
                    │
               OBSERVABILITY
                    │
             ┌──────▼──────┐
             │  MONITORING │
             │  LOGGING    │
             │  ALERTING   │
             └─────────────┘

This gives students a real platform-engineering workflow, rather than isolated cloud tutorials.
CERTIFICATION ALIGNMENT
The curriculum can be mapped to certification pathways without becoming a certification-cramming program.
AWS pathway
AWS foundational knowledge
AWS Associate-level cloud concepts
AWS SysOps/operations concepts
AWS architecture concepts
Azure pathway
Azure fundamentals
Azure administrator concepts
Azure architecture/engineering concepts
Google Cloud pathway
Google Cloud foundational knowledge
Associate Cloud Engineer concepts
Professional-level cloud engineering concepts
Platform pathway
Kubernetes fundamentals
Terraform
Docker
CI/CD
SRE/DevOps practices
The student's portfolio and demonstrated competency should remain more important than merely passing a certification exam.
THE GRADUATION STANDARD
I would make the graduation requirement very simple:
Give the student a blank cloud account, a Git repository and an application.

Then say:

"You are the platform engineering team. Take this application to production."
They should be able to:

1. Design the architecture

↓

2. Build the infrastructure

↓

3. Secure it

↓

4. Containerize the application

↓

5. Deploy it to Kubernetes

↓

6. Automate the deployment

↓

7. Monitor it

↓

8. Break it

↓

9. Troubleshoot it

↓

10. Recover it

↓

11. Document it

↓

12. Present it to management

If your students can do that independently, you have produced a Platform/Cloud Professional, rather than someone who has simply completed a cloud course.

Recommended flagship positioning
Professional Platform Engineering & Multi-Cloud Accelerator
Master AWS, Microsoft Azure and Google Cloud. Build with Docker and Kubernetes. Automate with Terraform and CI/CD. Deploy, monitor, secure and troubleshoot production-grade platforms through hands-on projects and mentorship.
That positioning also gives your training center a much clearer distinction between Cybersecurity, Cloud Engineering, DevOps, and Platform Engineering, while still allowing students to move between those career paths.
