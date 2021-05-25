/*
****************** Authors CRUD ********************
1. CREATE → POST http://localhost:3001/authors (+ body)
2. READ → GET http://localhost:3001/authors (+ optional query parameters)
3. READ → GET http://localhost:3001/authors/:id
4. UPDATE → PUT http://localhost:3001/authors/:id (+ body)
5. DELETE → DELETE http://localhost:3001/authors/:id

*/

import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const authorsRouter = express.Router()

const filePath = fileURLToPath(import.meta.url)
const authorsFolderPath = dirname(filePath)
const authorJSONPath = join(authorsFolderPath, "authors.json")


authorsRouter.post("/", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())
  const author = authors.find(a => a.email === req.body.email)
  if (!author) {
    const newAuthor = { ...req.body, createdAt: new Date(), _id: uniqid() }
    console.log(newAuthor)
    const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())
    authors.push(newAuthor)
    fs.writeFileSync(authorJSONPath, JSON.stringify(authors))
    res.status(201).send(newAuthor._id)
  }
  else {
    res.status(201).send("duplicate email")
  }
})

authorsRouter.get("/", (req, res) => {
  const contentAsABuffer = fs.readFileSync(authorJSONPath) // we get back a buffer which is MACHINE READABLE
  const authors = JSON.parse(contentAsABuffer) // string needs to be converted into a JSON
  res.send(authors)
})

authorsRouter.get("/:id", (req, res) => {
  console.log(req.params)
  const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())
  const author = authors.find(s => s._id === req.params.id)
  res.send(author)
})

authorsRouter.put("/:id", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())
  const remainingAuthors = authors.filter(author => author._id !== req.params.id)
  const updatedAuthor = { ...req.body, _id: req.params.id }
  remainingAuthors.push(updatedAuthor)
  fs.writeFileSync(authorJSONPath, JSON.stringify(remainingAuthors))
  res.send(updatedAuthor)
})

authorsRouter.delete("/:id", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())
  const remainingAuthors = authors.filter(author => author._id !== req.params.id) // ! = =
  fs.writeFileSync(authorJSONPath, JSON.stringify(remainingAuthors))
  res.status(204).send()
})

export default authorsRouter