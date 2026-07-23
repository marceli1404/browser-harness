# Browser Harness

A lightweight, zero-config browser automation tool built on Puppeteer. Navigate pages, take screenshots, extract text, fill forms, run JavaScript, and more — all from the command line.

## Feature Tree

```
browser-harness/
├── Navigation
│   ├── open <url>                 Navigate and print title
│   ├── text <url>                 Extract page text
│   ├── fill <url> <sel> <val>     Fill input and submit
│   ├── exec <url> <js>            Run JavaScript in page
│   ├── download <url>             Save page HTML
│   ├── cookies <url>              Get page cookies
│   ├── headers <url>              Get meta tags
│   └── tabs <url1> <url2> ...     Open multiple tabs
│
├── Screenshots
│   ├── screenshot <url>           Full-page screenshot
│   ├── viewport <url> [WxH]       Custom resolution
│   ├── element <url> <sel>        Screenshot element
│   ├── clip <url> {x,y,w,h}      Clipped region
│   ├── compare <url1> <url2>      Side-by-side
│   ├── pdf <url>                  Save as PDF
│   └── multi-shot <url> [n] [ms]  Timed series
│
├── Mouse Emulation
│   ├── move <url> x1 y1 x2 y2    Bezier curve movement
│   ├── click <url> x y [btn]      Click at coordinates
│   ├── double-click <url> x y     Double-click
│   ├── right-click <url> x y      Right-click
│   ├── drag <url> x1 y1 x2 y2    Drag with bezier path
│   ├── hover <url> x y [ms]       Hold position
│   ├── scroll <url> x y dx dy     Mouse wheel
│   ├── path <url> x1,y1 x2,y2    Multiple waypoints
│   └── wiggle <url> x y [r] [ms]  Human-like idle
│
└── Programmatic API
    ├── launchBrowser(headless, viewport)
    ├── nav, getText, fillAndSubmit, execScript
    ├── downloadPage, cookies, headers
    ├── mouseMove, mouseClick, mouseDoubleClick
    ├── mouseRightClick, mouseDrag, mouseHover
    ├── mouseScroll, mousePath, mouseWiggle
    ├── screenshotViewport, screenshotFullPage
    ├── screenshotClip, screenshotElement
    ├── screenshotPdf, screenshotMultiple
    └── screenshotCompare
```

## Installation

### Prerequisites

- Node.js 18+ (tested on Windows, macOS, Linux)
- npm or yarn

### Quick Start

```bash
git clone https://github.com/marceli1404/browser-harness.git
cd browser-harness
npm install
```

### Global Install (optional)

```bash
npm link
browser-harness open https://example.com
```

## Usage

```bash
node browser.js <command> [args]
```

### Commands

**Navigation:**
| Command | Description | Example |
|---------|-------------|---------|
| `open <url>` | Navigate and print title | `node browser.js open https://google.com` |
| `text <url>` | Extract page text content | `node browser.js text https://example.com` |
| `fill <url> <sel> <val>` | Fill input and submit | `node browser.js fill https://google.com '[name=q]' 'search term'` |
| `exec <url> <js>` | Run JavaScript in page | `node browser.js exec https://example.com 'document.title'` |
| `download <url> [file]` | Save page HTML | `node browser.js download https://example.com page.html` |
| `cookies <url>` | Get page cookies | `node browser.js cookies https://example.com` |
| `headers <url>` | Get meta tags | `node browser.js headers https://example.com` |
| `tabs <url1> <url2> ...` | Open multiple tabs | `node browser.js tabs https://google.com https://github.com` |

**Screenshots:**
| Command | Description | Example |
|---------|-------------|---------|
| `screenshot <url> [file]` | Full-page screenshot | `node browser.js screenshot https://google.com full.png` |
| `viewport <url> [file] [WxH]` | Viewport screenshot | `node browser.js viewport https://google.com mobile.png 375x667` |
| `element <url> [file] <sel>` | Screenshot element | `node browser.js element https://google.com logo.png '#logo'` |
| `clip <url> [file] {x,y,w,h}` | Clipped screenshot | `node browser.js clip https://google.com part.png '{"x":0,"y":0,"width":500,"height":500}'` |
| `compare <url1> <url2>` | Compare two pages | `node browser.js compare https://google.com https://bing.com` |
| `pdf <url> [file]` | Save as PDF | `node browser.js pdf https://example.com page.pdf` |
| `multi-shot <url> [count] [ms]` | Multiple screenshots | `node browser.js multi-shot https://google.com 5 2000` |

