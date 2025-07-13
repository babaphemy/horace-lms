import { pdfjs } from "react-pdf"

//? Added API route to serve the PDF worker script
// pdfjs.GlobalWorkerOptions.workerSrc = "/api/pdf-worker"
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`
