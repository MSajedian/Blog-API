import express from "express"
import { writeAuthorsPictures, readAuthorsPictures } from "../lib/fs-tools.js"
import multer from "multer"
import { fileURLToPath } from "url"
import { extname, dirname, join } from "path"
import fs from "fs-extra"

// import { pipeline } from "stream"
// import zlib from "zlib"

const authorsFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/authors")
const authorJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../authors/authors.json")

const filesRouter = express.Router()

filesRouter.post("/:id/uploadAvatar", multer().single("idOfTheAuthor"), async (req, res, next) => {
  try {
    await writeAuthorsPictures(`${req.params.id}${extname(req.file.originalname)}`, req.file.buffer)
    const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString())
    const remainingAuthors = authors.filter(author => author._id !== req.params.id)
    let updatedAuthor = authors.filter(author => author._id === req.params.id)[0]
    updatedAuthor["authorProfilePicture"] = `http://127.0.0.1/authors/${req.params.id}/${req.params.id}.${ExtensionOfFile}`
    remainingAuthors.push(updatedAuthor)
    fs.writeFileSync(authorJSONPath, JSON.stringify(remainingAuthors))
    res.send()
  } catch (error) {
    console.log(error)
    next(error)
  }
})





// filesRouter.post("/uploadMultiple", multer().array("multipleProfilePic", 2), async (req, res, next) => {
//   try {
//     const arrayOfPromises = req.files.map(file => writeAuthorsPictures(file.originalname, file.buffer))

//     await Promise.all(arrayOfPromises)
//     res.send()
//   } catch (error) {
//     console.log(error)
//     next(error)
//   }
// })

// filesRouter.get("/:fileName/download", async (req, res, next) => {
//   try {
//     // source (fileOnDisk, req, ...) --> destination (fileOnDisk, res, ...)
//     // source --> readable stream, destination --> writable stream

//     // source (fileOnDisk, req, ...) --> transform chunk by chunk (zip, csv) --> destination (fileOnDisk, res, ...)
//     // source --> readable stream, transform --> transform stream, destination --> writable stream

//     res.setHeader("Content-Disposition", `attachment; filename=${req.params.fileName}.gz`) // header needed to tell the browser to open the "save file as " window

//     const source = readAuthorsPictures(req.params.fileName) // creates a readable stream on that file on disk
//     const destination = res // response object is a writable stream used as the destination

//     pipeline(source, zlib.createGzip(), destination, err => next(err)) // with pipeline we connect together a source and a destination
//   } catch (error) {
//     next(error)
//   }
// })

export default filesRouter
