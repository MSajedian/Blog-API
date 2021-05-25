import express from "express";
import listEndpoints from "express-list-endpoints"
import cors from "cors"

import authorsRouter from "./authors/index.js"
import blogpostsRouter from "./blogposts/index.js"
import filesRouter from "./files/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"
import { getCurrentFolderPath } from "./lib/fs-tools.js"
import { join } from "path"

const server = express()
const port = process.env.PORT || 3001

const publicFolderPath = join(getCurrentFolderPath(import.meta.url), "../public")

// ******** MIDDLEWARES ************
const loggerMiddleware = (req, res, next) => {
    console.log(`Request method: ${req.method} ${req.url} -- ${new Date()}`)
    next()
}

// ******** CORS ************

const whitelist = [process.env.FRONTEND_DEV_URL, process.env.FRONTEND_CLOUD_URL]

const corsOptions = {
    origin: function (origin, next) {
        console.log("ORIGIN ", origin)
        if (whitelist.indexOf(origin) !== -1) {
            // origin allowed
            next(null, true)
        } else {
            // origin not allowed
            next(new Error("CORS TROUBLES!!!!!"))
        }
    },
}


server.use(express.static(publicFolderPath))
server.use(cors(corsOptions))
server.use(loggerMiddleware)
server.use(express.json())

// ******** ROUTES ************
server.use("/authors", authorsRouter)
server.use("/blogPosts", blogpostsRouter)
server.use("/authors", filesRouter)

// ******** ERROR MIDDLEWARES ************
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
})
