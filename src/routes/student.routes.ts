import { Router } from "express";

import { studentController } from "../controllers/student.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  importCsvSchema,
  listPathRequestQuerySchema,
  listStudentQuerySchema,
  reviewPathRequestSchema,
  studentIdParamSchema,
} from "../validators/student.schema";

export const studentRoutes = Router();

const staff = [authenticate, authorize("ADMIN", "INSTRUCTOR")] as const;

studentRoutes.get(
  "/",
  ...staff,
  validate({ query: listStudentQuerySchema }),
  studentController.list,
);

studentRoutes.post(
  "/import/preview",
  ...staff,
  validate({ body: importCsvSchema }),
  studentController.previewImport,
);

studentRoutes.post(
  "/import",
  ...staff,
  validate({ body: importCsvSchema }),
  studentController.import,
);

/// permintaan masuk path (butuh approval admin/instruktur)
studentRoutes.get(
  "/path-requests",
  ...staff,
  validate({ query: listPathRequestQuerySchema }),
  studentController.pathRequests,
);

studentRoutes.patch(
  "/path-requests/:id",
  ...staff,
  validate({ params: studentIdParamSchema, body: reviewPathRequestSchema }),
  studentController.reviewPathRequest,
);
