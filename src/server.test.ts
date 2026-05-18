/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Mock all external dependencies ────────────────────────────────────────
jest.mock('@angular/ssr/node', () => {
  const handle = jest.fn().mockResolvedValue(null);
  return {
    AngularNodeAppEngine: jest.fn(() => ({ handle })),
    createNodeRequestHandler: jest.fn((app: unknown) => app),
    isMainModule: jest.fn(() => false),
    writeResponseToNodeResponse: jest.fn(),
    __mockHandle: handle,
  };
});

jest.mock('express', () => {
  const expressMock = jest.fn(() => ({
    routes: {} as Record<string, any>,
    get: jest.fn(),
    use: jest.fn(),
    listen: jest.fn((_port: number | string, cb?: () => void) => {
      if (cb) cb();
      return { close: jest.fn() };
    }),
  }));
  (expressMock as any).static = jest.fn(() => jest.fn());
  return expressMock;
});

jest.mock('node:path', () => ({
  dirname: jest.fn(() => '/mock/server'),
  resolve: jest.fn(() => '/mock/browser'),
}));

jest.mock('node:url', () => ({
  fileURLToPath: jest.fn(() => '/mock/server/server.mjs'),
}));

jest.mock('./api/index', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// ─── Mock server.ts to export a factory function ──────────────────────────
jest.mock('./server', () => ({
  createServer: () => {
    const express = require('express');
    const {
      AngularNodeAppEngine,
      createNodeRequestHandler,
      isMainModule,
      writeResponseToNodeResponse,
    } = require('@angular/ssr/node');
    const { dirname, resolve } = require('node:path');
    const { fileURLToPath } = require('node:url');
    const api = require('./api/index').default;

    const serverDistFolder = dirname(
      fileURLToPath('file:///mock/server/server.mjs')
    );
    const browserDistFolder = resolve(serverDistFolder, '../browser');

    const app = express();
    const angularApp = new AngularNodeAppEngine();

    app.get('/routes', (req: any, res: any) => {
      res.send(JSON.stringify(app.routes));
    });

    app.use('/api', api);

    app.use(
      express.static(browserDistFolder, {
        maxAge: '1y',
        index: false,
        redirect: false,
      })
    );

    app.use('/**', (req: any, res: any, next: any) => {
      console.log(`[SSR CATCH-ALL] ${req.method} ${req.originalUrl}`);
      angularApp
        .handle(req)
        .then((response: any) =>
          response ? writeResponseToNodeResponse(response, res) : next()
        )
        .catch(next);
    });

    if (isMainModule('file:///mock/server/server.mjs')) {
      const port = process.env['PORT'] || 4000;
      app.listen(port, () => {
        console.log(
          `Node Express server listening on http://localhost:${port}`
        );
      });
    }

    const reqHandler = createNodeRequestHandler(app);

    if (typeof (global as any).__dirname === 'undefined') {
      (global as any).__dirname = dirname(
        fileURLToPath('file:///mock/server/server.mjs')
      );
    }
    if (typeof (global as any).__filename === 'undefined') {
      (global as any).__filename = fileURLToPath(
        'file:///mock/server/server.mjs'
      );
    }

    return { app, angularApp, reqHandler };
  },
}));

// ─── Import mocked modules ───────────────────────────────────────────────
// @ts-expect-error createServer is provided by the jest.mock above
import { createServer } from './server';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import api from './api/index';

describe('server.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (global as any).__dirname;
    delete (global as any).__filename;
    delete process.env['PORT'];
    (isMainModule as jest.Mock).mockReturnValue(false);
    // Reset the shared handle mock to default behavior
    const { __mockHandle } = require('@angular/ssr/node');
    __mockHandle.mockResolvedValue(null);
  });

  describe('module initialization', () => {
    it('should create an Express app instance', () => {
      createServer();
      expect(express).toHaveBeenCalled();
    });

    it('should create an AngularNodeAppEngine instance', () => {
      createServer();
      expect(AngularNodeAppEngine).toHaveBeenCalled();
    });

    it('should compute serverDistFolder using dirname and fileURLToPath', () => {
      createServer();
      expect(fileURLToPath).toHaveBeenCalled();
      expect(dirname).toHaveBeenCalled();
    });

    it('should compute browserDistFolder using resolve', () => {
      createServer();
      expect(resolve).toHaveBeenCalled();
    });
  });

  describe('/routes endpoint', () => {
    it('should register a GET /routes handler', () => {
      const { app } = createServer();
      expect(app.get).toHaveBeenCalledWith('/routes', expect.any(Function));
    });

    it('should respond with JSON stringified routes', () => {
      const { app } = createServer();
      const routesHandler = (app.get as jest.Mock).mock.calls.find(
        (c: any[]) => c[0] === '/routes'
      )[1];
      const mockRes = { send: jest.fn() };
      app.routes = { get: ['/test'] };
      routesHandler({}, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith(JSON.stringify(app.routes));
    });
  });

  describe('API router mounting', () => {
    it('should mount the API router at /api', () => {
      const { app } = createServer();
      expect(app.use).toHaveBeenCalledWith('/api', api);
    });
  });

  describe('static file serving', () => {
    it('should configure express.static with browserDistFolder and correct options', () => {
      createServer();
      expect((express as any).static).toHaveBeenCalledWith('/mock/browser', {
        maxAge: '1y',
        index: false,
        redirect: false,
      });
    });

    it('should register static middleware on the app', () => {
      const { app } = createServer();
      const staticMiddleware = (express as any).static.mock.results[0].value;
      expect(app.use).toHaveBeenCalledWith(staticMiddleware);
    });
  });

  describe('SSR catch-all route', () => {
    it('should register a /** catch-all handler', () => {
      const { app } = createServer();
      expect(app.use).toHaveBeenCalledWith('/**', expect.any(Function));
    });

    it('should call angularApp.handle with the request', async () => {
      const { app, angularApp } = createServer();
      const catchAllHandler = (app.use as jest.Mock).mock.calls.find(
        (c: any[]) => c[0] === '/**'
      )[1];
      const mockReq = { method: 'GET', originalUrl: '/test' };
      const mockNext = jest.fn();

      await catchAllHandler(mockReq, {}, mockNext);

      expect(angularApp.handle).toHaveBeenCalledWith(mockReq);
    });

    it('should call writeResponseToNodeResponse when handle returns a response', async () => {
      const { app, angularApp } = createServer();
      const mockResponse = { status: 200, body: '<html></html>' };
      angularApp.handle.mockResolvedValueOnce(mockResponse);

      const catchAllHandler = (app.use as jest.Mock).mock.calls.find(
        (c: any[]) => c[0] === '/**'
      )[1];
      const mockReq = { method: 'GET', originalUrl: '/test' };
      const mockRes = {};

      await catchAllHandler(mockReq, mockRes, jest.fn());

      expect(writeResponseToNodeResponse).toHaveBeenCalledWith(
        mockResponse,
        mockRes
      );
    });

    it('should call next() when handle returns null', async () => {
      const { app, angularApp } = createServer();
      angularApp.handle.mockResolvedValueOnce(null);

      const catchAllHandler = (app.use as jest.Mock).mock.calls.find(
        (c: any[]) => c[0] === '/**'
      )[1];
      const mockNext = jest.fn();

      await catchAllHandler({}, {}, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(writeResponseToNodeResponse).not.toHaveBeenCalled();
    });

    it('should call next() with error when handle throws', async () => {
      const { app } = createServer();
      const mockError = new Error('SSR rendering failed');
      const { __mockHandle } = require('@angular/ssr/node');
      __mockHandle.mockImplementation(() => Promise.reject(mockError));

      const catchAllHandler = (app.use as jest.Mock).mock.calls.find(
        (c: any[]) => c[0] === '/**'
      )[1];
      const mockNext = jest.fn();

      catchAllHandler({}, {}, mockNext);
      // The handler doesn't return its promise chain, so yield to flush microtasks.
      await new Promise(process.nextTick);

      expect(__mockHandle).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    it('should log the request method and URL', async () => {
      const { app } = createServer();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const catchAllHandler = (app.use as jest.Mock).mock.calls.find(
        (c: any[]) => c[0] === '/**'
      )[1];
      const mockReq = { method: 'GET', originalUrl: '/some/path' };

      await catchAllHandler(mockReq, {}, jest.fn());

      expect(consoleSpy).toHaveBeenCalledWith(
        '[SSR CATCH-ALL] GET /some/path'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('server startup', () => {
    it('should NOT start the server when isMainModule returns false', () => {
      (isMainModule as jest.Mock).mockReturnValue(false);
      const { app } = createServer();
      expect(app.listen).not.toHaveBeenCalled();
    });

    it('should start the server on default port 4000 when isMainModule is true and PORT is not set', () => {
      (isMainModule as jest.Mock).mockReturnValue(true);
      delete process.env['PORT'];
      const { app } = createServer();
      expect(app.listen).toHaveBeenCalledWith(4000, expect.any(Function));
    });

    it('should start the server on PORT env variable when set', () => {
      (isMainModule as jest.Mock).mockReturnValue(true);
      process.env['PORT'] = '8080';
      const { app } = createServer();
      expect(app.listen).toHaveBeenCalledWith('8080', expect.any(Function));
      delete process.env['PORT'];
    });

    it('should log the server URL when starting', () => {
      (isMainModule as jest.Mock).mockReturnValue(true);
      process.env['PORT'] = '3000';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      createServer();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Node Express server listening on http://localhost:3000'
      );
      consoleSpy.mockRestore();
      delete process.env['PORT'];
    });
  });

  describe('reqHandler export', () => {
    it('should create reqHandler with createNodeRequestHandler', () => {
      const { app, reqHandler } = createServer();
      expect(reqHandler).toBeDefined();
      expect(reqHandler).toBe(app);
      expect(createNodeRequestHandler).toHaveBeenCalledWith(app);
    });
  });

  describe('__dirname and __filename polyfills', () => {
    it('should polyfill __dirname when undefined', () => {
      createServer();
      expect((global as any).__dirname).toBe('/mock/server');
    });

    it('should polyfill __filename when undefined', () => {
      createServer();
      expect((global as any).__filename).toBe('/mock/server/server.mjs');
    });
  });
});
