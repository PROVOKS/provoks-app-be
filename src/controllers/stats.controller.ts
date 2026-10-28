import type { Request, Response } from "express";

import { statsService } from "../services/stats.service";
import { asyncHandler } from "../utils/async-handler";

export const statsController = {
  dashboard: asyncHandler(async (_req: Request, res: Response) => {
    const data = await statsService.dashboard();
    res.json({ success: true, message: "OK", data });
  }),
};
