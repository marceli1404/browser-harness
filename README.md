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
