export const labFixtures: Record<string, unknown> = {
  logs: [
    "Sep 18 09:12:01 northwind sshd: Failed password for alex from 192.0.2.44",
    "Sep 18 09:12:06 northwind sshd: Failed password for alex from 192.0.2.44",
    "Sep 18 09:13:20 northwind sshd: Accepted password for alex from 192.0.2.44",
    "Sep 18 09:17:08 northwind sudo: alex : COMMAND=/usr/bin/cat /etc/shadow",
  ],
  packets: [
    {
      ts: "09:13:22",
      src: "192.0.2.44",
      dst: "198.51.100.20",
      proto: "TLS",
      info: "Repeated beacon",
    },
    {
      ts: "09:14:02",
      src: "198.51.100.20",
      dst: "203.0.113.8",
      proto: "DNS",
      info: "Unusual subdomain",
    },
    {
      ts: "09:15:11",
      src: "192.0.2.44",
      dst: "203.0.113.9",
      proto: "TCP",
      info: "Connection to uncommon port",
    },
  ],
  phishing:
    "From: IT Support <helpdesk@example.org>\nReturn-Path: alerts@example.com\nAuthentication-Results: spf=fail; dkim=fail; dmarc=fail\nReceived: from 192.0.2.88\nSubject: Urgent password validation\nVisit hxxps://login[.]example.org",
  controls: ["Security policy", "Badge reader", "EDR alert", "Security guard"],
  iam: [
    {
      user: "alex",
      role: "admin",
      lastLogin: "2024-01-02",
      issue: "stale admin",
    },
    {
      user: "former.contractor",
      role: "billing",
      lastLogin: "2023-04-11",
      issue: "orphaned account",
    },
  ],
}
