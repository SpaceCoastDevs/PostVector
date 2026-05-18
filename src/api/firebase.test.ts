/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Mock firebase-admin ────────────────────────────────────────────────────
const mockFirestore = jest.fn();
const mockInitializeApp = jest.fn();

jest.mock('firebase-admin', () => {
  const adminMock: any = {
    apps: [],
    initializeApp: mockInitializeApp,
    firestore: mockFirestore,
  };
  return adminMock;
});

describe('src/api/firebase.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('initialization', () => {
    it('should call admin.initializeApp() when no apps exist', async () => {
      const admin = require('firebase-admin');
      admin.apps = [];

      await import('./firebase');

      expect(mockInitializeApp).toHaveBeenCalledTimes(1);
    });

    it('should NOT call admin.initializeApp() when apps already exist', async () => {
      const admin = require('firebase-admin');
      admin.apps = [{ name: '[DEFAULT]' }];

      await import('./firebase');

      expect(mockInitializeApp).not.toHaveBeenCalled();
    });

    it('should NOT call admin.initializeApp() when multiple apps exist', async () => {
      const admin = require('firebase-admin');
      admin.apps = [{ name: '[DEFAULT]' }, { name: 'secondary' }];

      await import('./firebase');

      expect(mockInitializeApp).not.toHaveBeenCalled();
    });
  });

  describe('firestore instance', () => {
    it('should call admin.firestore() to obtain the db instance', async () => {
      const mockDbInstance: any = { collection: jest.fn() };
      mockFirestore.mockReturnValue(mockDbInstance);

      await import('./firebase');

      expect(mockFirestore).toHaveBeenCalledTimes(1);
    });

    it('should export the firestore db instance as db', async () => {
      const mockDbInstance: any = { collection: jest.fn(), doc: jest.fn() };
      mockFirestore.mockReturnValue(mockDbInstance);

      const { db } = await import('./firebase');

      expect(db).toBe(mockDbInstance);
    });
  });

  describe('module exports', () => {
    it('should export db as a named export', async () => {
      const mockDbInstance: any = {};
      mockFirestore.mockReturnValue(mockDbInstance);

      const { db } = await import('./firebase');

      expect(db).toBeDefined();
      expect(db).toBe(mockDbInstance);
    });
  });
});
