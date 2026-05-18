// Mock dotenv
jest.mock('dotenv/config', () => ({}));

// Mock Firebase
const fbMockSet = jest.fn().mockResolvedValue(undefined);
const fbMockDoc = jest.fn().mockReturnValue({ set: fbMockSet });
const fbMockCollection = jest.fn().mockReturnValue({ doc: fbMockDoc });
jest.mock('../firebase', () => ({
  db: {
    collection: fbMockCollection,
  },
}));

// Mock express-session
const mockSessionFn = jest.fn((req: any, res: any, next: any) => next());
jest.mock('express-session', () => {
  return jest.fn(() => mockSessionFn);
});

// Mock passport-facebook strategy
jest.mock('passport-facebook', () => {
  return {
    Strategy: jest.fn().mockImplementation((options: any, verify: any) => {
      return { name: 'facebook', options, verify };
    }),
  };
});

// Mock passport
const mockSerializeUserFn = jest.fn();
const mockDeserializeUserFn = jest.fn();
const mockPassportUse = jest.fn();
const mockPassportInitialize = jest.fn((req: any, res: any, next: any) => next());
const mockPassportSession = jest.fn((req: any, res: any, next: any) => next());
const mockAuthenticate = jest.fn();

jest.mock('passport', () => ({
  __esModule: true,
  default: {
    serializeUser: mockSerializeUserFn,
    deserializeUser: mockDeserializeUserFn,
    use: mockPassportUse,
    initialize: () => mockPassportInitialize,
    session: () => mockPassportSession,
    authenticate: mockAuthenticate,
  },
}));

