//? This file is part of the PDF.js worker API route.
//? It serves the worker script to the client as a url
import { join } from "path"
import { readFileSync } from "fs"

export function GET() {
  //? Path to the PDF.js worker script
  const workerPath = join(
    //? current working directory
    process.cwd(),
    //? path to the worker script
    "node_modules",
    "pdfjs-dist",
    "legacy",
    "build",
    "pdf.worker.min.mjs"
  )

  //? Read the worker script content
  const workerContent = readFileSync(workerPath, "utf8")

  //? Return the worker script as a response
  return new Response(workerContent, {
    headers: {
      "Content-Type": "application/javascript",
      //? caching to improve performance
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
