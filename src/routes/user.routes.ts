import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  importCsvSchema,
  listPathRequestQuerySchema,
  listUserQuerySchema,
  reviewPathRequestSchema,
  updateUserSchema,
  userIdParamSchema,
} from "../validators/user.schema";

export const userRoutes = Router();

const staff = [authenticate, authorize("ADMIN", "INSTRUCTOR")] as const;

userRoutes.get(
  "/",
  ...staff,
  validate({ query: listUserQuerySchema }),
  userController.list,
);

/// import siswa dari CSV (khusus role STUDENT)
userRoutes.post(
  "/import/preview",
  ...staff,
  validate({ body: importCsvSchema }),
  userController.previewImport,
);

userRoutes.post(
  "/import",
  ...staff,
  validate({ body: importCsvSchema }),
  userController.import,
);

/// permintaan masuk path (butuh approval admin/instruktur)
userRoutes.get(
  "/path-requests",
  ...staff,
  validate({ query: listPathRequestQuerySchema }),
  userController.pathRequests,
);

userRoutes.patch(
  "/path-requests/:id",
  ...staff,
  validate({ params: userIdParamSchema, body: reviewPathRequestSchema }),
  userController.reviewPathRequest,
);

userRoutes.put(
  "/:id",
  ...staff,
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  userController.update,
);

userRoutes.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate({ params: userIdParamSchema }),
  userController.remove,
);
