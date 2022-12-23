import { Router } from "express";
import { getUSer } from "../controllers/userControllers.js";
import { tokenValidation } from "../middlewares/tokenValidation.middleware.js";

const router = Router();

router.get("/users/me", tokenValidation, getUSer);

export default router;