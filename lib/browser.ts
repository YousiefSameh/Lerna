import chromium from "@sparticuz/chromium";
import { chromium as playwrightChromium } from "playwright-core";

export async function getBrowser() {
  const executablePath = await chromium.executablePath();
  const browser = await playwrightChromium.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });
  return browser;
}
