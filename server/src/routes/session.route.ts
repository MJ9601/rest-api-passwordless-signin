import express, { Request, Response } from "express";
import { verifyUserEmailHandler } from "../controllers/session.controller";
import reqValidation from "../middlewares/requestValidation";
import { verifyUserWithLinkSchema } from "../schemas/user.schema";

const router = express.Router();


router.get("/api/auth", reqValidation(verifyUserWithLinkSchema), verifyUserEmailHandler)

export default router;
