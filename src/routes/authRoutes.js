import { Router } from "express";
import { signin, signup } from "../controllers/authController.js";
import { signupValidation, signinValidation} from "../middlewares/authValidation.middleware.js";

const router = Router();

router.post("/signup", signupValidation, signup);
router.post("/signin", signinValidation, signin);

export default router;