const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const path = require('node:path');

async function withServer(handler, fn) {
  const server = http.createServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const { port } = server.address();
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

function runCli(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(__dirname, '..', 'browser.js'), ...args], {
      env: { ...process.env, BROWSER_HARNESS_HEADLESS: '1' },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', code => resolve({ code, stdout, stderr }));
  });
}

test('open loads a local page without external network access', async () => {
  await withServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html><title>Harness fixture</title><p>ok</p>');
  }, async url => {
    const result = await runCli(['open', url]);
    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /Title: Harness fixture/);
  });
});

test('cookies redacts values unless explicitly requested', async () => {
  await withServer((req, res) => {
    res.setHeader('Set-Cookie', 'session=supersecret; Path=/');
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html><title>Cookie fixture</title>');
  }, async url => {
    const redacted = await runCli(['cookies', url]);
    assert.equal(redacted.code, 0, redacted.stderr);
    assert.match(redacted.stdout, /<redacted>/);
    assert.doesNotMatch(redacted.stdout, /supersecret/);

    const revealed = await runCli(['cookies', url, '--show-values']);
    assert.equal(revealed.code, 0, revealed.stderr);
    assert.match(revealed.stdout, /supersecret/);
  });
});
