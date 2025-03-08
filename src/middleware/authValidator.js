import { body } from "express-validator";

export const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail().withMessage("Invalid email format")
    .notEmpty().withMessage("Email is required"),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .notEmpty().withMessage("Password is required"),
];

export const validateLogin = [
  body("email")
    .isEmail().withMessage("Invalid email format")
    .notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
