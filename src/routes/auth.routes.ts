import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { googleLoginSchema, loginSchema, registerSchema } from "../validators/auth.schema";

export const authRoutes = Router();

authRoutes.post("/register", validate({ body: registerSchema }), authController.register);
authRoutes.post("/login", validate({ body: loginSchema }), authController.login);
authRoutes.post(
  "/google",
  validate({ body: googleLoginSchema }),
  authController.google,
);
authRoutes.post("/logout", authController.logout);
authRoutes.get("/me", authenticate, authController.me);
