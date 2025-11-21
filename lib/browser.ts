import chromium from 'playwright-aws-lambda';
import { Browser } from 'playwright-core';

export async function getBrowser(): Promise<Browser> {
  return await chromium.launchChromium({
    headless: true,
  });
}
