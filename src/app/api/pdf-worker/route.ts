//? This file is part of the PDF.js worker API route.
//? It serves the worker script to the client as a url
import { join } from "path"
import { readFileSync } from "fs"

export function GET() {
  const workerPath = join(
    process.cwd(),
    "node_modules",
    "pdfjs-dist",
    "build",
    "pdf.worker.mjs"
  )
  const workerContent = readFileSync(workerPath, "utf8")

  return new Response(workerContent, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
