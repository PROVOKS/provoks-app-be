import { Router } from "express";

import { statsController } from "../controllers/stats.controller";
import { authenticate, authorize } from "../middlewares/auth";

export const statsRoutes = Router();

statsRoutes.get(
  "/",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  statsController.dashboard,
);
