import { Document, Page } from "react-pdf"
import "../../lib/worker-loader"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "@mui/icons-material"
import { CircularProgress } from "@mui/material"
import React from "react"
import { Box, IconButton, styled, Typography } from "@mui/material"

const PDFControls = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}))

export default function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = React.useState<number | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [scale, setScale] = React.useState(1.0)
  const [isLoading, setIsLoading] = React.useState(true)

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(numPages || 1, prev + 1))
  }

  const handleZoomIn = () => {
    setScale((prev) => prev + 0.1)
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.1))
  }

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }

  return (
    <>
      <PDFControls>
        <IconButton
          size="small"
          onClick={handlePrevious}
          disabled={currentPage <= 1 || isLoading}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </IconButton>

        <Typography variant="body2">
          Page {currentPage} of {numPages || "--"}
        </Typography>

        <IconButton
          size="small"
          onClick={handleNext}
          disabled={currentPage >= (numPages || 1) || isLoading}
          aria-label="Next page"
        >
          <ChevronRight />
        </IconButton>

        <IconButton
          size="small"
          onClick={handleZoomIn}
          disabled={isLoading}
          aria-label="Zoom in"
        >
          <ZoomIn />
        </IconButton>

        <IconButton
          size="small"
          onClick={handleZoomOut}
          disabled={isLoading}
          aria-label="Zoom out"
        >
          <ZoomOut />
        </IconButton>
      </PDFControls>

      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Document
          file={url}
          onLoadSuccess={handleLoadSuccess}
          loading={<CircularProgress />}
          error={<Typography color="error">Failed to load PDF</Typography>}
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            loading={<CircularProgress />}
            renderTextLayer={false}
          />
        </Document>
      </Box>
    </>
  )
}
