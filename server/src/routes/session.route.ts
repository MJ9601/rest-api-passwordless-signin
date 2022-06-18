import express, { Request, Response } from "express";
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
  updateUserPassHandler,
  verifyUserEmailHandler,
} from "../controllers/session.controller";
import reqValidation from "../middlewares/requestValidation";
import requiredUser from "../middlewares/requiredUser";
import { createSessionWithPassSchema } from "../schemas/session.schema";
import {
  changeUserPassSchema,
  verifyUserWithLinkSchema,
} from "../schemas/user.schema";

const router = express.Router();

router.get(
  "/api/auth",
  reqValidation(verifyUserWithLinkSchema),
  verifyUserEmailHandler
);

router.post(
  "/api/auth",
  reqValidation(changeUserPassSchema),
  updateUserPassHandler
);

router.post(
  "/api/sessions",
  reqValidation(createSessionWithPassSchema),
  createSessionHandler
);
router.delete("/api/sessions", requiredUser, deleteSessionHandler);

router.get("/api/sessions", requiredUser, getUserSessionsHandler);

export default router;
