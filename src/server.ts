import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Polyfill __dirname and __filename for SSR environments BEFORE any other imports
// This is needed for CommonJS modules like swagger-ui-express in ES module environments
const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDirPath = dirname(currentFilePath);

if (typeof globalThis.__dirname === 'undefined') {
  globalThis.__dirname = currentDirPath;
}
if (typeof globalThis.__filename === 'undefined') {
  globalThis.__filename = currentFilePath;
}

// Also set on global for compatibility
if (typeof global !== 'undefined') {
  if (typeof global.__dirname === 'undefined') {
    global.__dirname = currentDirPath;
  }
  if (typeof global.__filename === 'undefined') {
    global.__filename = currentFilePath;
  }
}

// Set on window for browser compatibility (though not needed for SSR)
if (typeof window !== 'undefined' && typeof window.__dirname === 'undefined') {
  (window as any).__dirname = currentDirPath;
  (window as any).__filename = currentFilePath;
}

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import api from "./api/index";
import { setupSwagger } from "./api/swagger";

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add MIME type middleware for better static file serving
app.use((req, res, next) => {
  if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.path.endsWith('.json')) {
    res.setHeader('Content-Type', 'application/json');
  }
  next();
});

// Setup OpenAPI/Swagger documentation
setupSwagger(app).catch(console.error);

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

app.get('/routes', (req, res) => {
  res.send(JSON.stringify(app.routes));
});

// Base route
app.use("/api", api);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    },
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */

app.use('/**', (req, res, next) => {
  console.log(`[SSR CATCH-ALL] ${req.method} ${req.originalUrl}`);
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});


/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
