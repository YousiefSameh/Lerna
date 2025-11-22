import chromium from "@sparticuz/chromium";
import { chromium as playwrightChromium } from "playwright-core";

export async function getBrowser() {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    chromium.setGraphicsMode = false;
    const executablePath = await chromium.executablePath();

    return await playwrightChromium.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });
  }

  return await playwrightChromium.launch({
    headless: true,
  });
}
