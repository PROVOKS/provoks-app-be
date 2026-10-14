import { Router } from "express";

import { authRoutes } from "./auth.routes";
import { blockRoutes } from "./block.routes";
import { courseRoutes } from "./course.routes";
import { learningRoutes } from "./learning.routes";
import { pathRoutes } from "./path.routes";
import { quizRoutes } from "./quiz.routes";
import { silabusRoutes } from "./silabus.routes";
import { tagRoutes } from "./tag.routes";
import { uploadRoutes } from "./upload.routes";
import { userRoutes } from "./user.routes";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/paths", pathRoutes);
router.use("/tags", tagRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/silabus", silabusRoutes);
router.use("/blocks", blockRoutes);
router.use("/quiz", quizRoutes);
router.use("/learning", learningRoutes);
router.use("/uploads", uploadRoutes);
