import { Router } from "express";
import getLeaderboard from "../controllers/leaderboardController.js";
import { validateLeaderboard } from "../middleware/leaderboardValidator.js";
import { handleValidationErrors } from "../middleware/validationErrorHandler.js";

const router = Router();

router.get("/", validateLeaderboard, handleValidationErrors, getLeaderboard);

export default router;
