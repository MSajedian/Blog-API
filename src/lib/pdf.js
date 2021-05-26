import PdfPrinter from "pdfmake"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"


export const generatePDFStream = id => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  }

  const printer = new PdfPrinter(fonts)

  const blogpostJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../blogposts/blogposts.json")
  const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath).toString())
  const blogpost = blogposts.find(p => p._id.toString() === id.toString())

  const docDefinition = { content: [blogpost.category, blogpost.title, blogpost.content] }


  const options = {
    // ...
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)
  pdfReadableStream.end()

  return pdfReadableStream
}
