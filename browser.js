const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function launchBrowser(headless = false) {
  await ensureDir(SCREENSHOTS_DIR);
  return puppeteer.launch({
    headless,
    args: [
      '--remote-debugging-port=9222',
      '--no-first-run',
      '--disable-extensions',
      '--disable-gpu',
      '--no-sandbox',
    ],
  });
}

async function nav(url) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const title = await page.title();
    console.log(`Title: ${title}`);
    console.log(`URL: ${page.url()}`);
    return { title, url: page.url() };
  } finally {
    await browser.close();
  }
}

async function screenshotUrl(url, filename) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const name = filename || `screenshot-${Date.now()}.png`;
    const outPath = path.join(SCREENSHOTS_DIR, name);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Screenshot saved: ${outPath}`);
    console.log(`Title: ${await page.title()}`);
    return outPath;
  } finally {
    await browser.close();
  }
}

async function getText(url) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const text = await page.evaluate(() => document.body.innerText);
    console.log(text);
    return text;
  } finally {
    await browser.close();
  }
}

async function fillAndSubmit(url, selector, value) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.type(selector, value);
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 2000));
    const title = await page.title();
    console.log(`Submitted. Title: ${title}`);
    const name = `form-result-${Date.now()}.png`;
    const outPath = path.join(SCREENSHOTS_DIR, name);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Result screenshot: ${outPath}`);
    return { title, screenshot: outPath };
  } finally {
    await browser.close();
  }
}

async function execScript(url, script) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const result = await page.evaluate(script);
    console.log(JSON.stringify(result, null, 2));
    return result;
  } finally {
    await browser.close();
  }
}

async function downloadPage(url, output) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const html = await page.content();
    const name = output || `page-${Date.now()}.html`;
    const outPath = path.join(__dirname, name);
    fs.writeFileSync(outPath, html);
    console.log(`Page saved: ${outPath} (${html.length} bytes)`);
    return outPath;
  } finally {
    await browser.close();
  }
}

async function multiTab(urls) {
  const browser = await launchBrowser();
  try {
    for (const url of urls) {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      console.log(`${url} -> ${await page.title()}`);
    }
    const pages = await browser.pages();
    const name = `multi-tab-${Date.now()}.png`;
    const outPath = path.join(SCREENSHOTS_DIR, name);
    await pages[pages.length - 1].screenshot({ path: outPath, fullPage: true });
    console.log(`Last tab screenshot: ${outPath}`);
    return outPath;
  } finally {
    await browser.close();
  }
}

async function pdf(url, output) {
  const browser = await launchBrowser(true);
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const name = output || `page-${Date.now()}.pdf`;
    const outPath = path.join(__dirname, name);
    await page.pdf({ path: outPath, format: 'A4' });
    console.log(`PDF saved: ${outPath}`);
    return outPath;
  } finally {
    await browser.close();
  }
}

async function cookies(url) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const cookies = await page.cookies();
    console.log(JSON.stringify(cookies, null, 2));
    return cookies;
  } finally {
    await browser.close();
  }
}

async function headers(url) {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const title = await page.title();
    const meta = await page.evaluate(() => {
      const metas = document.querySelectorAll('meta');
      return Array.from(metas).map(m => ({
        name: m.getAttribute('name'),
        content: m.getAttribute('content'),
      }));
    });
    console.log(`Title: ${title}`);
    console.log('Meta tags:');
    meta.forEach(m => console.log(`  ${m.name}: ${m.content}`));
    return { title, meta };
  } finally {
    await browser.close();
  }
}

module.exports = {
  launchBrowser,
  nav,
  screenshotUrl,
  getText,
  fillAndSubmit,
  execScript,
  downloadPage,
  multiTab,
  pdf,
  cookies,
  headers,
};

const [,, command, ...args] = process.argv;

function usage() {
  console.log(`
Usage: node browser.js <command> [args]

Commands:
  open <url>                       Navigate and print title
  screenshot <url> [filename]      Save full-page screenshot
  text <url>                       Extract page text
  fill <url> <selector> <value>    Fill input and submit
  exec <url> <js-expression>       Run JS in page context
  download <url> [filename]        Save page HTML
  pdf <url> [filename]             Save page as PDF
  cookies <url>                    Get page cookies
  headers <url>                    Get page meta tags
  tabs <url1> <url2> ...           Open multiple tabs, screenshot last
`);
}

(async () => {
  try {
    switch (command) {
      case 'open':
        await nav(args[0] || 'https://example.com');
        break;
      case 'screenshot':
        await screenshotUrl(args[0] || 'https://example.com', args[1]);
        break;
      case 'text':
        await getText(args[0] || 'https://example.com');
        break;
      case 'fill':
        await fillAndSubmit(args[0], args[1], args.slice(2).join(' '));
        break;
      case 'exec':
        await execScript(args[0], args.slice(1).join(' '));
        break;
      case 'download':
        await downloadPage(args[0], args[1]);
        break;
      case 'pdf':
        await pdf(args[0], args[1]);
        break;
      case 'cookies':
        await cookies(args[0] || 'https://example.com');
        break;
      case 'headers':
        await headers(args[0] || 'https://example.com');
        break;
      case 'tabs':
        await multiTab(args);
        break;
      default:
        usage();
    }
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
