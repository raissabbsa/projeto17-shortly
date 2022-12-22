import { Router } from "express";
import { posturl, geturlsId, geturlsOpen, deleteurl } from "../controllers/urlControllers.js";
import { tokenValidation } from "../middlewares/urlValidation.middleware.js";

const router = Router();

router.post("/urls/shorten", tokenValidation, posturl);
router.get("/urls/:id", geturlsId);
router.get("/urls/open/:shortUrl", geturlsOpen);
router.delete("/urls/:id", tokenValidation, deleteurl);

export default router;