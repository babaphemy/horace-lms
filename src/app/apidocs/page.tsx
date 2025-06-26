"use client"
import React, { useState, useEffect } from "react"
import {
  Book,
  Shield,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Star,
  Users,
  Download,
  Globe,
  Key,
  Settings,
  PlayCircle,
  AlertCircle,
  Upload,
  Edit3,
  UserPlus,
  Trash2,
  RotateCcw,
  Image as ImageIcon,
  Plus,
  GraduationCap,
  Activity,
} from "lucide-react"
import { tableOfContents } from "@/components/lms/apidoc/content"
import CodeBlock from "@/components/lms/apidoc/Codebloc"
import Badge from "@/components/lms/apidoc/Badge"
import Alert from "@/components/lms/apidoc/Alert"
import Table from "@/components/lms/apidoc/Table"
import ApiEndpoint from "@/components/lms/apidoc/ApiEndpoint"
import Header from "@/components/lms/apidoc/Header"

export default function BeautifulAPIDocsPage() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [copiedCode, setCopiedCode] = useState("")
  const [activeSection, setActiveSection] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean
  }>({
    "user-management": true,
    "course-management": true,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Check if we're on client side and handle mobile detection
  useEffect(() => {
    setIsClient(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(""), 2000)
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const scrollToSection = (sectionId: string) => {
    if (typeof window === "undefined") return

    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      setActiveSection(sectionId)
      if (isMobile) {
        setSidebarOpen(false)
      }
    }
  }

  useEffect(() => {
    if (!isClient) return

    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -50% 0px",
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [isClient])

  useEffect(() => {
    if (!isClient) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === "k") {
          event.preventDefault()
          ;(
            document.querySelector(".search-input") as HTMLInputElement | null
          )?.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isClient])

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div style={{ color: "white", fontSize: "18px" }}>Loading...</div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div
        style={{
          display: "flex",
          maxWidth: "1400px",
          margin: "0 auto",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <aside
          style={{
            width: "320px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "24px",
            overflowY: "auto",
            position: "sticky",
            top: "80px",
            height: "calc(100vh - 80px)",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.05)",
            display: isMobile && !sidebarOpen ? "none" : "block",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Book size={18} />
            Documentation
          </div>

          <nav>
            {tableOfContents.map((item) => (
              <div key={item.id} style={{ marginBottom: "4px" }}>
                <a
                  href={`#${item.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: activeSection === item.id ? "white" : "#64748b",
                    fontSize: "14px",
                    fontWeight: "500",
                    gap: "12px",
                    cursor: "pointer",
                    background:
                      activeSection === item.id
                        ? "linear-gradient(135deg, #667eea, #764ba2)"
                        : "transparent",
                    transform:
                      activeSection === item.id ? "translateX(4px)" : "none",
                    transition: "all 0.2s ease",
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(item.id)
                    if (item.children) {
                      toggleSection(item.id)
                    }
                  }}
                >
                  <item.icon size={16} />
                  {item.label}
                  {item.children && (
                    <ChevronRight
                      size={14}
                      style={{
                        marginLeft: "auto",
                        transform: expandedSections[item.id]
                          ? "rotate(90deg)"
                          : "none",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  )}
                </a>

                {item.children && expandedSections[item.id] && (
                  <div
                    style={{
                      marginLeft: "16px",
                      marginTop: "8px",
                      borderLeft: "2px solid rgba(102, 126, 234, 0.1)",
                      paddingLeft: "16px",
                    }}
                  >
                    {item.children.map((child) => (
                      <a
                        key={child.id}
                        href={`#${child.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          fontSize: "13px",
                          color:
                            activeSection === child.id ? "#667eea" : "#64748b",
                          textDecoration: "none",
                          borderRadius: "6px",
                          marginBottom: "2px",
                          background:
                            activeSection === child.id
                              ? "rgba(102, 126, 234, 0.2)"
                              : "transparent",
                          fontWeight:
                            activeSection === child.id ? "600" : "normal",
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToSection(child.id)
                        }}
                      >
                        <child.icon size={14} />
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
        <main
          style={{
            flex: 1,
            padding: "32px",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            margin: "24px",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            minHeight: "calc(100vh - 128px)",
            overflowX: "hidden",
          }}
        >
          <section
            id="overview"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "48px 40px",
              borderRadius: "16px",
              marginBottom: "48px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "200px",
                  height: "200px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  animation: "float 6s ease-in-out infinite",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  left: "-30px",
                  width: "120px",
                  height: "120px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  animation: "float 4s ease-in-out infinite reverse",
                }}
              ></div>
            </div>

            <div style={{ position: "relative", zIndex: 2 }}>
              <h1
                style={{
                  fontSize: "40px",
                  fontWeight: "800",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  lineHeight: "1.2",
                }}
              >
                🚀 Horace LMS API Documentation
                <Star size={32} style={{ color: "#fbbf24" }} />
              </h1>
              <p
                style={{
                  fontSize: "18px",
                  opacity: 0.9,
                  marginBottom: "32px",
                  lineHeight: "1.6",
                  maxWidth: "800px",
                }}
              >
                Welcome to the comprehensive API documentation for Horace
                Learning Management System. This guide provides detailed
                information about all available endpoints, request/response
                formats, and authentication requirements.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "32px",
                  marginBottom: "32px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "15px",
                    fontWeight: "500",
                    opacity: 0.9,
                  }}
                >
                  <Globe size={20} />
                  <span>REST API</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "15px",
                    fontWeight: "500",
                    opacity: 0.9,
                  }}
                >
                  <Shield size={20} />
                  <span>Bearer Auth</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "15px",
                    fontWeight: "500",
                    opacity: 0.9,
                  }}
                >
                  <Users size={20} />
                  <span>User Management</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "15px",
                    fontWeight: "500",
                    opacity: 0.9,
                  }}
                >
                  <GraduationCap size={20} />
                  <span>Course Management</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 24px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                  }}
                  onClick={() =>
                    copyToClipboard(
                      "https://lms.horacelearning.com/api/v1",
                      "base-url"
                    )
                  }
                >
                  {copiedCode === "base-url" ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                  Copy Base URL
                </button>

                <a
                  href="https://lms.horacelearning.com/sign-up/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 24px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                  }}
                >
                  <Key size={16} />
                  Get API Key
                </a>

                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 24px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                  }}
                >
                  <Download size={16} />
                  Postman Collection
                </button>
              </div>
            </div>
          </section>

          {/* Authentication Section */}
          <section id="authentication" style={{ marginBottom: "64px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingBottom: "12px",
                borderBottom: "3px solid #e2e8f0",
              }}
            >
              <Shield size={24} />
              Authentication
            </h2>

            <p
              style={{
                fontSize: "16px",
                color: "#64748b",
                marginBottom: "24px",
                lineHeight: "1.6",
              }}
            >
              All API requests require proper authentication. Include your API
              key in the request headers:
            </p>

            <Alert type="info">
              <strong>Get Started:</strong> Create an account at{" "}
              <a
                href="https://lms.horacelearning.com/sign-up/"
                target="_blank"
                rel="noopener noreferrer"
              >
                lms.horacelearning.com/sign-up
              </a>{" "}
              to obtain your API key.
            </Alert>

            <CodeBlock
              language="bash"
              title="Authorization Header"
              copyText="Authorization: Bearer YOUR_API_KEY"
              copiedCode={copiedCode}
              copyToClipboard={copyToClipboard}
            >
              Authorization: Bearer YOUR_API_KEY
            </CodeBlock>
          </section>

          <section id="user-management" style={{ marginBottom: "64px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingBottom: "12px",
                borderBottom: "3px solid #e2e8f0",
              }}
            >
              <Users size={24} />
              User Management
            </h2>

            {/* User Sign-up */}
            <div id="user-signup" style={{ marginBottom: "48px" }}>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <UserPlus size={20} />
                User Sign-up
              </h3>

              <p>Register a new user for your organization.</p>

              <Alert type="warning">
                <strong>Important:</strong> Email must be unique for each user.
                Use the <code>type</code> field to assign roles.
              </Alert>

              <ApiEndpoint
                method="POST"
                path="/api/v1/user/add"
                description="Register a new user for your organization"
              >
                <h4>User Roles</h4>
                <Table
                  headers={["Role", "Description", "Access Level"]}
                  data={[
                    ["USER", "Standard user", "Basic access"],
                    ["INSTRUCTOR", "Course creator", "Full course management"],
                    ["ADMIN", "Administrator", "Full system access"],
                  ]}
                />

                <h4>Request Body</h4>
                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "firstname": "string",
  "lastname": "string",
  "country": "string",
  "password": "string",
  "organizationId": "string",
  "bio": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "phone": "string",
  "email": "string",
  "type": "INSTRUCTOR|ADMIN|USER"
}`}
                </CodeBlock>

                <h4>Example Request</h4>
                <CodeBlock
                  language="bash"
                  title="cURL Example"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`curl -X 'POST' \\
  'http://localhost:5071/api/v1/user/add' \\
  -H 'accept: */*' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "firstname": "fela",
    "lastname": "kuti",
    "country": "Nigeria",
    "password": "Password1$",
    "organizationId": "684e58d4df81cc6605736c85",
    "bio": "This is the lord'\''s doing",
    "address": "12 Mill ridge drive",
    "city": "cypress",
    "state": "TX",
    "zip": "77429",
    "phone": "11111111",
    "email": "babaphemy@mail.com",
    "type": "INSTRUCTOR"
  }'`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/* Reset Password */}
            <div id="reset-password" style={{ marginBottom: "48px" }}>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <RotateCcw size={20} />
                Reset Password
              </h3>

              <p>
                Password reset is a <strong>two-step process</strong>:
              </p>

              <div style={{ margin: "24px 0" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <div style={{ flex: 1, paddingTop: "4px" }}>
                    <strong>Generate Token</strong> - Sends reset token to
                    user&apos;s email
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <div style={{ flex: 1, paddingTop: "4px" }}>
                    <strong>Reset Password</strong> - Uses token to set new
                    password
                  </div>
                </div>
              </div>

              <div style={{ margin: "32px 0" }}>
                <h4>Step 1: Generate Token</h4>
                <ApiEndpoint
                  method="POST"
                  path="/api/v1/user/dotoken"
                  description="Generate password reset token"
                >
                  <CodeBlock
                    language="json"
                    title="Request Body"
                    copiedCode={copiedCode}
                    copyToClipboard={copyToClipboard}
                  >
                    {`{
  "organizationId": "string",
  "email": "string"
}`}
                  </CodeBlock>

                  <CodeBlock
                    language="bash"
                    title="Example Request"
                    copiedCode={copiedCode}
                    copyToClipboard={copyToClipboard}
                  >
                    {`curl -X 'POST' \\
  'http://localhost:5071/api/v1/user/dotoken' \\
  -H 'accept: */*' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "organizationId": "6812345611grxa",
    "email": "lasisonboard@gmail.com"
  }'`}
                  </CodeBlock>
                </ApiEndpoint>
              </div>

              <div style={{ margin: "32px 0" }}>
                <h4>Step 2: Reset Password</h4>
                <ApiEndpoint
                  method="POST"
                  path="/api/v1/user/reset/password"
                  description="Reset password using token"
                >
                  <CodeBlock
                    language="json"
                    title="Request Body"
                    copiedCode={copiedCode}
                    copyToClipboard={copyToClipboard}
                  >
                    {`{
  "organizationId": "string",
  "email": "string",
  "password": "string",
  "token": "string"
}`}
                  </CodeBlock>

                  <div
                    style={{
                      margin: "20px 0",
                      padding: "16px",
                      background: "#f8fafc",
                      borderRadius: "8px",
                    }}
                  >
                    <h5
                      style={{
                        margin: "0 0 8px 0",
                        color: "#374151",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Response
                    </h5>
                    <p>
                      Returns status: <Badge variant="success">SUCCESS</Badge>{" "}
                      or <Badge variant="error">FAILED</Badge>
                    </p>
                  </div>
                </ApiEndpoint>
              </div>
            </div>

            {/* Edit User */}
            <div id="edit-user" style={{ marginBottom: "48px" }}>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Edit3 size={20} />
                Edit User
              </h3>

              <p>Modify basic information about a selected user.</p>

              <ApiEndpoint
                method="PUT"
                path="/api/v1/user/edit"
                description="Update user information"
              >
                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "id": "string",
  "organizationId": "string",
  "firstname": "string",
  "lastname": "string",
  "country": "string",
  "bio": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "phone": "string",
  "email": "string",
  "type": "string"
}`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/* Coming Soon Items */}
            <div
              style={{
                margin: "40px 0",
                padding: "24px",
                background:
                  "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                borderRadius: "12px",
                border: "1px solid rgba(102, 126, 234, 0.2)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 16px 0",
                  color: "#667eea",
                  fontSize: "18px",
                }}
              >
                🚧 Coming Soon
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "8px",
                    color: "#667eea",
                    fontWeight: "500",
                  }}
                >
                  <ImageIcon size={20} />
                  <span>Upload Photo (DP)</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "8px",
                    color: "#667eea",
                    fontWeight: "500",
                  }}
                >
                  <Trash2 size={20} />
                  <span>Delete User</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "8px",
                    color: "#667eea",
                    fontWeight: "500",
                  }}
                >
                  <Settings size={20} />
                  <span>Change Role</span>
                </div>
              </div>
            </div>
          </section>

          {/* Course Management Section */}
          <section id="course-management" style={{ marginBottom: "64px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingBottom: "12px",
                borderBottom: "3px solid #e2e8f0",
              }}
            >
              <GraduationCap size={24} />
              Course Management
            </h2>

            <Alert type="warning">
              <strong>Permission Required:</strong> All course management
              endpoints require <Badge variant="warning">INSTRUCTOR</Badge> role
              or higher.
            </Alert>

            {/* Create Course */}
            <div id="create-course" style={{ marginBottom: "48px" }}>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Plus size={20} />
                Create Course
              </h3>

              <p>Creates a new course in the system.</p>

              <ApiEndpoint
                method="POST"
                path="/api/v1/course/add"
                description="Create a new course"
              >
                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "user": "string",
  "courseName": "string",
  "brief": "string",
  "overview": "string",
  "thumbnail": "string",
  "category": "string",
  "currency": "string",
  "draft": boolean,
  "cost": number
}`}
                </CodeBlock>

                <div
                  style={{
                    margin: "20px 0",
                    padding: "16px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <h5
                    style={{
                      margin: "0 0 12px 0",
                      color: "#374151",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Parameters
                  </h5>
                  <ul style={{ margin: "0", paddingLeft: "20px" }}>
                    <li style={{ marginBottom: "8px", color: "#4b5563" }}>
                      <code>user</code> - ID of the course author{" "}
                      <Badge variant="error">required</Badge>
                    </li>
                    <li style={{ marginBottom: "8px", color: "#4b5563" }}>
                      <code>draft</code> - Set to <code>true</code> to save as
                      draft, <code>false</code> to publish
                    </li>
                  </ul>
                </div>

                <CodeBlock
                  language="bash"
                  title="Example Request"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`curl -X 'POST' \\
  '{basepath}/api/v1/course/add' \\
  -H 'accept: */*' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "user": "684e665d59f9a83e5140d977",
    "courseName": "Game Theory",
    "brief": "This is a great course on how to improve your game.",
    "overview": "<p>This course provides a decent introduction to game development.</p>",
    "thumbnail": "",
    "category": "web",
    "currency": "NGN",
    "draft": true,
    "cost": 40000
  }'`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/* Upload Assets */}
            <div id="upload-assets" style={{ marginBottom: "48px" }}>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Upload size={20} />
                Upload Assets
              </h3>

              <p>
                Universal upload endpoint for all file types including videos,
                images, and documents.
              </p>

              <Alert type="info">
                <strong>Video Processing:</strong> Videos are automatically
                encoded, optimized, compressed, and cached on CDN.
              </Alert>

              <div style={{ display: "grid", gap: "32px" }}>
                <div>
                  <h4
                    style={{
                      margin: "0 0 16px 0",
                      color: "#374151",
                      fontSize: "18px",
                    }}
                  >
                    File/Photo Upload
                  </h4>
                  <ApiEndpoint
                    method="PUT"
                    path="https://horacelms.com/info/s3/upload"
                    description="Upload files and photos"
                  >
                    <CodeBlock
                      language="bash"
                      title="Example Request"
                      copiedCode={copiedCode}
                      copyToClipboard={copyToClipboard}
                    >
                      {`curl -X 'PUT' \\
  'https://horacelms.com/info/s3/upload' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'image=@2.1.svg;type=image/svg+xml'`}
                    </CodeBlock>
                  </ApiEndpoint>
                </div>

                <div>
                  <h4
                    style={{
                      margin: "0 0 16px 0",
                      color: "#374151",
                      fontSize: "18px",
                    }}
                  >
                    Video Upload
                  </h4>
                  <ApiEndpoint
                    method="POST"
                    path="https://horacelms.com/info/s3/video"
                    description="Upload video files"
                  >
                    <CodeBlock
                      language="bash"
                      title="Example Request"
                      copiedCode={copiedCode}
                      copyToClipboard={copyToClipboard}
                    >
                      {`curl -X 'POST' \\
  'https://horacelms.com/info/s3/video' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'video=@horace-enc.mp4;type=video/mp4'`}
                    </CodeBlock>
                  </ApiEndpoint>
                </div>
              </div>
            </div>

            {/* Add Lesson */}
            <div id="add-lesson" style={{ marginBottom: "48px" }}>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <PlayCircle size={20} />
                Add Lesson to Module
              </h3>

              <p>
                Add lessons to course modules. Supports multiple content types.
              </p>

              <ApiEndpoint
                method="POST"
                path="/api/v1/course/module/lesson"
                description="Add a lesson to a module"
              >
                <h4>Lesson Types</h4>
                <Table
                  headers={["Type", "Description"]}
                  data={[
                    ["video", "Video content"],
                    ["document", "Document files"],
                    ["html", "HTML content"],
                    ["pdf", "PDF documents"],
                    ["quiz", "Interactive quizzes"],
                    ["text", "Text-based lessons"],
                  ]}
                />

                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "title": "string",
  "content": "string",
  "type": "video|document|html|pdf|quiz|text",
  "video": "string",
  "orderIndex": number,
  "tid": "string"
}`}
                </CodeBlock>

                <div
                  style={{
                    margin: "20px 0",
                    padding: "16px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <h5
                    style={{
                      margin: "0 0 12px 0",
                      color: "#374151",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Parameters
                  </h5>
                  <ul style={{ margin: "0", paddingLeft: "20px" }}>
                    <li style={{ marginBottom: "8px", color: "#4b5563" }}>
                      <code>video</code> - Only used when <code>type</code> is
                      &quot;video&quot;. Path to uploaded video file
                    </li>
                    <li style={{ marginBottom: "8px", color: "#4b5563" }}>
                      <code>tid</code> - Module ID where the lesson will be
                      attached
                    </li>
                    <li style={{ marginBottom: "8px", color: "#4b5563" }}>
                      <code>orderIndex</code> - Controls lesson order within the
                      module
                    </li>
                  </ul>
                </div>
              </ApiEndpoint>
            </div>
          </section>

          {/* Error Codes Section */}
          <section id="error-codes" style={{ marginBottom: "64px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingBottom: "12px",
                borderBottom: "3px solid #e2e8f0",
              }}
            >
              <AlertCircle size={24} />
              Error Codes
            </h2>

            <Table
              headers={["Code", "Description", "Solution"]}
              data={[
                [
                  "400",
                  "Bad Request",
                  "Check request format and required fields",
                ],
                ["401", "Unauthorized", "Verify authentication credentials"],
                ["403", "Forbidden", "Check user permissions and role"],
                ["404", "Not Found", "Verify resource exists"],
                [
                  "429",
                  "Too Many Requests",
                  "Implement rate limiting in your application",
                ],
                [
                  "500",
                  "Internal Server Error",
                  "Contact support if issue persists",
                ],
              ]}
            />
          </section>

          {/* Rate Limiting Section */}
          <section id="rate-limiting" style={{ marginBottom: "64px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingBottom: "12px",
                borderBottom: "3px solid #e2e8f0",
              }}
            >
              <Activity size={24} />
              Rate Limiting
            </h2>

            <p>API requests are limited to prevent abuse:</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                margin: "24px 0",
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#374151",
                    fontSize: "18px",
                  }}
                >
                  Standard Users
                </h4>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#667eea",
                  }}
                >
                  100 requests/minute
                </div>
              </div>
              <div
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#374151",
                    fontSize: "18px",
                  }}
                >
                  Premium Users
                </h4>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#667eea",
                  }}
                >
                  1000 requests/minute
                </div>
              </div>
              <div
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#374151",
                    fontSize: "18px",
                  }}
                >
                  Enterprise
                </h4>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#667eea",
                  }}
                >
                  Custom limits available
                </div>
              </div>
            </div>

            <h4>Response Headers</h4>
            <ul>
              <li>
                <code>X-RateLimit-Limit</code> - Request limit per minute
              </li>
              <li>
                <code>X-RateLimit-Remaining</code> - Remaining requests
              </li>
              <li>
                <code>X-RateLimit-Reset</code> - Time when limit resets
              </li>
            </ul>
          </section>

          {/* Support Section */}
          <section
            style={{
              marginTop: "64px",
              padding: "32px",
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))",
              borderRadius: "16px",
              border: "1px solid rgba(102, 126, 234, 0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              📞 Support
            </h2>

            <p>Need help? Reach out to our support team:</p>

            <div
              style={{
                display: "flex",
                gap: "20px",
                margin: "24px 0",
                flexWrap: "wrap",
              }}
            >
              <a
                href="mailto:office@horacelearning.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  background: "white",
                  color: "#667eea",
                  textDecoration: "none",
                  borderRadius: "8px",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  fontWeight: "500",
                }}
              >
                <ExternalLink size={16} />
                office@horacelearning.com
              </a>
              <a
                href="https://docs.horacelms.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  background: "white",
                  color: "#667eea",
                  textDecoration: "none",
                  borderRadius: "8px",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  fontWeight: "500",
                }}
              >
                <Book size={16} />
                Documentation
              </a>
              <a
                href="https://horacelearning.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  background: "white",
                  color: "#667eea",
                  textDecoration: "none",
                  borderRadius: "8px",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  fontWeight: "500",
                }}
              >
                <Globe size={16} />
                Home Page
              </a>
            </div>

            <div
              style={{
                marginTop: "24px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              <em>Last updated: June 2025</em>
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .table-row:hover {
          background: #f9fafb;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @media (max-width: 768px) {
          .search-input {
            width: 200px !important;
          }

          .hero-title {
            font-size: 28px !important;
          }

          .hero-subtitle {
            font-size: 16px !important;
          }

          .content-area {
            margin: 12px !important;
            padding: 20px !important;
          }

          .hero-section {
            padding: 32px 24px !important;
          }

          .section-title {
            font-size: 24px !important;
          }

          .subsection-title {
            font-size: 20px !important;
          }
        }

        @media (max-width: 480px) {
          .search-input {
            width: 150px !important;
          }

          .hero-stats {
            flex-direction: column !important;
            gap: 16px !important;
          }

          .hero-actions {
            flex-direction: column !important;
            width: 100% !important;
          }

          .action-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  )
}
