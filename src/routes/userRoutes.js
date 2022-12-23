import { Router } from "express";
import { getRanking, getUSer } from "../controllers/userControllers.js";
import { tokenValidation } from "../middlewares/tokenValidation.middleware.js";

const router = Router();

router.get("/users/me", tokenValidation, getUSer);
router.get("/ranking", getRanking);

export default router;