import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const planetEntry = '/worlds/foundation-planet/index.html';

if (Number.parseInt(process.versions.node.split('.')[0], 10) < 18) {
  console.error('Foundation Planet requires Node.js 18 or newer.');
  process.exit(1);
}

function optionValue(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const host = optionValue('--host') ?? process.env.HOST ?? '127.0.0.1';
const requestedPort = optionValue('--port') ?? process.env.PORT ?? '4173';
const port = Number.parseInt(requestedPort, 10);

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  console.error(`Invalid port: ${requestedPort}`);
  process.exit(1);
}

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.wasm', 'application/wasm'],
]);

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(message);
}

function resolveRequestPath(requestUrl) {
  const pathname = new URL(requestUrl, 'http://localhost').pathname;
  const decodedPath = decodeURIComponent(pathname);
  const candidate = path.resolve(repositoryRoot, `.${decodedPath}`);
  const insideRepository =
    candidate === repositoryRoot ||
    candidate.startsWith(`${repositoryRoot}${path.sep}`);

  return insideRepository ? candidate : null;
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    sendText(response, 405, 'Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, 'http://localhost').pathname;
  } catch {
    sendText(response, 400, 'Invalid request URL');
    return;
  }

  if (pathname === '/') {
    response.writeHead(302, {
      'Cache-Control': 'no-store',
      Location: planetEntry,
    });
    response.end();
    return;
  }

  let filePath;
  try {
    filePath = resolveRequestPath(request.url);
  } catch {
    sendText(response, 400, 'Invalid request path');
    return;
  }

  if (!filePath) {
    sendText(response, 403, 'Request path is outside the repository');
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      sendText(response, 404, 'Not found');
      return;
    }

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Length': fileStat.size,
      'Content-Type': contentTypes.get(path.extname(filePath).toLowerCase()) ??
        'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    createReadStream(filePath)
      .on('error', () => {
        if (!response.headersSent) {
          sendText(response, 500, 'Could not read file');
        } else {
          response.destroy();
        }
      })
      .pipe(response);
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') {
      sendText(response, 404, 'Not found');
      return;
    }

    console.error(error);
    sendText(response, 500, 'Internal server error');
  }
});

server.listen(port, host, () => {
  const address = server.address();
  const activePort = typeof address === 'object' && address ? address.port : port;
  console.log(`Foundation Planet ready: http://${host}:${activePort}/`);
  console.log('Press Ctrl+C to stop.');
});

server.on('error', (error) => {
  console.error(`Foundation Planet server failed: ${error.message}`);
  process.exitCode = 1;
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
