import { Router } from "express";
import { posturl } from "../controllers/userControllers.js";
import { posturlValidation } from "../middlewares/userValidation.middleware.js";


const router = Router();

router.post("/urls/shorten", posturlValidation, posturl);

export default router;