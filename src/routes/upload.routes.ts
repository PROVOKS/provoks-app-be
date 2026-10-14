import { Router } from "express";

import {
  uploadController,
  uploadMiddleware,
} from "../controllers/upload.controller";
import { authenticate, authorize } from "../middlewares/auth";

export const uploadRoutes = Router();

uploadRoutes.get("/config", authenticate, uploadController.config);
uploadRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  uploadMiddleware.single("file"),
  uploadController.single,
);
