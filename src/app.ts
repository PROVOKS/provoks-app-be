import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { router } from "./routes";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      message: "Provoks LMS API is running",
      data: { uptime: process.uptime(), env: env.NODE_ENV },
    });
  });

  app.use(env.API_PREFIX, router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

/**
 * Vercel mendeteksi file ini sebagai entry point Express (zero-config) dan
 * membutuhkan default export. Server lokal (src/server.ts) tetap memakai
 * createApp() supaya bisa mengatur listen + graceful shutdown sendiri.
 */
export default createApp();