describe('Facebook Authentication Route', () => {
  let facebookAuthRoute: any;
  let StrategyMock: any;
  let sessionMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    fbMockSet.mockResolvedValue(undefined);

    // Re-require mocks after reset
    StrategyMock = require('passport-facebook').Strategy;
    sessionMock = require('express-session');

    // Re-import the module under test
    facebookAuthRoute = require('./facebook').default;
  });

  describe('Module Initialization', () => {
    it('should configure passport serializeUser', () => {
      expect(mockSerializeUserFn).toHaveBeenCalled();
    });

    it('should configure passport deserializeUser', () => {
      expect(mockDeserializeUserFn).toHaveBeenCalled();
    });

    it('should register Facebook strategy with passport.use', () => {
      expect(mockPassportUse).toHaveBeenCalled();
    });

    it('should configure Facebook strategy with correct options', () => {
      const call = StrategyMock.mock.calls[0];
      const options = call[0];

      expect(options.clientID).toBe(process.env['FACEBOOK_APP_ID'] || '');
      expect(options.clientSecret).toBe(process.env['FACEBOOK_APP_SECRET'] || '');
      expect(options.callbackURL).toBe(process.env['FACEBOOK_CALLBACK_URL'] || '');
      expect(options.profileFields).toEqual(['id', 'displayName', 'emails']);
      expect(options.enableProof).toBe(true);
    });
  });

  describe('GET / (auth start)', () => {
    it('should call passport.authenticate with facebook strategy and correct scopes', async () => {
      mockAuthenticate.mockImplementation((strategy: string, options: any) => {
        return (req: any, res: any, next: any) => {
          if (next) next();
        };
      });

      const req = { method: 'GET', url: '/' } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        redirect: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
      } as any;
      const next = jest.fn();

      const routes = facebookAuthRoute.stack;
      const getRoute = routes.find((r: any) => r.route && r.route.path === '/');
      expect(getRoute).toBeDefined();

      // Express stores handlers in route.stack
      const handler = getRoute!.route!.stack[0].handle;
      await handler(req, res, next);

      expect(mockAuthenticate).toHaveBeenCalledWith(
        'facebook',
        expect.objectContaining({
          scope: expect.arrayContaining(['email', 'pages_manage_posts', 'pages_read_engagement', 'pages_show_list']),
        })
      );
    });
  });

  describe('GET /callback', () => {
    it('should call passport.authenticate with failureRedirect', async () => {
      mockAuthenticate.mockImplementation((strategy: string, options: any) => {
        return (req: any, res: any, next: any) => {
          if (next) next();
        };
      });

      const req = { method: 'GET', url: '/callback' } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        redirect: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
      } as any;
      const next = jest.fn();

      const routes = facebookAuthRoute.stack;
      const getRoute = routes.find((r: any) => r.route && r.route.path === '/callback');
      expect(getRoute).toBeDefined();

      const handler = getRoute!.route!.stack[0].handle;
      await handler(req, res, next);

      expect(mockAuthenticate).toHaveBeenCalledWith(
        'facebook',
        { failureRedirect: '/' }
      );
    });

    it('should redirect to /auth-success on successful authentication', async () => {
      mockAuthenticate.mockImplementation((strategy: string, options: any) => {
        return (req: any, res: any, next: any) => {
          if (next) next({ id: '123', displayName: 'Test User' });
        };
      });

      const req = { method: 'GET', url: '/callback' } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        redirect: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
      } as any;
      const next = jest.fn();

      const routes = facebookAuthRoute.stack;
      const getRoute = routes.find((r: any) => r.route && r.route.path === '/callback');
      const handler = getRoute!.route!.stack[0].handle;
      await handler(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.redirect).toHaveBeenCalledWith('/auth-success');
    });
  });

  describe('Facebook Strategy Verify Callback', () => {
    it('should save user data to Firebase with correct structure', async () => {
      const verifyFn = StrategyMock.mock.calls[0][1];
      const mockProfile = {
        id: 'fb123',
        displayName: 'John Doe',
        emails: [{ value: 'john@example.com' }],
      };
      const mockDone = jest.fn();

      await verifyFn('access-token', 'refresh-token', mockProfile, mockDone);

      expect(fbMockCollection).toHaveBeenCalledWith('users');
      expect(fbMockDoc).toHaveBeenCalledWith('fb123');
      expect(fbMockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        }),
        { merge: true }
      );
    });

    it('should add accessToken to profile', async () => {
      const verifyFn = StrategyMock.mock.calls[0][1];
      const mockProfile = {
        id: 'fb123',
        displayName: 'John Doe',
        emails: [{ value: 'john@example.com' }],
      };
      const mockDone = jest.fn();

      await verifyFn('access-token', 'refresh-token', mockProfile, mockDone);

      expect((mockProfile as any).accessToken).toBe('access-token');
    });

    it('should handle missing emails gracefully', async () => {
      const verifyFn = StrategyMock.mock.calls[0][1];
      const mockProfile = {
        id: 'fb123',
        displayName: 'John Doe',
        emails: null,
      };
      const mockDone = jest.fn();

      await verifyFn('access-token', undefined, mockProfile, mockDone);

      expect(fbMockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          email: null,
        }),
        { merge: true }
      );
    });

    it('should not include refreshToken when undefined', async () => {
      const verifyFn = StrategyMock.mock.calls[0][1];
      const mockProfile = {
        id: 'fb123',
        displayName: 'John Doe',
        emails: [{ value: 'john@example.com' }],
      };
      const mockDone = jest.fn();

      await verifyFn('access-token', undefined, mockProfile, mockDone);

      const savedData = fbMockSet.mock.calls[0][0];
      expect(savedData).not.toHaveProperty('refreshToken');
    });

    it('should include refreshToken when provided', async () => {
      const verifyFn = StrategyMock.mock.calls[0][1];
      const mockProfile = {
        id: 'fb123',
        displayName: 'John Doe',
        emails: [{ value: 'john@example.com' }],
      };
      const mockDone = jest.fn();

      await verifyFn('access-token', 'my-refresh_token', mockProfile, mockDone);

      const savedData = fbMockSet.mock.calls[0][0];
      expect(savedData.refreshToken).toBe('my-refresh_token');
    });

    it('should call done with null error and profile on success', async () => {
      const verifyFn = StrategyMock.mock.calls[0][1];
      const mockProfile = {
        id: 'fb123',
        displayName: 'John Doe',
        emails: [{ value: 'john@example.com' }],
      };
      const mockDone = jest.fn();

      await verifyFn('access-token', 'refresh-token', mockProfile, mockDone);

      expect(mockDone).toHaveBeenCalledWith(null, mockProfile);
    });

    it('should handle Firebase errors gracefully and still call done', async () => {
      fbMockSet.mockRejectedValue(new Error('Firebase error'));
      const verifyFn = StrategyMock.mock.calls[0][1];
      const mockProfile = {
        id: 'fb123',
        displayName: 'John Doe',
        emails: [{ value: 'john@example.com' }],
      };
      const mockDone = jest.fn();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await verifyFn('access-token', 'refresh-token', mockProfile, mockDone);

      expect(consoleSpy).toHaveBeenCalledWith('Error saving to Firebase:', expect.any(Error));
      expect(mockDone).toHaveBeenCalledWith(null, mockProfile);

      consoleSpy.mockRestore();
    });

    it('should include updatedAt timestamp', async () => {
      const verifyFn = StrategyMock.mock.calls[0][1];
      const mockProfile = {
        id: 'fb123',
        displayName: 'John Doe',
        emails: [{ value: 'john@example.com' }],
      };
      const mockDone = jest.fn();

      await verifyFn('access-token', 'refresh-token', mockProfile, mockDone);

      const savedData = fbMockSet.mock.calls[0][0];
      expect(savedData.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Middleware', () => {
    it('should apply session middleware', () => {
      expect(sessionMock).toHaveBeenCalled();
    });

    it('should configure session with correct secret', () => {
      const call = sessionMock.mock.calls[0];
      const options = call[0];

      expect(options.secret).toBe(process.env['SESSION_SECRET'] || 'your-secret-key');
      expect(options.resave).toBe(false);
      expect(options.saveUninitialized).toBe(false);
    });

    it('should configure session cookie with secure false', () => {
      const call = sessionMock.mock.calls[0];
      const options = call[0];

      expect(options.cookie.secure).toBe(false);
    });
  });

  describe('Express Router', () => {
    it('should export an express router', () => {
      expect(facebookAuthRoute).toBeDefined();
      expect(typeof facebookAuthRoute.use).toBe('function');
      expect(typeof facebookAuthRoute.get).toBe('function');
    });

    it('should have routes registered', () => {
      const routes = facebookAuthRoute.stack;
      expect(routes.length).toBeGreaterThan(0);
    });

    it('should have a GET route for /', () => {
      const routes = facebookAuthRoute.stack;
      const getRoute = routes.find((r: any) => r.route && r.route.path === '/');
      expect(getRoute).toBeDefined();
    });

    it('should have a GET route for /callback', () => {
      const routes = facebookAuthRoute.stack;
      const getRoute = routes.find((r: any) => r.route && r.route.path === '/callback');
      expect(getRoute).toBeDefined();
    });
  });
});
