// Global test setup
beforeEach(() => {
  // Reset all timers and mocks before each test
  jest.clearAllTimers();
  jest.restoreAllMocks();
});

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Uncomment to disable console.log during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
