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
  // 1. read request body
  const newAuthor = { ...req.body, createdAt: new Date(), _id: uniqid() }
  console.log(newAuthor)

  // 2. read the old content of the file authors.json

  const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())

  // 3. push the newauthor into authors array
  authors.push(newAuthor)

  // 4. write the array back into the file authors.json
  fs.writeFileSync(authorJSONPath, JSON.stringify(authors))

  // 5. send back proper response

  res.status(201).send(newAuthor._id)
}) // (URL, ROUTE HANDLER), Route handler (req, res) => {}

authorsRouter.get("/", (req, res) => {
  // 1. read authors.json content

  const contentAsABuffer = fs.readFileSync(authorJSONPath) // we get back a buffer which is MACHINE READABLE
  //const contentAsAString = contentAsABuffer.toString() // we need to convert it to a string to have it in a HUMAN READABLE form

  // 2. send the content as a response
  const authors = JSON.parse(contentAsABuffer) // string needs to be converted into a JSON
  res.send(authors)
})

authorsRouter.get("/:id", (req, res) => {
  console.log(req.params)

  // 1. read the content of the file
  const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())

  // 2. find the one with the correspondant id

  const author = authors.find(s => s._id === req.params.id)

  // 3. send it as a response
  res.send(author)
})

authorsRouter.put("/:id", (req, res) => {
  // 1. read the old content of the file
  const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())

  // 2. modify the specified author

  const remainingAuthors = authors.filter(author => author._id !== req.params.id)

  const updatedAuthor = { ...req.body, _id: req.params.id }

  remainingAuthors.push(updatedAuthor)

  // 3. write the file with the updated list
  fs.writeFileSync(authorJSONPath, JSON.stringify(remainingAuthors))
  // 4. send a proper response

  res.send(updatedAuthor)
})

authorsRouter.delete("/:id", (req, res) => {
  // 1. read the old content of the file
  const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())

  // 2. filter out the specified id

  const remainingAuthors = authors.filter(author => author._id !== req.params.id) // ! = =

  // 3. write the remaining authors into the file authors.json
  fs.writeFileSync(authorJSONPath, JSON.stringify(remainingAuthors))

  // 4. send back a proper response

  res.status(204).send()
})

export default authorsRouter