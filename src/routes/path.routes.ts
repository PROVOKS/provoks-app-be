import { Router } from "express";

import { pathController } from "../controllers/path.controller";
import { pathCodeController } from "../controllers/path-code.controller";
import { authenticate, authorize, bulkDeleteAdminOnly } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { bulkPathSchema } from "../validators/bulk.schema";
import {
  generateJoinCodeSchema,
  pathCodeParamSchema,
} from "../validators/path-code.schema";
import {
  createPathSchema,
  idParamSchema,
  listPathQuerySchema,
  updatePathSchema,
} from "../validators/path.schema";

export const pathRoutes = Router();

pathRoutes.get("/", validate({ query: listPathQuerySchema }), pathController.list);
pathRoutes.get("/:id", validate({ params: idParamSchema }), pathController.detail);

/// akses masuk path lewat kode
pathRoutes.get(
  "/:id/codes",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validate({ params: idParamSchema }),
  pathCodeController.list,
);
pathRoutes.post(
  "/:id/codes",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validate({ params: idParamSchema, body: generateJoinCodeSchema }),
  pathCodeController.generate,
);
pathRoutes.patch(
  "/:id/codes/:codeId/revoke",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validate({ params: pathCodeParamSchema }),
  pathCodeController.revoke,
);

pathRoutes.post(
  "/bulk",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  bulkDeleteAdminOnly,
  validate({ body: bulkPathSchema }),
  pathController.bulk,
);
pathRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validate({ body: createPathSchema }),
  pathController.create,
);
pathRoutes.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "INSTRUCTOR"),
  validate({ params: idParamSchema, body: updatePathSchema }),
  pathController.update,
);
pathRoutes.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate({ params: idParamSchema }),
  pathController.remove,
);
