import { body, param, query } from "express-validator";

export const registerValidator = [
  body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").exists().withMessage("Password is required")
];

export const noteCreateValidator = [
  body("title").isString().notEmpty().withMessage("Title required"),
  body("content").isString().notEmpty().withMessage("Content required"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

export const noteUpdateValidator = [
  param("id").isMongoId().withMessage("Invalid note id"),
  body("title").optional().isString(),
  body("content").optional().isString(),
  body("tags").optional().isArray(),
];

export const notesQueryValidator = [
  query("search").optional().isString(),
  query("tags").optional().isString(), 
];
