import express, { Response } from "express";
import sessionRoutes from "./session.route";
import userRoutes from "./user.route";

const router = express.Router();

router.get("/", (_, res: Response) =>
  res.status(200).send("server is running Correctly!")
);

router.use(userRoutes);
router.use(sessionRoutes);

export default router;
