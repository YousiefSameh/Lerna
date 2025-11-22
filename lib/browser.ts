import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function getBrowser() {
  const viewport = {
    deviceScaleFactor: 1,
    hasTouch: false,
    height: 1080,
    isLandscape: true,
    isMobile: false,
    width: 1920,
  };
  const browser = await puppeteer.launch({
    args: puppeteer.defaultArgs({ args: chromium.args, headless: true }),
    defaultViewport: viewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  return browser;
}
