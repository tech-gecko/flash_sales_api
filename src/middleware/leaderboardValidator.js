import { query } from "express-validator";

export const validateLeaderboard = [
  query("limit")
    .optional()
    .isInt({ min: 10, max: 50 })
    .withMessage("Limit must be between 10 and 50 inclusive"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
];