**Mouse Emulation:**
| Command | Description | Example |
|---------|-------------|---------|
| `move <url> x1 y1 x2 y2 [steps]` | Move mouse (bezier curve) | `node browser.js move https://google.com 100 100 500 300` |
| `click <url> x y [button]` | Click at coordinates | `node browser.js click https://google.com 400 300 left` |
| `double-click <url> x y` | Double-click | `node browser.js double-click https://google.com 400 300` |
| `right-click <url> x y` | Right-click | `node browser.js right-click https://google.com 400 300` |
| `drag <url> x1 y1 x2 y2` | Drag element | `node browser.js drag https://google.com 100 100 500 300` |
| `hover <url> x y [ms]` | Hover at point | `node browser.js hover https://google.com 400 300 2000` |
| `scroll <url> x y dx dy` | Scroll at point | `node browser.js scroll https://google.com 400 300 0 500` |
| `path <url> x1,y1 x2,y2 ...` | Move through points | `node browser.js path https://google.com 100,100 200,200 300,100` |
| `wiggle <url> x y [radius] [ms]` | Wiggle around point | `node browser.js wiggle https://google.com 400 300 20 2000` |

### Programmatic Usage

```javascript
const {
  launchBrowser,
  nav,
  getText,
  fillAndSubmit,
  execScript,
  downloadPage,
  cookies,
  headers,
  mouseMove,
  mouseClick,
  mouseDoubleClick,
  mouseRightClick,
  mouseDrag,
  mouseHover,
  mouseScroll,
  mousePath,
  mouseWiggle,
  screenshotViewport,
  screenshotFullPage,
  screenshotClip,
  screenshotElement,
  screenshotPdf,
  screenshotMultiple,
  screenshotCompare,
} = require('./browser');

// Screenshot examples
await screenshotFullPage('https://example.com', 'full.png');
await screenshotViewport('https://example.com', 'mobile.png', { width: 375, height: 667 });
await screenshotElement('https://example.com', 'logo.png', '#logo');
await screenshotClip('https://example.com', 'part.png', { x: 0, y: 0, width: 500, height: 500 });
await screenshotPdf('https://example.com', 'page.pdf');
await screenshotMultiple('https://example.com', 5, 2000);
await screenshotCompare('https://google.com', 'https://bing.com');

// Mouse emulation examples
await mouseMove('https://example.com', 100, 100, 500, 300, { steps: 30 });
await mouseClick('https://example.com', 400, 300, { button: 'left' });
await mouseDoubleClick('https://example.com', 400, 300);
await mouseRightClick('https://example.com', 400, 300);
await mouseDrag('https://example.com', 100, 100, 500, 300);
await mouseHover('https://example.com', 400, 300, { duration: 2000 });
await mouseScroll('https://example.com', 400, 300, 0, 500);
await mousePath('https://example.com', [{x:100,y:100}, {x:200,y:200}, {x:300,y:100}]);
await mouseWiggle('https://example.com', 400, 300, { radius: 20, duration: 2000 });

// Navigation
await nav('https://example.com');
const text = await getText('https://example.com');
await fillAndSubmit('https://google.com', '[name=q]', 'search term');
await execScript('https://example.com', 'document.title');
```

## AI Integration

Give your AI agent the ability to browse the web, take screenshots, extract data, and interact with websites.

### Method 1: System Prompt (Claude, ChatGPT, Cursor)

Add this to your AI's system prompt or project instructions:

```
You have access to a browser automation tool. Use it to browse websites, 
take screenshots, extract data, and fill forms.

Available commands:
- node browser.js open <url> — Navigate to a URL and get the title
- node browser.js screenshot <url> — Save a full-page screenshot
- node browser.js text <url> — Extract all visible text from a page
- node browser.js fill <url> <selector> <value> — Fill a form input and submit
- node browser.js exec <url> <javascript> — Run JavaScript in the page
- node browser.js download <url> — Save the page HTML
- node browser.js pdf <url> — Save the page as PDF
- node browser.js cookies <url> — Get page cookies
- node browser.js headers <url> — Get meta tags

Always use the full path: node /path/to/browser.js <command>

Examples:
- "What's on the homepage of example.com?" → node browser.js text https://example.com
- "Take a screenshot of google.com" → node browser.js screenshot https://example.com google.png
- "Search Google for 'news'" → node browser.js fill https://google.com '[name=q]' 'news'
- "Extract all links from a page" → node browser.js exec https://example.com 'JSON.stringify(Array.from(document.querySelectorAll("a")).map(a => ({text: a.textContent, href: a.href})))'
```

### Method 2: MCP Server (Claude Desktop, Cursor)

Create an MCP server that wraps the browser commands:

