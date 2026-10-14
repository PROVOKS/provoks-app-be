import { Router } from "express";
import { z } from "zod";

import { blockController } from "../controllers/block.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { idParamSchema } from "../validators/path.schema";
import {
  createBlockSchema,
  reorderBlocksSchema,
  updateBlockSchema,
} from "../validators/block.schema";

export const blockRoutes = Router();

const staff = [authenticate, authorize("ADMIN", "INSTRUCTOR")] as const;

blockRoutes.get(
  "/silabus-part/:silabusPartId",
  validate({
    params: z.object({ silabusPartId: z.string().min(1) }),
  }),
  blockController.list,
);

blockRoutes.post(
  "/",
  ...staff,
  validate({ body: createBlockSchema }),
  blockController.create,
);
blockRoutes.put(
  "/:id",
  ...staff,
  validate({ params: idParamSchema, body: updateBlockSchema }),
  blockController.update,
);
blockRoutes.delete(
  "/:id",
  ...staff,
  validate({ params: idParamSchema }),
  blockController.remove,
);
blockRoutes.put(
  "/reorder",
  ...staff,
  validate({ body: reorderBlocksSchema }),
  blockController.reorder,
);
