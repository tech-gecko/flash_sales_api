import { body } from "express-validator";
import { config } from "dotenv";

config();

const MAX = parseInt(process.env.MAX_PURCHASE_QUANTITY, 10) || 5;

export const validatePurchase = [
  body("saleId")
    .isMongoId().withMessage("Invalid sale ID")
    .notEmpty().withMessage("Sale ID is required"),
  body("quantity")
    .isInt({ min: 1, max: MAX })
      .withMessage(`Quantity must be between 1 and ${MAX} inclusive`)
    .notEmpty().withMessage("Quantity is required"),
];
