import { Router } from "express";

import {
  uploadController,
  uploadMiddleware,
} from "../controllers/upload.controller";
import { authenticate, authorize } from "../middlewares/auth";

export const uploadRoutes = Router();

uploadRoutes.get("/config", authenticate, uploadController.config);

/// tanda tangan direct-upload (file dikirim browser langsung ke Cloudinary)
uploadRoutes.post(
  "/signature",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  uploadController.signature,
);

uploadRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  uploadMiddleware.single("file"),
  uploadController.single,
);
