import { Router } from "express";
import { z } from "zod";

import { courseController } from "../controllers/course.controller";
import {
  authenticate,
  authorize,
  bulkDeleteAdminOnly,
  optionalAuth,
} from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { bulkCourseSchema } from "../validators/bulk.schema";
import {
  createCourseSchema,
  listCourseQuerySchema,
  updateCourseSchema,
} from "../validators/course.schema";
import { idParamSchema } from "../validators/path.schema";

export const courseRoutes = Router();

courseRoutes.get(
  "/",
  optionalAuth,
  validate({ query: listCourseQuerySchema }),
  courseController.list,
);
courseRoutes.get(
  "/slug/:slug",
  optionalAuth,
  validate({ params: z.object({ slug: z.string().min(1) }) }),
  courseController.detailBySlug,
);
courseRoutes.get(
  "/:id",
  optionalAuth,
  validate({ params: idParamSchema }),
  courseController.detail,
);
courseRoutes.post(
  "/bulk",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  bulkDeleteAdminOnly,
  validate({ body: bulkCourseSchema }),
  courseController.bulk,
);
courseRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validate({ body: createCourseSchema }),
  courseController.create,
);
courseRoutes.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validate({ params: idParamSchema, body: updateCourseSchema }),
  courseController.update,
);
courseRoutes.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate({ params: idParamSchema }),
  courseController.remove,
);
