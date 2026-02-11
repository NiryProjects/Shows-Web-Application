/**
 * Smoke test — verifies the Express app boots and responds to /api/health.
 *
 * Run: npx ts-node tests/server_smoke.test.ts
 *  or: npx jest tests/server_smoke.test.ts  (once Jest is wired up)
 *
 * This file is intentionally kept simple: no test framework dependency
 * so it can run standalone during the migration period.
 */

import http from "http";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("../app");

const PORT = 0; // OS picks a free port

function smokeTest(): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);

    server.listen(PORT, () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        server.close();
        reject(new Error("Failed to get server address"));
        return;
      }

      const options: http.RequestOptions = {
        hostname: "localhost",
        port: addr.port,
        path: "/api/health",
        method: "GET",
      };

      const req = http.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          server.close();

          if (res.statusCode !== 200) {
            reject(new Error(`Health check failed: status ${res.statusCode}, body: ${body}`));
            return;
          }

          try {
            const data = JSON.parse(body);
            if (data.health) {
              console.log(`✅ Smoke test PASSED — health: "${data.health}"`);
              resolve();
            } else {
              reject(new Error(`Unexpected response: ${body}`));
            }
          } catch (e) {
            reject(new Error(`Invalid JSON response: ${body}`));
          }
        });
      });

      req.on("error", (err) => {
        server.close();
        reject(err);
      });

      req.end();
    });

    server.on("error", reject);
  });
}

smokeTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(`❌ Smoke test FAILED:`, err.message);
    process.exit(1);
  });
