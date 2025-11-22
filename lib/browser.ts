import chromium from "@sparticuz/chromium-min";
import puppeteerCore, { Browser } from "puppeteer-core";
import puppeteer from "puppeteer";
import { env } from "./env";

let browser: Browser;
const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

export async function getBrowser() {
  if (browser) return browser;

  if (env.NODE_ENV === "production") {
    browser = await puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(remoteExecutablePath),
      headless: true,
    });
  } else {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", " --disable-setuid-sandbox"],
      headless: true,
    });
  }
  return browser;
}
