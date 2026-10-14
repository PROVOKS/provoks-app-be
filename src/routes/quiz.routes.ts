import { Router } from "express";

import { quizController } from "../controllers/quiz.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { idParamSchema } from "../validators/path.schema";
import {
  blockIdParamSchema,
  createQuestionSchema,
  importQuizSchema,
  updateQuestionSchema,
} from "../validators/quiz.schema";

export const quizRoutes = Router();

const staff = [authenticate, authorize("ADMIN", "INSTRUCTOR")] as const;

quizRoutes.get(
  "/blocks/:blockId/questions",
  validate({ params: blockIdParamSchema }),
  quizController.list,
);

quizRoutes.post(
  "/questions",
  ...staff,
  validate({ body: createQuestionSchema }),
  quizController.create,
);
quizRoutes.put(
  "/questions/:id",
  ...staff,
  validate({ params: idParamSchema, body: updateQuestionSchema }),
  quizController.update,
);
quizRoutes.delete(
  "/questions/:id",
  ...staff,
  validate({ params: idParamSchema }),
  quizController.remove,
);

quizRoutes.post(
  "/blocks/:blockId/import",
  ...staff,
  validate({ params: blockIdParamSchema, body: importQuizSchema }),
  quizController.importJson,
);
