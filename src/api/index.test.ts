/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Mock express ────────────────────────────────────────────────────────────
const mockRouter: any = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
};

const mockExpressApp: any = {
  routes: [],
  get: jest.fn(),
  use: jest.fn(),
  post: jest.fn(),
  listen: jest.fn(),
};

const mockRouterFn = jest.fn(() => mockRouter);

jest.mock('express', () => {
  const expressMock = jest.fn(() => mockExpressApp);
  (expressMock as any).Router = mockRouterFn;
  return expressMock;
});

// ─── Mock sub-routes ────────────────────────────────────────────────────────
const mockPostRoute = { use: jest.fn(), get: jest.fn(), post: jest.fn() };
jest.mock('./post', () => mockPostRoute);

const mockFacebookAuthRoute = { use: jest.fn(), get: jest.fn(), post: jest.fn() };
jest.mock('./auth/facebook', () => mockFacebookAuthRoute);

describe('src/api/index.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('router creation', () => {
    it('should create an Express Router instance', async () => {
      await import('./index');
      expect(mockRouterFn).toHaveBeenCalledTimes(1);
    });

    it('should export the router as the default export', async () => {
      const { default: api } = await import('./index');
      expect(api).toBe(mockRouter);
    });
  });

  describe('middleware mounting', () => {
    it('should mount postRoute at /post', async () => {
      await import('./index');
      const useCall = mockRouter.use.mock.calls.find(
        (call: any[]) => call[0] === '/post'
      );
      expect(useCall).toBeDefined();
      expect(useCall[1]).toBe(mockPostRoute);
    });

    it('should mount facebookAuthRoute at /auth/facebook', async () => {
      await import('./index');
      const useCall = mockRouter.use.mock.calls.find(
        (call: any[]) => call[0] === '/auth/facebook'
      );
      expect(useCall).toBeDefined();
      expect(useCall[1]).toBe(mockFacebookAuthRoute);
    });
  });

  describe('base route', () => {
    it('should register a GET handler for /', async () => {
      await import('./index');
      const getCall = mockRouter.get.mock.calls.find(
        (call: any[]) => call[0] === '/'
      );
      expect(getCall).toBeDefined();
      expect(typeof getCall[1]).toBe('function');
    });

    it('should respond with "Hello from API! {url}"', async () => {
      await import('./index');
      const getCall = mockRouter.get.mock.calls.find(
        (call: any[]) => call[0] === '/'
      );
      expect(getCall).toBeDefined();

      const handler = getCall[1];
      const mockReq = { url: { toString: () => '/api' } };
      const mockRes = { send: jest.fn() };

      handler(mockReq, mockRes);

      expect(mockRes.send).toHaveBeenCalledWith('Hello from API! /api');
    });

    it('should include the full request URL in the response', async () => {
      await import('./index');
      const getCall = mockRouter.get.mock.calls.find(
        (call: any[]) => call[0] === '/'
      );
      expect(getCall).toBeDefined();

      const handler = getCall[1];
      const mockReq = { url: { toString: () => '/api?foo=bar' } };
      const mockRes = { send: jest.fn() };

      handler(mockReq, mockRes);

      expect(mockRes.send).toHaveBeenCalledWith('Hello from API! /api?foo=bar');
    });
  });
});
