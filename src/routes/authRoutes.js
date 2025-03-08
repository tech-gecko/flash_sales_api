import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { validateLogin, validateRegister } from "../middleware/authValidator.js";
import { handleValidationErrors } from "../middleware/validationErrorHandler.js";

const router = Router();

router.post("/register", validateRegister, handleValidationErrors, registerUser);
router.post("/login", validateLogin, handleValidationErrors, loginUser);

export default router;
