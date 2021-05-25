import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

console.log('dataFolderPath:', join(dirname(fileURLToPath(import.meta.url)), "../data"))
console.log('authorsFolderPath:', join(dirname(fileURLToPath(import.meta.url)), "../../public/img/authors"))

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const authorsFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/authors")

export const getAuthors = async () => await readJSON(join(dataFolderPath, "authors.json"))
export const getBooks = async () => await readJSON(join(dataFolderPath, "books.json"))

export const writeAuthors = async content => await writeJSON(join(dataFolderPath, "authors.json"), content)
export const writeBooks = async content => await writeJSON(join(dataFolderPath, "books.json"), content)

export const writeAuthorsPictures = async (fileName, content) => await writeFile(join(authorsFolderPath, fileName), content)

export const getCurrentFolderPath = currentFile => dirname(fileURLToPath(currentFile))

export const readAuthorsPictures = fileName => createReadStream(join(authorsFolderPath, fileName))
