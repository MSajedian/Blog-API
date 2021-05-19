import express from "express";
import listEndpoints from "express-list-endpoints"
import cors from "cors"

import authorsRoutes from "./authors/index.js"
import blogpostsRoutes from "./blogposts/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"

const server = express()
const port = process.env.PORT || 3001

// ******** MIDDLEWARES ************
const loggerMiddleware = (req, res, next) => {
    console.log(`Request method: ${req.method} ${req.url} -- ${new Date()}`)
    next()
}

server.use(loggerMiddleware)
server.use(cors())
server.use(express.json()) 

// ******** ROUTES ************
server.use("/authors", authorsRoutes)
server.use("/blogposts", blogpostsRoutes)

// ******** ERROR MIDDLEWARES ************
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
    console.log("Server listening on port ", port)
})
