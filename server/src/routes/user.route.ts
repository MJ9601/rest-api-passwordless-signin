import express, { Request, Response } from "express";
import {
  getMe,
  registerUserWithPassHandler,
  reqForLinkHandler,
} from "../controllers/user.controller";
import reqValidation from "../middlewares/requestValidation";
import requiredUser from "../middlewares/requiredUser";
import {
  createUserWithPassSchema,
  reqForLoginLinkSchema,
} from "../schemas/user.schema";

const router = express.Router();

router.post(
  "/api/users",
  reqValidation(createUserWithPassSchema),
  registerUserWithPassHandler
);
router.put(
  "/api/users",
  reqValidation(reqForLoginLinkSchema),
  reqForLinkHandler
);

router.get("/api/users/me", requiredUser, getMe);
export default router;
