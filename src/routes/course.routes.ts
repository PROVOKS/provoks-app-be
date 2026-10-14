import { Router } from "express";

import { courseController } from "../controllers/course.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  createCourseSchema,
  listCourseQuerySchema,
  updateCourseSchema,
} from "../validators/course.schema";
import { idParamSchema } from "../validators/path.schema";

export const courseRoutes = Router();

courseRoutes.get("/", validate({ query: listCourseQuerySchema }), courseController.list);
courseRoutes.get("/:id", validate({ params: idParamSchema }), courseController.detail);
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
