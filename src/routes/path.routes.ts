import { Router } from "express";
import { z } from "zod";

import { pathController } from "../controllers/path.controller";
import { pathCodeController } from "../controllers/path-code.controller";
import { pathMentorController } from "../controllers/path-mentor.controller";
import {
  authenticate,
  authorize,
  bulkDeleteAdminOnly,
  optionalAuth,
} from "../middlewares/auth";
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

pathRoutes.get(
  "/",
  optionalAuth,
  validate({ query: listPathQuerySchema }),
  pathController.list,
);
pathRoutes.get(
  "/:id",
  optionalAuth,
  validate({ params: idParamSchema }),
  pathController.detail,
);

/// alokasi mentor (khusus admin)
pathRoutes.get(
  "/:id/mentors",
  authenticate,
  authorize("ADMIN"),
  validate({ params: idParamSchema }),
  pathMentorController.list,
);
pathRoutes.post(
  "/:id/mentors",
  authenticate,
  authorize("ADMIN"),
  validate({
    params: idParamSchema,
    body: z.object({ userId: z.string().min(1, "userId wajib diisi") }),
  }),
  pathMentorController.add,
);
pathRoutes.delete(
  "/:id/mentors/:userId",
  authenticate,
  authorize("ADMIN"),
  validate({
    params: z.object({
      id: z.string().min(1),
      userId: z.string().min(1),
    }),
  }),
  pathMentorController.remove,
);

/// akses masuk path lewat kode (admin & mentor path terkait)
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
  authorize("ADMIN"),
  bulkDeleteAdminOnly,
  validate({ body: bulkPathSchema }),
  pathController.bulk,
);
pathRoutes.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate({ body: createPathSchema }),
  pathController.create,
);
pathRoutes.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
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
