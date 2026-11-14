import { spawn } from 'node:child_process';
import http from 'node:http';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];

function isApiHealthy() {
  return new Promise((resolve) => {
    const request = http.get('http://127.0.0.1:4000/api/health', (response) => {
      response.resume();
      resolve(response.statusCode === 200);
    });
    request.on('error', () => resolve(false));
    request.setTimeout(800, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function waitForApi(timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await isApiHealthy()) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

function start(label, command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: process.env
  });
  children.push(child);
  child.on('exit', (code, signal) => {
    if (code && !signal) {
      console.error(`[${label}] stopped with exit code ${code}`);
      shutdown(code);
    }
  });
  return child;
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(code), 100);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('exit', () => {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
});

console.log('Starting RSTechwerk frontend and backend...');
let apiReady = await isApiHealthy();
if (apiReady) {
  console.log('API already running on http://localhost:4000 — reusing it.');
} else {
  start('api', process.execPath, ['server/index.js']);
  apiReady = await waitForApi();
  if (!apiReady) {
    console.error('API did not become ready on http://localhost:4000. Frontend was not started.');
    shutdown(1);
  }
}
if (apiReady) start('frontend', npmCommand, ['run', 'dev:client']);
