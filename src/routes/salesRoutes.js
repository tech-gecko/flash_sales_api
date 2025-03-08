import { Router } from "express";
import { createPurchase, getActiveSale } from "../controllers/salesController.js";
import { authenticate } from "../middleware/auth.js";
import { validatePurchase } from "../middleware/salesValidator.js";
import { handleValidationErrors } from "../middleware/validationErrorHandler.js";

const router = Router();

router.get("/active", authenticate, getActiveSale);

// Pass io to the controller
router.post("/purchase", authenticate, validatePurchase, handleValidationErrors, (req, res, next) => {
  const io = req.app.get("io"); // Access io from app
  createPurchase(req, res, next, io);
});

export default router;
