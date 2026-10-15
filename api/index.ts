import { createApp } from "../src/app";

/**
 * Entry point serverless untuk Vercel.
 *
 * `src/server.ts` memakai app.listen() dan TIDAK dipakai di sini — di Vercel
 * tidak ada proses yang hidup terus; setiap request memanggil handler ini.
 * Graceful shutdown (SIGTERM/SIGINT) juga tidak berlaku.
 */
const app = createApp();

export default app;
