import { Router } from "express";

import { tagController } from "../controllers/tag.controller";
import { authenticate, authorize, bulkDeleteAdminOnly } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { bulkTagSchema } from "../validators/bulk.schema";
import { idParamSchema } from "../validators/path.schema";
import {
  createTagSchema,
  listTagQuerySchema,
  updateTagSchema,
} from "../validators/tag.schema";

export const tagRoutes = Router();

tagRoutes.get("/", validate({ query: listTagQuerySchema }), tagController.list);
tagRoutes.get("/:id", validate({ params: idParamSchema }), tagController.detail);
tagRoutes.post(
  "/bulk",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  bulkDeleteAdminOnly,
  validate({ body: bulkTagSchema }),
  tagController.bulk,
);
tagRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validate({ body: createTagSchema }),
  tagController.create,
);
tagRoutes.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validate({ params: idParamSchema, body: updateTagSchema }),
  tagController.update,
);
tagRoutes.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate({ params: idParamSchema }),
  tagController.remove,
);
