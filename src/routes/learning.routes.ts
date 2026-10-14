import { Router } from "express";

import { learningController } from "../controllers/learning.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  attemptIdParamSchema,
  blockIdParamSchema,
  slugParamSchema,
  submitQuizSchema,
  updateProgressSchema,
} from "../validators/learning.schema";
import { requestPathSchema } from "../validators/student.schema";

export const learningRoutes = Router();

const student = [authenticate, authorize("STUDENT")] as const;

learningRoutes.get(
  "/my-courses",
  ...student,
  learningController.myCourses,
);

learningRoutes.get("/paths", ...student, learningController.myPaths);

learningRoutes.post(
  "/paths/request",
  ...student,
  validate({ body: requestPathSchema }),
  learningController.requestPath,
);

learningRoutes.get(
  "/courses/:slug",
  ...student,
  validate({ params: slugParamSchema }),
  learningController.course,
);

learningRoutes.post(
  "/progress",
  ...student,
  validate({ body: updateProgressSchema }),
  learningController.updateProgress,
);

learningRoutes.get(
  "/quiz/attempts/:id",
  ...student,
  validate({ params: attemptIdParamSchema }),
  learningController.attempt,
);

learningRoutes.get(
  "/quiz/:blockId",
  ...student,
  validate({ params: blockIdParamSchema }),
  learningController.quiz,
);

learningRoutes.post(
  "/quiz/:blockId/submit",
  ...student,
  validate({ params: blockIdParamSchema, body: submitQuizSchema }),
  learningController.submitQuiz,
);
