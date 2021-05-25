import { body } from "express-validator"

export const blogpostValidation = [
  body("category").exists().withMessage("category is a mandatory field!"),
  body("title").exists().withMessage("title is a mandatory field!"),
  body("cover").exists().withMessage("cover is a mandatory field!"),
  body("readTime").exists().withMessage("readTime is a mandatory field!"),
  body("readTime.value").exists().withMessage("value of readTime is a mandatory field!").isInt().withMessage("value must be an integer!"),
  body("readTime.unit").exists().withMessage("unit of readTime is a mandatory field!"),
  body("content").exists().withMessage("content is a mandatory field!"),
]
