import puppeteer, { type Browser } from "puppeteer-core";

// ─── Browser pool ────────────────────────────────────────────────
// Reuse a single browser instance across requests instead of
// cold-launching Chrome every time (~3-5 s saved per request).

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  // Return the existing instance if it's still connected
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  // Production — @sparticuz/chromium (Linux binary for serverless)
  const chromium = await import("@sparticuz/chromium");
  const executablePath = await chromium.default.executablePath();

  browserInstance = await puppeteer.launch({
    args: [
      ...chromium.default.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--no-zygote",
    ],
    executablePath,
    headless: true,
  });

  return browserInstance;
}

/**
 * Generate a PDF from a given URL using headless Chromium.
 * The browser instance is reused across requests for speed.
 */
export async function generateResumePdf(url: string): Promise<Uint8Array> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Block images/fonts/media — we only need the HTML + CSS for the PDF
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (type === "image" || type === "media" || type === "font") {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setViewport({ width: 794, height: 1123 });

    // "domcontentloaded" is much faster than "networkidle0" — the
    // resume page is server-rendered so the DOM is ready immediately.
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 15_000,
    });

    // Small wait for CSS to apply
    await page.evaluate(() => new Promise((r) => setTimeout(r, 200)));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return pdfBuffer;
  } finally {
    await page.close();
  }
}
