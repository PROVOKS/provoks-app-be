import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  createUserSchema,
  importCsvSchema,
  listPathRequestQuerySchema,
  listUserQuerySchema,
  reviewPathRequestSchema,
  updateUserSchema,
  userIdParamSchema,
} from "../validators/user.schema";
import {
  bulkPathRequestSchema,
  bulkUserSchema,
} from "../validators/bulk.schema";

export const userRoutes = Router();

const staff = [authenticate, authorize("ADMIN", "INSTRUCTOR")] as const;

userRoutes.get(
  "/",
  ...staff,
  validate({ query: listUserQuerySchema }),
  userController.list,
);

/// tambah user manual (sebelum /:id supaya tidak tertangkap sebagai id)
userRoutes.post(
  "/",
  ...staff,
  validate({ body: createUserSchema }),
  userController.create,
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

/// aksi massal (setujui/tolak banyak permintaan sekaligus)
userRoutes.post(
  "/path-requests/bulk",
  ...staff,
  validate({ body: bulkPathRequestSchema }),
  userController.bulkPathRequests,
);

/// aksi massal user (hapus / ubah role) — ADMIN saja
userRoutes.post(
  "/bulk",
  authenticate,
  authorize("ADMIN"),
  validate({ body: bulkUserSchema }),
  userController.bulk,
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
