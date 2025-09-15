"use client"

import React from "react"
import { Box, Dialog, DialogContent, IconButton } from "@mui/material"
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from "@mui/icons-material"
import { CertificateData } from "@/types/types"

interface CertificateDisplayProps {
  certificate: CertificateData
  open: boolean
  onClose: () => void
}

const CertificateDisplay: React.FC<CertificateDisplayProps> = ({
  certificate,
  open,
  onClose,
}) => {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {}

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate of Completion - ${certificate.courseName}`,
        text: `I completed ${certificate.courseName} with a score of ${certificate.finalScore}%!`,
        url: `${window.location.origin}/verify/${certificate.verificationCode}`,
      })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: "relative" }}>
          {/* Certificate HTML Template */}
          <Box
            sx={{
              width: "11in",
              height: "8.5in",
              mx: "auto",
              p: 4,
              background: "white",
              position: "relative",
              boxShadow: 3,
            }}
          >
            {/* Certificate content based on the HTML template */}
            <style jsx>{`
              @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@300;400;600&display=swap");

              .certificate-container {
                width: 100%;
                height: 100%;
                background: white;
                position: relative;
                overflow: hidden;
              }

              .certificate-border {
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                bottom: 20px;
                border: 3px solid #2c5aa0;
                border-radius: 10px;
              }

              .certificate-header {
                text-align: center;
                padding: 40px 60px 30px;
                position: relative;
                z-index: 2;
              }

              .certificate-title {
                font-family: "Playfair Display", serif;
                font-size: 36px;
                color: #2c5aa0;
                margin-bottom: 10px;
                font-weight: 700;
              }

              .certificate-content {
                text-align: center;
                padding: 0 60px;
                position: relative;
                z-index: 2;
              }

              .recipient-name {
                font-family: "Playfair Display", serif;
                font-size: 32px;
                color: #2c5aa0;
                margin-bottom: 20px;
                font-weight: 700;
                border-bottom: 2px solid #2c5aa0;
                display: inline-block;
                padding-bottom: 8px;
              }

              .course-name {
                font-family: "Playfair Display", serif;
                font-size: 24px;
                color: #2c5aa0;
                margin-bottom: 20px;
                font-weight: 600;
              }

              .course-details {
                display: flex;
                justify-content: space-between;
                margin: 30px 0;
                padding: 15px 0;
                border-top: 1px solid #e0e0e0;
                border-bottom: 1px solid #e0e0e0;
              }

              .certificate-footer {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                padding: 30px 60px;
                position: relative;
                z-index: 2;
              }

              .verification-code {
                position: absolute;
                bottom: 10px;
                right: 20px;
                font-size: 10px;
                color: #666;
              }

              @media print {
                body {
                  background: white;
                }

                .certificate-actions {
                  display: none;
                }
              }
            `}</style>

            <div className="certificate-container">
              <div className="certificate-border"></div>

              <div className="certificate-header">
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "50%",
                    margin: "0 auto 15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  HL
                </div>
                <h1 className="certificate-title">Certificate of Completion</h1>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#666",
                    marginBottom: "20px",
                  }}
                >
                  This certifies that
                </p>
              </div>

              <div className="certificate-content">
                <p
                  style={{
                    fontSize: "18px",
                    color: "#333",
                    marginBottom: "15px",
                  }}
                >
                  This certificate is proudly awarded to
                </p>
                <h2 className="recipient-name">{certificate.recipientName}</h2>

                <p
                  style={{
                    fontSize: "16px",
                    color: "#333",
                    marginBottom: "15px",
                  }}
                >
                  for successfully completing the comprehensive course
                </p>

                <h3 className="course-name">{certificate.courseName}</h3>

                <div className="course-details">
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "5px",
                      }}
                    >
                      Course Duration
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      {certificate.courseDuration}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "5px",
                      }}
                    >
                      Completion Date
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      {certificate.completionDate}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "5px",
                      }}
                    >
                      Final Score
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      {certificate.finalScore}%
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "5px",
                      }}
                    >
                      Certificate ID
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      {certificate.certificateId}
                    </div>
                  </div>
                </div>
              </div>

              <div className="certificate-footer">
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "150px",
                      height: "40px",
                      borderBottom: "2px solid #333",
                      margin: "0 auto 8px",
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "5px",
                    }}
                  >
                    Instructor Signature
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#333",
                      fontWeight: "600",
                    }}
                  >
                    {certificate.instructorName}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {certificate.instructorTitle}
                  </div>
                </div>

                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background:
                      "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #e6c200",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#8b6914",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    OFFICIAL
                    <br />
                    SEAL
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "150px",
                      height: "40px",
                      borderBottom: "2px solid #333",
                      margin: "0 auto 8px",
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "5px",
                    }}
                  >
                    Platform Director
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#333",
                      fontWeight: "600",
                    }}
                  >
                    Michael Rodriguez
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Director of Education
                  </div>
                </div>
              </div>

              <div className="verification-code">
                Verify at:{" "}
                {typeof window !== "undefined" ? window.location.origin : ""}
                /verify/{certificate.verificationCode}
              </div>
            </div>
          </Box>

          {/* Action buttons */}
          <Box
            className="certificate-actions"
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              display: "flex",
              gap: 1,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: 2,
              p: 1,
            }}
          >
            <IconButton onClick={handlePrint} size="small">
              <PrintIcon />
            </IconButton>
            <IconButton onClick={handleDownload} size="small">
              <DownloadIcon />
            </IconButton>
            <IconButton onClick={handleShare} size="small">
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CertificateDisplay
