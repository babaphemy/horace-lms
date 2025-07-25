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
  BookOpen,
  Search,
  FileText,
  Building,
  UserMinus,
  GitCompareArrows,
  Settings2Icon,
  Receipt,
  Settings2,
  View,
  DownloadIcon,
} from "lucide-react"
import { tableOfContents } from "@/components/lms/apidoc/content"
import CodeBlock from "@/components/lms/apidoc/Codebloc"
import Badge from "@/components/lms/apidoc/Badge"
import Alert from "@/components/lms/apidoc/Alert"
import Table from "@/components/lms/apidoc/Table"
import ApiEndpoint from "@/components/lms/apidoc/ApiEndpoint"
import Header from "@/components/lms/apidoc/Header"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function BeautifulApiDocs() {
  const { status } = useSession()
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

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?redirect=/apidocs")
    }
  }, [status])

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
            document.querySelector(".search-input") as HTMLInputElement
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
                      "https://robiatschools.com/api/v1/",
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

            {/** upload user photo */}
            <div id="upload-photo" style={{ marginBottom: "48px" }}>
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
                <ImageIcon size={20} />
                Upload Photo for a user
              </h3>

              <p>Upload photo.</p>

              <ApiEndpoint
                method="PUT"
                path="/api/v1/user/upload-photo"
                description="Update photo for a user"
              >
                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "userId": "string",
  "filePath": "string"
}`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/* delete user */}
            <div id="delete-user" style={{ marginBottom: "48px" }}>
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
                <Trash2 size={20} />
                Delete User
              </h3>

              <p>Delete user data.</p>

              <ApiEndpoint
                method="DELETE"
                path="/api/v1/user/deluser/{usr}"
                description="Delete user data by ID"
                parameters={[
                  {
                    name: "usr",
                    type: "string",
                    required: true,
                    description: "ID of the user to delete",
                  },
                ]}
              >
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
                    Returns status: <Badge variant="success">TRUE</Badge> or{" "}
                    <Badge variant="error">FALSE</Badge>
                  </p>
                </div>
              </ApiEndpoint>
            </div>

            {/*  Change Role */}
            <div id="change-role" style={{ marginBottom: "48px" }}>
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
                <Settings size={20} />
                Change Role
              </h3>

              <p>Update the role of user.</p>

              <ApiEndpoint
                method="PUT"
                path="/api/v1/user/change-role"
                description="Update the role of user"
              >
                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
                    "id": "string",
                    "firstname": "string",
                    "lastname": "string",
                    "country": "string",
                    "password": "string",
                    "bio": "string",
                    "organizationId": "string",
                    "address": "string",
                    "city": "string",
                    "state": "string",
                    "zip": "string",
                    "phone": "string",
                    "email": "string",
                    "type": "string",
                    "updatedOn": "2025-06-24T21:01:16.749Z",
                    "modifiedOn": "2025-06-24T21:01:16.749Z",
                    "createdOn": "2025-06-24T21:01:16.749Z",
                    "token": "string",
                    "dp": "string",
                    "status": true,
                    "roles": [
                      "string"
                    ],
                    "message": "string",
                    "courses": [
                      "string"
                    ],
                    "rating": 1073741824,
                    "reviews": [
                      "string"
                    ]
                  }`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/* Coming Soon Items  --> Did not completely remove this part of the code for easy 
            resuability when there is another coming soon feature*/}
            {/* <div
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
                    width: "fit-content",
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
            </div> */}
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

            <div id="edit-course" style={{ marginBottom: "48px" }}>
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
                Edit Course
              </h3>

              <p>Edit a course in the system.</p>

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
  "id": "string",
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
                      <code>id</code> - ID of the course to be edited{" "}
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

            {/* Add Module */}
            <div id="add-module" style={{ marginBottom: "48px" }}>
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
                <BookOpen size={20} />
                Add Module
              </h3>

              <p>Add module to a course.</p>

              <ApiEndpoint
                method="POST"
                path="/api/v1/course/module"
                description="Add a module to a course"
              >
                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "module": "string",
  "description": "string",
  "orderIndex": 1073741824,
  "lessons": [
    {
      "id": "string",
      "title": "string",
      "video": "string",
      "content": "string",
      "type": "string",
      "orderIndex": 1073741824
    }
  ],
  "cid": "string",
  "createdOn": "2025-06-20T23:22:14.464Z",
  "updatedOn": "2025-06-20T23:22:14.464Z"
}
`}
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
                      <code>cid</code> - ID of the course
                      <Badge variant="error">required</Badge>
                    </li>
                  </ul>
                </div>
              </ApiEndpoint>
            </div>

            {/* Edit Module */}
            <div id="edit-module" style={{ marginBottom: "48px" }}>
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
                Add Module
              </h3>

              <p>Edit the module of a course.</p>

              <ApiEndpoint
                method="POST"
                path="/api/v1/course/module"
                description="Add a module to a course"
              >
                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
                "id": "string",
                "module": "string",
                "description": "string",
                "orderIndex": 1073741824,
                "lessons": [
                  {
                    "id": "string",
                    "title": "string",
                    "video": "string",
                    "content": "string",
                    "type": "string",
                    "orderIndex": 1073741824
                  }
                ],
                "cid": "string",
                "createdOn": "2025-06-20T23:22:14.464Z",
                "updatedOn": "2025-06-20T23:22:14.464Z"
                }
                `}
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
                      <code>id</code> - ID of the module
                      <Badge variant="error">required</Badge>
                    </li>
                    <li style={{ marginBottom: "8px", color: "#4b5563" }}>
                      <code>cid</code> - ID of the course
                      <Badge variant="error">required</Badge>
                    </li>
                  </ul>
                </div>
              </ApiEndpoint>
            </div>

            {/*organization courses */}
            <div id="org-courses" style={{ marginBottom: "48px" }}>
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
                <Building size={20} />
                Organization Courses
              </h3>

              <p>Get the courses for an organization</p>

              <ApiEndpoint
                method="GET"
                path="/api/v1/course/org-courses"
                description="Get organization courses"
                parameters={[
                  {
                    name: "page",
                    type: "integer",

                    description: "(query) Page number for pagination",
                  },
                  {
                    name: "size",
                    type: "integer",

                    description: "(query) Number of courses per page",
                  },
                  {
                    name: "orgId",
                    type: "string",
                    required: true,
                    description: "(query) ID of the organization",
                  },
                ]}
              >
                <CodeBlock
                  language="json"
                  title="Sample Response"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "totalElements": 9007199254740991,
  "totalPages": 1073741824,
  "first": true,
  "last": true,
  "size": 1073741824,
  "content": [
    {
      "author": "string",
      "authorRole": "string",
      "authorCompany": "string",
      "id": "string",
      "courseName": "string",
      "brief": "string",
      "overview": "string",
      "createdOn": "2025-06-21T00:00:00.682Z",
      "updatedOn": "2025-06-21",
      "thumbnail": "string",
      "category": "string",
      "currency": "string",
      "totalSteps": 1073741824,
      "activeStep": 1073741824,
      "students": 1073741824,
      "curriculum": {
        "topic": [
          {
            "id": "string",
            "courseId": "string",
            "title": "string",
            "description": "string",
            "orderIndex": 1073741824,
            "createdOn": "2025-06-21T00:00:00.682Z",
            "updatedOn": "2025-06-21T00:00:00.682Z",
            "lessons": [
              {
                "id": "string",
                "topicId": "string",
                "title": "string",
                "type": "string",
                "video": "string",
                "content": "string",
                "orderIndex": 1073741824,
                "createdOn": "2025-06-21T00:00:00.682Z",
                "updatedOn": "2025-06-21T00:00:00.682Z"
              }
            ]
          }
        ],
        "requirement": [
          "string"
        ],
        "objective": [
          "string"
        ]
      },
      "draft": true,
      "cost": 0.1,
      "posts": [
        {
          "id": "string",
          "user": "string",
          "message": "string",
          "type": "string",
          "course": "string",
          "createdOn": "2025-06-21T00:00:00.682Z",
          "modifiedOn": "2025-06-21T00:00:00.682Z",
          "like": 1073741824,
          "share": 1073741824,
          "rating": 1073741824
        }
      ]
    }
  ],
  "number": 1073741824,
  "sort": {
    "empty": true,
    "sorted": true,
    "unsorted": true
  },
  "numberOfElements": 1073741824,
  "pageable": {
    "offset": 9007199254740991,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "paged": true,
    "pageNumber": 1073741824,
    "pageSize": 1073741824,
    "unpaged": true
  },
  "empty": true
}`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/* my drafts */}
            <div id="my-drafts" style={{ marginBottom: "48px" }}>
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
                <FileText size={20} />
                My Drafts
              </h3>

              <p>Get user&apos;s draft</p>

              <ApiEndpoint
                method="GET"
                path="/api/v1/course/mydrafts/{usr}"
                description="Get drafted course by user ID"
                parameters={[
                  {
                    name: "usr",
                    type: "number",
                    required: true,
                    description: "ID of the user",
                  },
                ]}
              >
                <CodeBlock
                  language="json"
                  title="Sample Response"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`[
  {
    "id": "string",
    "author": {
      "id": "string",
      "firstname": "string",
      "lastname": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "phone": "string",
      "country": "string",
      "bio": "string",
      "organizationId": "string",
      "email": "string",
      "password": "string",
      "token": "string",
      "dp": "string",
      "active": true,
      "createdOn": "2025-06-21T00:10:35.638Z",
      "modifiedOn": "2025-06-21T00:10:35.638Z",
      "lastLogin": "2025-06-21",
      "roles": [
        "string"
      ]
    },
    "courseName": "string",
    "category": "string",
    "target": "string",
    "brief": "string",
    "overview": "string",
    "price": 0.1,
    "tax": 0.1,
    "createdOn": "2025-06-21T00:10:35.638Z",
    "thumbnail": "string",
    "updatedOn": "2025-06-21",
    "totalSteps": 1073741824,
    "draft": true,
    "currency": "string",
    "organizationId": "string"
  }
]`}
                </CodeBlock>
              </ApiEndpoint>
            </div>
            {/* course registration */}
            <div id="course-registration" style={{ marginBottom: "48px" }}>
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
                Course Registration
              </h3>

              <p>Register a course for a user.</p>

              <ApiEndpoint
                method="POST"
                path="/api/v1/reg/add"
                description="Add a course for a user"
              >
                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`   {
     {
        "user": "string",
        "comment": "string",
        "fileName": "string",
        "count": 1073741824,
        "like": 1073741824,
        "share": 1073741824,
        "star": 0.1,
        "price": 0.1,
        "tax": 0.1,
        "activeStep": 9007199254740991
      }
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
                      <code>user</code> - ID of the user
                      <Badge variant="error">required</Badge>
                    </li>
                  </ul>
                </div>
              </ApiEndpoint>
            </div>

            {/* course deregistration */}
            <div id="course-deregistration" style={{ marginBottom: "48px" }}>
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
                <UserMinus size={20} />
                Course Deregistration
              </h3>

              <p>Deregister a course for a user.</p>

              <ApiEndpoint
                method="PUT"
                path="/api/v1/reg/remove"
                description="Remove a course for a user"
              >
                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "id": "string",
  "user": "string"
}`}
                </CodeBlock>

                <CodeBlock
                  language="bash"
                  title="Example Request"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`
  curl -X 'PUT' \\
  'http://localhost:5071/api/v1/reg/remove' \\ 
  -H 'accept: /' \\
  -H 'Content-Type: application/json' \\
  -d '{ 
    "id": "686fbea1e29e333073f4d1f2", 
    "user": "6861dc54f6f42d164a76793b"
     }'
                      `}
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
                      <code>user</code> - ID of the user
                      <Badge variant="error">required</Badge>
                    </li>
                  </ul>
                </div>
              </ApiEndpoint>
            </div>

            {/* my courses */}
            <div id="my-courses" style={{ marginBottom: "48px" }}>
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
                <Book size={20} />
                My Courses
              </h3>

              <p>Get the courses that user have registered for</p>

              <ApiEndpoint
                method="GET"
                path="/api/v1/course/courses/my-registered/{usr}"
                description="Get courses by author ID"
                parameters={[
                  {
                    name: "usr",
                    type: "number",
                    required: true,
                    description: "ID of the user",
                  },
                ]}
              >
                <CodeBlock
                  language="json"
                  title="Sample Response"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`[
  {
    "author": "string",
    "authorRole": "string",
    "authorCompany": "string",
    "id": "string",
    "courseName": "string",
    "brief": "string",
    "overview": "string",
    "createdOn": "2025-06-21T00:11:37.943Z",
    "updatedOn": "2025-06-21",
    "thumbnail": "string",
    "category": "string",
    "currency": "string",
    "totalSteps": 1073741824,
    "activeStep": 1073741824,
    "students": 1073741824,
    "curriculum": {
      "topic": [
        {
          "id": "string",
          "courseId": "string",
          "title": "string",
          "description": "string",
          "orderIndex": 1073741824,
          "createdOn": "2025-06-21T00:11:37.943Z",
          "updatedOn": "2025-06-21T00:11:37.943Z",
          "lessons": [
            {
              "id": "string",
              "topicId": "string",
              "title": "string",
              "type": "string",
              "video": "string",
              "content": "string",
              "orderIndex": 1073741824,
              "createdOn": "2025-06-21T00:11:37.943Z",
              "updatedOn": "2025-06-21T00:11:37.943Z"
            }
          ]
        }
      ],
      "requirement": [
        "string"
      ],
      "objective": [
        "string"
      ]
    },
    "draft": true,
    "cost": 0.1,
    "posts": [
      {
        "id": "string",
        "user": "string",
        "message": "string",
        "type": "string",
        "course": "string",
        "createdOn": "2025-06-21T00:11:37.943Z",
        "modifiedOn": "2025-06-21T00:11:37.943Z",
        "like": 1073741824,
        "share": 1073741824,
        "rating": 1073741824
      }
    ]
  }
]`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/*course by id */}
            <div id="course-by-id" style={{ marginBottom: "48px" }}>
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
                <Search size={20} />
                Course by ID
              </h3>

              <p>Get a course by its ID.</p>

              <ApiEndpoint
                method="GET"
                path="/api/v1/course/{cid}"
                description="Get course by ID"
                parameters={[
                  {
                    name: "cid",
                    type: "number",
                    required: true,
                    description: "ID of the course to retrieve",
                  },
                  {
                    name: "userId",
                    type: "number",

                    description: "(query) ID of the user requesting the course",
                  },
                ]}
              >
                <CodeBlock
                  language="json"
                  title="Sample Response"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "courseId": "string",
  "courseName": "string",
  "overview": "string",
  "currency": "string",
  "author": {
    "id": "string",
    "firstname": "string",
    "lastname": "string",
    "country": "string",
    "password": "string",
    "email": "string",
    "type": "string",
    "updatedOn": "2025-06-21T00:14:17.511Z",
    "token": "string",
    "dp": "string",
    "status": true,
    "roles": [
      "string"
    ],
    "message": "string",
    "courses": [
      "string"
    ],
    "rating": 0.1,
    "reviews": [
      "string"
    ]
  },
  "category": "string",
  "target": "string",
  "curriculum": {
    "topic": [
      {
        "id": "string",
        "courseId": "string",
        "title": "string",
        "description": "string",
        "orderIndex": 1073741824,
        "createdOn": "2025-06-21T00:14:17.511Z",
        "updatedOn": "2025-06-21T00:14:17.511Z",
        "lessons": [
          {
            "id": "string",
            "topicId": "string",
            "title": "string",
            "type": "string",
            "video": "string",
            "content": "string",
            "orderIndex": 1073741824,
            "createdOn": "2025-06-21T00:14:17.511Z",
            "updatedOn": "2025-06-21T00:14:17.511Z"
          }
        ]
      }
    ],
    "requirement": [
      "string"
    ],
    "objective": [
      "string"
    ]
  },
  "brief": "string",
  "price": 0.1,
  "tax": 0.1,
  "posts": [
    {
      "id": "string",
      "user": "string",
      "message": "string",
      "type": "string",
      "course": "string",
      "createdOn": "2025-06-21T00:14:17.511Z",
      "modifiedOn": "2025-06-21T00:14:17.511Z",
      "like": 1073741824,
      "share": 1073741824,
      "rating": 1073741824
    }
  ],
  "signed": [
    {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  ],
  "assetCount": {
    "additionalProp1": 1073741824,
    "additionalProp2": 1073741824,
    "additionalProp3": 1073741824
  },
  "createdOn": "2025-06-21T00:14:17.511Z",
  "thumbnail": "string",
  "updatedOn": "2025-06-21",
  "totalSteps": 1073741824,
  "draft": true,
  "registered": true
}`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/*course by author */}
            <div id="courses-by-author" style={{ marginBottom: "48px" }}>
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
                <Users size={20} />
                Courses by Author
              </h3>

              <p>Get courses by author ID.</p>

              <ApiEndpoint
                method="GET"
                path="/api/v1/course/byauthor/{aid}"
                description="Get courses by author ID"
                parameters={[
                  {
                    name: "aid",
                    type: "number",
                    required: true,
                    description:
                      "ID of the author of the courses to be retrieved",
                  },
                ]}
              >
                <CodeBlock
                  language="json"
                  title="Sample Response"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`[
  {
    "id": "string",
    "author": {
      "id": "string",
      "firstname": "string",
      "lastname": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "phone": "string",
      "country": "string",
      "bio": "string",
      "organizationId": "string",
      "email": "string",
      "password": "string",
      "token": "string",
      "dp": "string",
      "active": true,
      "createdOn": "2025-06-21T00:13:07.809Z",
      "modifiedOn": "2025-06-21T00:13:07.809Z",
      "lastLogin": "2025-06-21",
      "roles": [
        "string"
      ]
    },
    "courseName": "string",
    "category": "string",
    "target": "string",
    "brief": "string",
    "overview": "string",
    "price": 0.1,
    "tax": 0.1,
    "createdOn": "2025-06-21T00:13:07.809Z",
    "thumbnail": "string",
    "updatedOn": "2025-06-21",
    "totalSteps": 1073741824,
    "draft": true,
    "currency": "string",
    "organizationId": "string"
  }
]`}
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

          {/* Course Redirect Section */}
          <section id="course-redirect" style={{ marginBottom: "64px" }}>
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
              <GitCompareArrows size={24} />
              Course Redirect
            </h2>

            <p>
              To enable seamless course access for users, configure the Course
              Redirect as follows:
            </p>

            <div
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                margin: "24px 0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                  }}
                >
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
                    Admin Configuration
                  </h3>
                </div>
                <p
                  style={{ color: "#222222", margin: "10px", fontSize: "16px" }}
                >
                  1. Log in to the Horace LMS Dashboard as an Admin.
                </p>
                <p
                  style={{ color: "#222222", margin: "10px", fontSize: "16px" }}
                >
                  2. Navigate to Organization Settings.
                </p>
                <p
                  style={{ color: "#222222", margin: "10px", fontSize: "16px" }}
                >
                  {" "}
                  3. Set the `LearnURL` field to your client site URL that will
                  handle course redirects.{" "}
                </p>

                <div
                  style={{
                    margin: "20px 0",
                    padding: "16px",
                    background: "#f1eef6",
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
                    Example LEARNURL
                  </h5>
                  <p
                    style={{
                      color: "#222222",
                      margin: "10px",
                      fontSize: "16px",
                    }}
                  >{`https://clientwebsite.com/course/<courseId>?userId=<base64UserId>`}</p>
                  <p
                    style={{
                      color: "#222222",
                      margin: "10px",
                      fontSize: "16px",
                    }}
                  >{`NOTE: Replace <courseId> and <base64UserId> with actual values.`}</p>
                </div>

                <p
                  style={{ color: "#222222", margin: "10px", fontSize: "16px" }}
                >
                  {" "}
                  This is a valid/existing page on the client’s website.{" "}
                </p>
                <p
                  style={{ color: "#222222", margin: "10px", fontSize: "16px" }}
                >
                  {" "}
                  The page must be able to accept courseID and userID in the
                  path e.g{" "}
                </p>

                <div
                  style={{
                    margin: "20px 0",
                    padding: "16px",
                    background: "#f1eef6",
                    borderRadius: "8px",
                  }}
                >
                  <p>
                    https://lms.horacelearning.com/course/68618b37f6f42d164a767938?userId=Njg2MWU1YjNmNmY0MmQxNjRhNzY3OTNl
                  </p>
                </div>

                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  In the example above,
                </h4>
                <p
                  style={{ color: "#222222", margin: "10px", fontSize: "16px" }}
                >
                  {" "}
                  68618b37f6f42d164a767938 → Course ID{" "}
                </p>
                <p
                  style={{ color: "#222222", margin: "10px", fontSize: "16px" }}
                >
                  {" "}
                  Njg2MWU1YjNmNmY0MmQxNjRhNzY3OTNl → Base64 encoded User ID{" "}
                </p>
              </div>

              <div
                style={{ padding: "20px", borderBottom: "1px solid #e2e8f0" }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Parameters
                </h4>
                <ul style={{ margin: "0", paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "8px", color: "#4b5563" }}>
                    <code>courseId</code> - ID of the course the user is
                    redirected to. <Badge variant="error">required</Badge>
                  </li>
                  <li style={{ marginBottom: "8px", color: "#4b5563" }}>
                    <code>userId</code> - Base64 encoded ID of the user
                    accessing it.
                    <Badge variant="error">required</Badge>
                  </li>
                </ul>
              </div>

              <div
                style={{
                  padding: "20px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
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
                  Frontend Behavior
                </h3>
                <div>
                  <p
                    style={{
                      color: "#222222",
                      margin: "10px",
                      fontSize: "16px",
                    }}
                  >
                    1. Retrieve `courseId` and `userId` from the URL path or
                    query.
                  </p>
                  <p
                    style={{
                      color: "#222222",
                      margin: "10px",
                      fontSize: "16px",
                    }}
                  >
                    2. Decode userId from base64:
                  </p>
                  <CodeBlock
                    language="javascript"
                    copiedCode={copiedCode}
                    copyToClipboard={copyToClipboard}
                  >
                    {`
const encodedUid = searchParams.get("userId");
const decodedUid = atob(encodedUid);
`}
                  </CodeBlock>

                  <p
                    style={{
                      color: "#222222",
                      margin: "10px",
                      fontSize: "16px",
                    }}
                  >
                    {" "}
                    3. Fetch the course summary using the decoded userId:{" "}
                  </p>
                  <CodeBlock
                    language="javascript"
                    copiedCode={copiedCode}
                    copyToClipboard={copyToClipboard}
                  >
                    {`
const response = await fetch(\`\${basePath}\course/\${courseId}?userId=\${decodedUid}\`);
`}
                  </CodeBlock>
                  <p
                    style={{
                      color: "#222222",
                      margin: "10px",
                      fontSize: "16px",
                    }}
                  >
                    {" "}
                    4. Display the course details and registration button.{" "}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "48px", padding: "20px" }}>
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
                  <Settings2Icon size={20} />
                  Organization Update API
                </h3>
                <ApiEndpoint
                  method="PUT"
                  path="/api/v1/org/update/{id}"
                  description="To update the LearnURL for an organization:"
                >
                  <h4>Request Body</h4>
                  <CodeBlock
                    language="json"
                    title="Request Body"
                    copiedCode={copiedCode}
                    copyToClipboard={copyToClipboard}
                  >
                    {`{
  "id": "string",
  "learnURL": "https://clientwebsite.com/course"
}`}
                  </CodeBlock>

                  <h4>Example Request</h4>
                  <CodeBlock
                    language="bash"
                    title="cURL Example"
                    copiedCode={copiedCode}
                    copyToClipboard={copyToClipboard}
                  >
                    {`curl -X 'PUT' \\
  'http://localhost:5071/api/v1/org/update/684e58d4df81cc6605736c85' \\
  -H 'accept: */*' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "id": "684e58d4df81cc6605736c85",
    "learnURL": "https://clientwebsite.com/course"
  }'
`}
                  </CodeBlock>
                </ApiEndpoint>
              </div>
            </div>
          </section>

          {/* Invoice Management API */}

          <section id="invoice-management" style={{ marginBottom: "64px" }}>
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
              <GitCompareArrows size={24} />
              Invoice Management API
            </h2>

            {/* 1. Add Transaction */}
            <div id="add-tranx" style={{ marginBottom: "48px" }}>
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
                <Receipt size={20} />
                Add Transaction
              </h3>
              <ApiEndpoint
                method="POST"
                path="/api/v1//tranx/store"
                description="Creates a new transaction in the system. Each transaction is assigned a unique txnref."
              >
                <CodeBlock
                  language="json"
                  title="Request Body"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "amount": 0,
  "description": "string",
  "currency": "NGN",
  "payee_id": 0,
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "phone": "string",
  "detail": {},
  "tranx_type": "OTHERS",
  "receipt": "string",
  "ref": 0,
  "isp": "ISW",
  "stripe_payment_method": "string",
  "status": "Pending",
  "createdOn": "2025-07-25T04:00:41.687Z",
  "modifiedOn": "2025-07-25T04:00:41.687Z",
  "callback_url": "https://example.com/",
  "stripeId": "string",
  "payee": {
    "first_name": "string",
    "last_name": "string",
    "is_active": false,
    "roles": [
      "Admin"
    ],
    "socialmedia": "string",
    "gender": "Male",
    "token": "string",
    "username": "string",
    "attendance_token": "string",
    "subclass": "string",
    "id": 0,
    "timestamp": "2025-07-24T15:12:47.410917",
    "email": "user@example.com",
    "phone_number": "string",
    "status": "New",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zip_code": "string",
      "email": "user@example.com",
      "phone_number": "string",
      "country": "string",
      "id": 0
    },
    "dp": "string"
  },
  "tranx_items": [
    {
      "tranx_ref": 0,
      "item_name": "string",
      "item_description": "string",
      "item_amount": 0,
      "item_currency": "string"
    }
  ]
}`}
                </CodeBlock>

                <CodeBlock
                  language="bash"
                  title="Example Request"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`
  curl -X 'PUT' \\
  'http://localhost:5071/api/v1/tranx/store' \\ 
  -H 'accept: /' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "amount": 0,
  "description": "string",
  "currency": "NGN",
  "payee_id": 0,
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "phone": "string",
  "detail": {},
  "tranx_type": "OTHERS",
  "receipt": "string",
  "ref": 0,
  "isp": "ISW",
  "stripe_payment_method": "string",
  "status": "Pending",
  "createdOn": "2025-07-25T04:00:41.687Z",
  "modifiedOn": "2025-07-25T04:00:41.687Z",
  "callback_url": "https://example.com/",
  "stripeId": "string",
  "payee": {
    "first_name": "string",
    "last_name": "string",
    "is_active": false,
    "roles": [
      "Admin"
    ],
    "socialmedia": "string",
    "gender": "Male",
    "token": "string",
    "username": "string",
    "attendance_token": "string",
    "subclass": "string",
    "id": 0,
    "timestamp": "2025-07-24T15:12:47.410917",
    "email": "user@example.com",
    "phone_number": "string",
    "status": "New",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zip_code": "string",
      "email": "user@example.com",
      "phone_number": "string",
      "country": "string",
      "id": 0
    },
    "dp": "string"
  },
  "tranx_items": [
    {
      "tranx_ref": 0,
      "item_name": "string",
      "item_description": "string",
      "item_amount": 0,
      "item_currency": "string"
    }
  ]
}'
                      `}
                </CodeBlock>

                <CodeBlock
                  language="json"
                  title="Example Response"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`{
  "txn_ref": 0,
  "payee_id": 0,
  "payee_email": "user@example.com"
}`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/* 2. Make Invoice for Transaction */}
            <div id="make-invoice" style={{ marginBottom: "48px" }}>
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
                <Settings2 size={20} />
                Make Invoice for Transaction
              </h3>

              <ApiEndpoint
                method="GET"
                path="/api/v1/tranx/invoice/{txnref}"
                description="Generates an invoice for a specific transaction."
                parameters={[
                  {
                    name: "txnref",
                    type: "string",
                    required: true,
                    description: "The reference code of the transaction.",
                  },
                ]}
              >
                <CodeBlock
                  language="json"
                  title="Sample Response"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`true`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/* 3. View Invoice */}
            <div id="view-invoice" style={{ marginBottom: "48px" }}>
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
                <View size={20} />
                View Invoice
              </h3>

              <ApiEndpoint
                method="GET"
                path="/api/v1/tranx/view-invoice/{ref_id}"
                description="Retrieves and displays a generated invoice in a browser-friendly format (HTML/PDF preview)."
                parameters={[
                  {
                    name: "ref_id",
                    type: "string",
                    required: true,
                    description: "The unique invoice ID.",
                  },
                ]}
              >
                <CodeBlock
                  language="json"
                  title="Sample Response"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`"string"`}
                </CodeBlock>
              </ApiEndpoint>
            </div>

            {/* 4. Download Invoice */}
            <div id="download-invoice" style={{ marginBottom: "48px" }}>
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
                <DownloadIcon size={20} />
                Download Invoice
              </h3>

              <ApiEndpoint
                method="GET"
                path="/api/v1/tranx/download-invoice/{ref_id}"
                description="Retrieves and displays a generated invoice in a browser-friendly format (HTML/PDF preview)."
                parameters={[
                  {
                    name: "ref_id",
                    type: "string",
                    required: true,
                    description: "The unique invoice ID.",
                  },
                ]}
              >
                <CodeBlock
                  language="json"
                  title="Sample Response"
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                >
                  {`"string"`}
                </CodeBlock>
              </ApiEndpoint>
            </div>
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