```javascript
// mcp-browser.js
const { spawn } = require('child_process');
const path = require('path');

const BROWSER_PATH = path.join(__dirname, 'browser.js');

const server = {
  name: 'browser-harness',
  tools: [
    {
      name: 'browser_open',
      description: 'Navigate to a URL and return the page title',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'URL to navigate to' }
        },
        required: ['url']
      }
    },
    {
      name: 'browser_screenshot',
      description: 'Take a full-page screenshot of a URL',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'URL to screenshot' },
          filename: { type: 'string', description: 'Output filename' }
        },
        required: ['url']
      }
    },
    {
      name: 'browser_text',
      description: 'Extract all visible text from a page',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'URL to extract text from' }
        },
        required: ['url']
      }
    },
    {
      name: 'browser_fill',
      description: 'Fill a form input and submit',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'URL with the form' },
          selector: { type: 'string', description: 'CSS selector for input' },
          value: { type: 'string', description: 'Value to type' }
        },
        required: ['url', 'selector', 'value']
      }
    },
    {
      name: 'browser_exec',
      description: 'Execute JavaScript in the page context',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'URL to run JS on' },
          script: { type: 'string', description: 'JavaScript to execute' }
        },
        required: ['url', 'script']
      }
    }
  ],
  async execute(tool, args) {
    const command = {
      browser_open: 'open',
      browser_screenshot: 'screenshot',
      browser_text: 'text',
      browser_fill: 'fill',
      browser_exec: 'exec'
    }[tool];

    const argsList = [command, args.url];
    if (args.filename) argsList.push(args.filename);
    if (args.selector) argsList.push(args.selector, args.value);
    if (args.script) argsList.push(args.script);

    return new Promise((resolve, reject) => {
      const proc = spawn('node', [BROWSER_PATH, ...argsList]);
      let stdout = '';
      let stderr = '';
      proc.stdout.on('data', d => stdout += d);
      proc.stderr.on('data', d => stderr += d);
      proc.on('close', code => {
        resolve({
          content: [{ type: 'text', text: stdout || stderr }],
          isError: code !== 0
        });
      });
    });
  }
};
```

Add to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["/path/to/mcp-browser.js"]
    }
  }
}
```

### Method 3: OpenAI Function Calling

Define functions for the AI to call:

```json
{
  "functions": [
    {
      "name": "browse_website",
      "description": "Navigate to a website and extract information",
      "parameters": {
        "type": "object",
        "properties": {
          "url": { "type": "string" },
          "action": { 
            "type": "string",
            "enum": ["open", "screenshot", "text", "cookies", "headers"]
          }
        },
        "required": ["url", "action"]
      }
    },
    {
      "name": "fill_form",
      "description": "Fill out a web form",
      "parameters": {
        "type": "object",
        "properties": {
          "url": { "type": "string" },
          "selector": { "type": "string" },
          "value": { "type": "string" }
        },
        "required": ["url", "selector", "value"]
      }
    },
    {
      "name": "extract_data",
      "description": "Run JavaScript to extract structured data from a page",
      "parameters": {
        "type": "object",
        "properties": {
          "url": { "type": "string" },
          "script": { "type": "string" }
        },
        "required": ["url", "script"]
      }
    }
  ]
}
```

### Method 4: Custom Agent Wrapper

Create a simple agent that can browse autonomously:

```javascript
// agent.js
const { execSync } = require('child_process');
const path = require('path');

const BROWSER = path.join(__dirname, 'browser.js');

function browse(command, ...args) {
  const cmd = `node "${BROWSER}" ${command} ${args.map(a => `"${a}"`).join(' ')}`;
  console.log(`> ${cmd}`);
  try {
    return execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
  } catch (e) {
    return e.stderr || e.message;
  }
}

// Example: Automated research
async function research(topic) {
  console.log(`Researching: ${topic}\n`);
  
  // Search
  const results = browse('text', `https://www.google.com/search?q=${encodeURIComponent(topic)}`);
  console.log('Search results:\n', results.substring(0, 2000));
  
  // Screenshot
  browse('screenshot', `https://www.google.com/search?q=${encodeURIComponent(topic)}`, 'results.png');
  
  return results;
}

