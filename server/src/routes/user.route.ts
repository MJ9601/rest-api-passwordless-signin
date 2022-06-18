import express, { Request, Response } from "express";
import {
  registerUserWithPassHandler,
  reqForLinkHandler,
} from "../controllers/user.controller";
import reqValidation from "../middlewares/requestValidation";
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

export default router;
