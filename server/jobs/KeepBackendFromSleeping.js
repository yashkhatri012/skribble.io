

import cron from "node-cron";

export function startKeepAliveJob() {
  cron.schedule("*/13 * * * *", () => {
    console.log("Keep alive cron executed:", new Date());
  });
}