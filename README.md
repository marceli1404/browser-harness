# Browser Harness

A lightweight, zero-config browser automation tool built on Puppeteer. Navigate pages, take screenshots, extract text, fill forms, run JavaScript, and more — all from the command line.

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

| Command | Description | Example |
|---------|-------------|---------|
| `open <url>` | Navigate and print title | `node browser.js open https://google.com` |
| `screenshot <url> [file]` | Save full-page screenshot | `node browser.js screenshot https://google.com google.png` |
| `text <url>` | Extract page text content | `node browser.js text https://example.com` |
| `fill <url> <sel> <val>` | Fill input and submit | `node browser.js fill https://google.com '[name=q]' 'search term'` |
| `exec <url> <js>` | Run JavaScript in page | `node browser.js exec https://example.com 'document.title'` |
| `download <url> [file]` | Save page HTML | `node browser.js download https://example.com page.html` |
| `pdf <url> [file]` | Save page as PDF | `node browser.js pdf https://example.com page.pdf` |
| `cookies <url>` | Get page cookies | `node browser.js cookies https://example.com` |
| `headers <url>` | Get meta tags | `node browser.js headers https://example.com` |
| `tabs <url1> <url2> ...` | Open multiple tabs | `node browser.js tabs https://google.com https://github.com` |

### Programmatic Usage

```javascript
const {
  launchBrowser,
  nav,
  screenshotUrl,
  getText,
  fillAndSubmit,
  execScript,
  downloadPage,
  pdf,
  cookies,
  headers,
} = require('./browser');

// Example: Take a screenshot
const screenshot = await screenshotUrl('https://example.com', 'example.png');

// Example: Extract text
const text = await getText('https://example.com');

// Example: Run custom JavaScript
const result = await execScript('https://example.com', `
  Array.from(document.querySelectorAll('a')).map(a => a.href)
`);
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