research('latest AI news');
```

### Security for AI Integration

When giving an AI browser access:

1. **Restrict URLs** — Only allow trusted domains
2. **Disable `exec`** — Prevent arbitrary JavaScript execution
3. **Use headless mode** — Set `headless: true` in production
4. **Monitor screenshots** — Review what the AI captures
5. **Log all commands** — Keep an audit trail
6. **Set timeouts** — Prevent infinite loops
7. **Isolate sessions** — Use separate profiles for each AI session

```javascript
// Safer browser launch for AI
async function launchSafeBrowser() {
  return puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });
}
```

### Example AI Workflows

**Research Assistant:**
```
User: "Find the top 3 articles about quantum computing from this week"
AI: 
1. node browser.js text https://news.google.com/search?q=quantum+computing
2. Extract URLs from results
3. node browser.js text <article-url>
4. Summarize findings
```

**Form Automation:**
```
User: "Fill out the contact form on example.com with my info"
AI:
1. node browser.js screenshot https://example.com/contact form.png
2. Analyze form fields from screenshot
3. node browser.js fill https://example.com/contact '#name' 'John Doe'
4. node browser.js fill https://example.com/contact '#email' 'john@example.com'
5. node browser.js screenshot https://example.com/contact filled.png
```

**Data Extraction:**
```
User: "Get all product prices from this page"
AI:
1. node browser.js exec https://shop.example.com/products 'JSON.stringify(Array.from(document.querySelectorAll(".price")).map(el => el.textContent))'
2. Parse and format results
```

## Improvements Over Basic Puppeteer Scripts

### 1. Error Handling
- All commands use `try/finally` to ensure browser closes even on errors
- Prevents orphaned Chrome processes

### 2. Timeouts
- 30-second default timeout for page loads
- Prevents hanging on slow/unresponsive pages

### 3. Organized Output
- Screenshots saved to `screenshots/` directory
- Auto-created directory structure
- Timestamped filenames to prevent overwrites

### 4. Security Defaults
- `--no-sandbox` for containerized environments
- `--no-first-run` to skip setup screens
- `--disable-extensions` for clean browsing

### 5. PDF Generation
- Headless mode for PDF output
- A4 format by default

### 6. Cookie & Header Inspection
- Extract session cookies for API testing
- View meta tags for SEO analysis

### 7. Multi-Tab Support
- Open multiple URLs simultaneously
- Screenshot the last active tab

### 8. Module Export
- All functions exported for programmatic use
- Can be imported into other Node.js projects

## Known Bugs & Limitations

### High Priority

1. **Chrome Process Leaks** — If `browser.close()` fails (e.g., crash), orphaned Chrome processes may remain. Mitigation: check Task Manager or use `taskkill /f /im chrome.exe` on Windows.

2. **No Retry Logic** — Failed page loads don't retry. Network issues cause immediate failure.

3. **Hardcoded Wait in `fill`** — The 2-second wait after form submission is arbitrary. May be too short for slow forms or too long for fast ones.

### Medium Priority

4. **No Proxy Support** — Cannot route through proxies for geo-testing or privacy.

5. **No User Agent Rotation** — Same browser fingerprint every run. May trigger bot detection.

6. **No Cookie Persistence** — Sessions are lost between runs. Cannot maintain login state.

7. **No Request Interception** — Cannot block ads, modify requests, or mock API responses.

8. **No Viewport Configuration** — Fixed viewport size. Cannot test responsive designs at different widths.

### Low Priority

9. **No File Upload Support** — Cannot interact with `<input type="file">` elements.

10. **No Drag & Drop** — Cannot simulate drag and drop interactions.

11. **No iframe Support** — Cannot interact with content inside iframes.

12. **No Shadow DOM** — Cannot pierce shadow DOM boundaries.

13. **No WebSocket Monitoring** — Cannot capture WebSocket frames.

14. **Screenshots May Fail** — Very large pages (10,000+ pixels) may cause memory issues.

15. **No Rate Limiting** — No built-in delay between requests when processing multiple URLs.

## Security Considerations

### Arbitrary Code Execution

The `exec` command runs arbitrary JavaScript in the page context. This is powerful but dangerous:

```bash
# This could steal cookies, redirect pages, or modify content
node browser.js exec https://evil.com 'document.cookie'
```

**Recommendation:** Only run `exec` on trusted URLs. Consider sandboxing if automating untrusted sites.

### Screenshots May Capture Sensitive Data

Screenshots capture everything visible on the page, including:
- Passwords (if visible)
- Personal information
- Financial data

**Recommendation:** Store screenshots securely and delete when no longer needed.

### Cookies Contain Session Tokens

The `cookies` command exposes session tokens that could hijack accounts.

**Recommendation:** Never share cookie output publicly. Treat it like a password.

## Development

### Project Structure

```
browser-harness/
├── browser.js          # Main tool
├── package.json        # Dependencies
├── README.md          # This file
└── screenshots/       # Generated screenshots (gitignored)
```

### Adding New Commands

1. Add function to `browser.js`
2. Export it in `module.exports`
3. Add case to CLI router
4. Update usage text

### Testing

```bash
# Test basic functionality
node browser.js open https://example.com

# Test screenshot
node browser.js screenshot https://example.com test.png

# Test text extraction
node browser.js text https://example.com

# Test JavaScript execution
node browser.js exec https://example.com 'document.title'
```

## Dependencies

- **puppeteer** — Headless Chrome automation
- **dotenv** — Environment variable loading (optional)

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

- [GitHub Issues](https://github.com/marceli1404/browser-harness/issues)
- [Puppeteer Documentation](https://pptr.dev/)
