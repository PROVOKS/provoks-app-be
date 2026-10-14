import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./db/prisma";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(
    `🚀 Provoks LMS API listening on http://localhost:${env.PORT}${env.API_PREFIX}`,
  );
});

async function shutdown(signal: string) {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});
