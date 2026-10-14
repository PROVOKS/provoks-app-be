import { Router } from "express";

import { silabusController } from "../controllers/silabus.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { idParamSchema } from "../validators/path.schema";
import {
  createCoursePartSchema,
  createSilabusPartSchema,
  reorderSchema,
  updateCoursePartSchema,
  updateSilabusPartSchema,
} from "../validators/silabus.schema";

export const silabusRoutes = Router();

const staff = [authenticate, authorize("ADMIN", "INSTRUCTOR")] as const;

// course_parts
silabusRoutes.post(
  "/course-parts",
  ...staff,
  validate({ body: createCoursePartSchema }),
  silabusController.createCoursePart,
);
silabusRoutes.put(
  "/course-parts/:id",
  ...staff,
  validate({ params: idParamSchema, body: updateCoursePartSchema }),
  silabusController.updateCoursePart,
);
silabusRoutes.delete(
  "/course-parts/:id",
  ...staff,
  validate({ params: idParamSchema }),
  silabusController.removeCoursePart,
);

// silabus_parts
silabusRoutes.post(
  "/silabus-parts",
  ...staff,
  validate({ body: createSilabusPartSchema }),
  silabusController.createSilabusPart,
);
silabusRoutes.put(
  "/silabus-parts/:id",
  ...staff,
  validate({ params: idParamSchema, body: updateSilabusPartSchema }),
  silabusController.updateSilabusPart,
);
silabusRoutes.delete(
  "/silabus-parts/:id",
  ...staff,
  validate({ params: idParamSchema }),
  silabusController.removeSilabusPart,
);

silabusRoutes.put(
  "/reorder",
  ...staff,
  validate({ body: reorderSchema }),
  silabusController.reorder,
);
