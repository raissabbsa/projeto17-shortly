import { Router } from "express";
import { getRanking, getUser } from "../controllers/userControllers.js";
import { tokenValidation } from "../middlewares/tokenValidation.middleware.js";

const router = Router();

router.get("/users/me", tokenValidation, getUser);
router.get("/ranking", getRanking);

export default router;