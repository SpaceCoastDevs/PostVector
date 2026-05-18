/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Mock express ────────────────────────────────────────────────────────────
const mockPostRouter: any = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
};

jest.mock('express', () => {
  const expressMock = jest.fn();
  (expressMock as any).Router = jest.fn(() => mockPostRouter);
  return expressMock;
});

// ─── Mock firebase ──────────────────────────────────────────────────────────
const mockGet = jest.fn();
const mockDoc = jest.fn();
const mockCollection = jest.fn(() => ({
  doc: mockDoc.mockReturnValue({
    get: mockGet,
  }),
}));

const mockDb: any = {
  collection: mockCollection,
};

jest.mock('./firebase', () => ({
  db: mockDb,
}));

// ─── Mock fetch ─────────────────────────────────────────────────────────────
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

describe('src/api/post.ts', () => {
  let postRoute: any;
  let routeHandler: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    routeHandler = null;

    // Reset mock post calls tracking
    mockPostRouter.post.mockReset();

    // Import the module fresh each time
    postRoute = require('./post').default;

    // Extract the handler that was registered via postRoute.post('/facebook/page', handler)
    const postCall = mockPostRouter.post.mock.calls.find(
      (call: any[]) => call[0] === '/facebook/page'
    );
    if (postCall) {
      routeHandler = postCall[1];
    }
  });

  // Helper to invoke the route handler
  async function invokeRouteHandler(body: any) {
    const mockReq: any = { body };
    const mockRes: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    await routeHandler(mockReq, mockRes);
    return { mockReq, mockRes };
  }

  describe('module export', () => {
    it('should export an Express Router as the default export', () => {
      expect(postRoute).toBeDefined();
      expect(postRoute).toBe(mockPostRouter);
    });

    it('should register a POST handler for /facebook/page', () => {
      const postCall = mockPostRouter.post.mock.calls.find(
        (call: any[]) => call[0] === '/facebook/page'
      );
      expect(postCall).toBeDefined();
      expect(typeof postCall[1]).toBe('function');
    });
  });

  describe('POST /facebook/page - authentication', () => {
    it('should return 401 when user is null', async () => {
      const { mockRes } = await invokeRouteHandler({ user: null, message: 'hello' });
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith('Not authenticated.');
    });

    it('should return 401 when user is undefined', async () => {
      const { mockRes } = await invokeRouteHandler({ message: 'hello' });
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith('Not authenticated.');
    });

    it('should return 401 when accessToken is missing and no userId', async () => {
      const { mockRes } = await invokeRouteHandler({
        user: { id: undefined, accessToken: undefined },
        message: 'hi',
      });
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith('Not authenticated.');
    });

    it('should return 401 when accessToken is empty string and no userId', async () => {
      const { mockRes } = await invokeRouteHandler({
        user: { id: undefined, accessToken: '' },
        message: 'hi',
      });
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith('Not authenticated.');
    });

    it('should return 401 when accessToken missing, userId provided, but Firestore doc does not exist', async () => {
      mockDoc.mockReturnValue({
        get: mockGet.mockResolvedValue({ exists: false }),
      });

      const { mockRes } = await invokeRouteHandler({
        user: { id: 'user123', accessToken: undefined },
        message: 'hi',
      });

      expect(mockCollection).toHaveBeenCalledWith('users');
      expect(mockDoc).toHaveBeenCalledWith('user123');
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith('Not authenticated.');
    });

    it('should return 401 when Firestore lookup throws an error', async () => {
      mockDoc.mockReturnValue({
        get: mockGet.mockRejectedValue(new Error('Firestore down')),
      });

      const { mockRes } = await invokeRouteHandler({
        user: { id: 'user123', accessToken: undefined },
        message: 'hi',
      });

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith('Not authenticated.');
    });
  });

  describe('POST /facebook/page - Firestore token retrieval', () => {
    it('should use sessionToken from request body when present', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: [{ id: 'page1', access_token: 'page-token' }],
            }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true }),
        });

      await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'session-token' },
        message: 'hello',
      });

      // Should NOT query Firestore
      expect(mockCollection).not.toHaveBeenCalled();
      // Should use session-token for the Facebook API call
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('access_token=session-token')
      );
    });

    it('should fall back to Firestore when sessionToken is missing', async () => {
      mockDoc.mockReturnValue({
        get: mockGet.mockResolvedValue({
          exists: true,
          data: () => ({ accessToken: 'firestore-token' }),
        }),
      });

      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: [{ id: 'page1', access_token: 'page-token' }],
            }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true }),
        });

      await invokeRouteHandler({
        user: { id: 'user42', accessToken: undefined },
        message: 'hello',
      });

      expect(mockCollection).toHaveBeenCalledWith('users');
      expect(mockDoc).toHaveBeenCalledWith('user42');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('access_token=firestore-token')
      );
    });

    it('should fall back to Firestore when sessionToken is empty string', async () => {
      mockDoc.mockReturnValue({
        get: mockGet.mockResolvedValue({
          exists: true,
          data: () => ({ accessToken: 'firestore-token-2' }),
        }),
      });

      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: [{ id: 'page1', access_token: 'page-token' }],
            }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true }),
        });

      await invokeRouteHandler({
        user: { id: 'user99', accessToken: '' },
        message: 'hello',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('access_token=firestore-token-2')
      );
    });

    it('should prefer sessionToken over Firestore even when userId is present', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: [{ id: 'page1', access_token: 'page-token' }],
            }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true }),
        });

      await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'session-token' },
        message: 'hello',
      });

      expect(mockCollection).not.toHaveBeenCalled();
    });
  });

  describe('POST /facebook/page - default message', () => {
    it('should use the default message when message is not provided', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: [{ id: 'page1', access_token: 'page-token' }],
            }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true }),
        });

      await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'token' },
      });

      const postCall = mockFetch.mock.calls[1];
      const postBody = JSON.parse(postCall[1].body);
      expect(postBody.message).toBe('Hello from Node backend with Firebase!');
    });

    it('should use the default message when message is undefined', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: [{ id: 'page1', access_token: 'page-token' }],
            }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true }),
        });

      await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'token' },
        message: undefined,
      });

      const postCall = mockFetch.mock.calls[1];
      const postBody = JSON.parse(postCall[1].body);
      expect(postBody.message).toBe('Hello from Node backend with Firebase!');
    });

    it('should use the provided message from request body', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: [{ id: 'page1', access_token: 'page-token' }],
            }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true }),
        });

      await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'token' },
        message: 'Custom post',
      });

      const postCall = mockFetch.mock.calls[1];
      const postBody = JSON.parse(postCall[1].body);
      expect(postBody.message).toBe('Custom post');
    });
  });

  describe('POST /facebook/page - Facebook API interaction', () => {
    it('should fetch the user managed pages and post to the first page', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: [
                { id: 'page1', access_token: 'page-token-1' },
                { id: 'page2', access_token: 'page-token-2' },
              ],
            }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ id: 'post123' }),
        });

      await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'token' },
        message: 'hello',
      });

      // First fetch: get pages
      expect(mockFetch).toHaveBeenCalledWith(
        'https://graph.facebook.com/me/accounts?access_token=token'
      );
      // Second fetch: post to page1 feed
      expect(mockFetch).toHaveBeenCalledWith(
        'https://graph.facebook.com/page1/feed',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should send the correct POST body to Facebook Graph API', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: [{ id: 'page42', access_token: 'page-token' }],
            }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ id: 'post123' }),
        });

      await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'token' },
        message: 'Test message',
      });

      const postCall = mockFetch.mock.calls[1];
      expect(postCall[1].method).toBe('POST');
      expect(postCall[1].headers).toEqual({
        'Content-Type': 'application/json',
      });
      const body = JSON.parse(postCall[1].body);
      expect(body).toEqual({
        message: 'Test message',
        access_token: 'page-token',
      });
    });

    it('should return the Facebook post response as JSON', async () => {
      const fbResponse = { id: 'post_abc', success: true };
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              data: [{ id: 'page1', access_token: 'page-token' }],
            }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(fbResponse),
        });

      const { mockRes } = await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'token' },
        message: 'hello',
      });

      expect(mockRes.json).toHaveBeenCalledWith(fbResponse);
    });
  });

  describe('POST /facebook/page - error handling', () => {
    it('should return 500 with error message when postToFacebookPage throws', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            data: [{ id: 'page1', access_token: 'page-token' }],
          }),
      });
      mockFetch.mockRejectedValueOnce(new Error('Facebook API error'));

      const { mockRes } = await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'token' },
        message: 'hello',
      });

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Facebook API error',
      });
    });

    it('should return 500 with "An unknown error occurred" for non-Error throws', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            data: [{ id: 'page1', access_token: 'page-token' }],
          }),
      });
      mockFetch.mockRejectedValueOnce('string error');

      const { mockRes } = await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'token' },
        message: 'hello',
      });

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'An unknown error occurred',
      });
    });

    it('should return 500 when pages response has no data array', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ error: { message: 'Invalid token' } }),
      });

      const { mockRes } = await invokeRouteHandler({
        user: { id: 'user1', accessToken: 'token' },
        message: 'hello',
      });

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
  });

  describe('POST /facebook/page - edge cases', () => {
    it('should handle empty body gracefully and return 401', async () => {
      const { mockRes } = await invokeRouteHandler({});
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should handle Firestore returning undefined accessToken', async () => {
      mockDoc.mockReturnValue({
        get: mockGet.mockResolvedValue({
          exists: true,
          data: () => ({}),
        }),
      });

      const { mockRes } = await invokeRouteHandler({
        user: { id: 'user1', accessToken: undefined },
        message: 'hi',
      });

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith('Not authenticated.');
    });

    it('should handle Firestore returning null accessToken', async () => {
      mockDoc.mockReturnValue({
        get: mockGet.mockResolvedValue({
          exists: true,
          data: () => ({ accessToken: null }),
        }),
      });

      const { mockRes } = await invokeRouteHandler({
        user: { id: 'user1', accessToken: undefined },
        message: 'hi',
      });

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith('Not authenticated.');
    });
  });
});
