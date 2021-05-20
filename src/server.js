import express from "express";
import listEndpoints from "express-list-endpoints"
import cors from "cors"

import authorsRoutes from "./authors/index.js"
import blogpostsRoutes from "./blogposts/index.js"
import filesRoutes from "./files/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"
import { getCurrentFolderPath } from "./lib/fs-tools.js"
import { join } from "path"

const server = express()
const port = 3001

const publicFolderPath = join(getCurrentFolderPath(import.meta.url), "../public")

// ******** MIDDLEWARES ************
const loggerMiddleware = (req, res, next) => {
    console.log(`Request method: ${req.method} ${req.url} -- ${new Date()}`)
    next()
}

server.use(express.static(publicFolderPath))
server.use(cors())
server.use(loggerMiddleware)
server.use(express.json()) 

// ******** ROUTES ************
server.use("/authors", authorsRoutes)
server.use("/blogPosts", blogpostsRoutes)
server.use("/authors", filesRoutes)

// ******** ERROR MIDDLEWARES ************
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server is listening at http://127.0.0.1:${port}/`);
})
