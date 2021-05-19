/*
****************** Blogposts CRUD ********************
1. CREATE → POST http://localhost:3001/blogposts (+ body)
2. READ → GET http://localhost:3001/blogposts (+ optional query parameters)
3. READ → GET http://localhost:3001/blogposts/:id
4. UPDATE → PUT http://localhost:3001/blogposts/:id (+ body)
5. DELETE → DELETE http://localhost:3001/blogposts/:id
*/

import express from "express" 
import fs from "fs" 
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 
import uniqid from "uniqid"
import { validationResult } from "express-validator"
import createError from "http-errors"
import { blogpostValidation } from "./validation.js"

const blogpostsRouter = express.Router()
const blogpostJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogposts.json")

blogpostsRouter.post("/", blogpostValidation, (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // if we had errors

      next(createError(400, { errorList: errors }))
    } else {
      // 1. read request body
      const newBlogpost = { ...req.body, createdAt: new Date(), _id: uniqid() }

      // 2. read the old content of the file blogposts.json
      const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath).toString())

      // 3. push the new blogpost into blogposts array
      blogposts.push(newBlogpost)

      // 4. write the array back into the file blogposts.json
      fs.writeFileSync(blogpostJSONPath, JSON.stringify(blogposts))

      // 5. send back proper response

      res.status(201).send(newBlogpost._id)
    }
  } catch (error) {
    next(error)
  }
}) // (URL, ROUTE HANDLER), Route handler (req, res, next) => {}

blogpostsRouter.get("/", (req, res, next) => {
  try {
    const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath))
    res.send(blogposts)
  } catch (error) {
    next(error)
  }
})

blogpostsRouter.get("/:id", (req, res, next) => {
  try {
    // 1. read the content of the file
    const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath).toString())

    // 2. find the one with the correspondant id

    const blogpost = blogposts.find(s => s._id === req.params.id)

    if (blogpost) {
      // 3. send it as a response
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
    // 1. read the old content of the file
    const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath).toString())

    // 2. modify the specified blogpost

    const remainingBlogposts = blogposts.filter(blogpost => blogpost._id !== req.params.id)

    const updatedBlogpost = { ...req.body, _id: req.params.id }

    remainingBlogposts.push(updatedBlogpost)

    // 3. write the file with the updated list
    fs.writeFileSync(blogpostJSONPath, JSON.stringify(remainingBlogposts))
    // 4. send a proper response

    res.send(updatedBlogpost)
  } catch (error) {
    next(error)
  }
})

blogpostsRouter.delete("/:id", (req, res, next) => {
  try {
    // 1. read the old content of the file
    const blogposts = JSON.parse(fs.readFileSync(blogpostJSONPath).toString())

    // 2. filter out the specified id

    const remainingBlogposts = blogposts.filter(blogpost => blogpost._id !== req.params.id) // ! = =

    // 3. write the remaining blogposts into the file blogposts.json
    fs.writeFileSync(blogpostJSONPath, JSON.stringify(remainingBlogposts))

    // 4. send back a proper response

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default blogpostsRouter
