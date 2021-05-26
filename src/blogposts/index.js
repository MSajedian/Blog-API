import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import { validationResult } from "express-validator"
import createError from "http-errors"
import { blogpostValidation } from "./validation.js"
import { pipeline } from "stream"
import { generatePDFStream } from "../lib/pdf.js"

const blogpostsRouter = express.Router()
const blogpostJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogposts.json")

blogpostsRouter.post("/", blogpostValidation, (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      next(createError(400, { errorList: errors }))
    } else {
      const newBlogpost = { ...req.body, createdAt: new Date(), _id: uniqid(), "author": { "name": "AUTHOR AVATAR NAME", "avatar": "AUTHOR AVATAR LINK" } }
      const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath).toString())
      blogposts.push(newBlogpost)
      fs.writeFileSync(blogpostJSONPath, JSON.stringify(blogposts))
      res.status(201).send(newBlogpost._id)
    }
  } catch (error) {
    next(error)
  }
})

blogpostsRouter.get("/", (req, res, next) => {
  try {
    const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath))
    res.send(blogposts)
  } catch (error) {
    next(error)
  }
})


blogpostsRouter.get("/pdfDownload/:id", async (req, res, next) => {
  try {
    const pdfStream = await generatePDFStream(req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    pdfStream.pipe(res);
    pdfStream.end();

    // const source = generatePDFStream(req.params.id)
    // const destination = res
    // res.setHeader("Content-Disposition", "attachment; filename=export.pdf")
    // pipeline(source, destination, err => next(err))
  } catch (error) {
    next(error)
  }
})


blogpostsRouter.get("/:id", (req, res, next) => {
  try {
    const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath).toString())
    const blogpost = blogposts.find(s => s._id === req.params.id)
    if (blogpost) {
      res.send(blogpost)
    } else {
      next(createError(404, `Blogpost ${req.params.id} not found`))
    }
  } catch (error) {
    next(error)
  }
})

blogpostsRouter.put("/:id", (req, res, next) => {
  try {
    const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath).toString())
    const remainingBlogposts = blogposts.filter(blogpost => blogpost._id !== req.params.id)
    const updatedBlogpost = { ...req.body, _id: req.params.id }
    remainingBlogposts.push(updatedBlogpost)
    fs.writeFileSync(blogpostJSONPath, JSON.stringify(remainingBlogposts))
    res.send(updatedBlogpost)
  } catch (error) {
    next(error)
  }
})

blogpostsRouter.delete("/:id", (req, res, next) => {
  try {
    const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath).toString())
    const remainingBlogposts = blogposts.filter(blogpost => blogpost._id !== req.params.id) // ! = =
    fs.writeFileSync(blogpostJSONPath, JSON.stringify(remainingBlogposts))
    res.status(204).send("deleted")
  } catch (error) {
    next(error)
  }
})

export default blogpostsRouter
