/// <reference types="jest" />

// Mock the Angular platform-browser module
const mockBootstrapApplication = jest.fn();
jest.mock('@angular/platform-browser', () => ({
  bootstrapApplication: (...args: unknown[]) => mockBootstrapApplication(...args),
}));

// Mock the app component
jest.mock('./app/app.component', () => ({
  AppComponent: class MockAppComponent {},
}));

// Mock the server config
const mockConfig = { providers: [] };
jest.mock('./app/app.config.server', () => ({
  config: mockConfig,
}));

describe('main.server', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the module cache so each test gets a fresh import
    jest.resetModules();
  });

  describe('bootstrap', () => {
    it('should call bootstrapApplication with AppComponent and config', async () => {
      const { default: bootstrap } = await import('./main.server');
      const { AppComponent } = await import('./app/app.component');

      await bootstrap();

      expect(mockBootstrapApplication).toHaveBeenCalledTimes(1);
      expect(mockBootstrapApplication).toHaveBeenCalledWith(AppComponent, mockConfig);
    });

    it('should return the result of bootstrapApplication', async () => {
      const mockResult = {} as unknown;
      mockBootstrapApplication.mockResolvedValue(mockResult);

      const { default: bootstrap } = await import('./main.server');

      const result = await bootstrap();

      expect(result as unknown).toBe(mockResult);
    });

    it('should propagate errors from bootstrapApplication', async () => {
      const mockError = new Error('Bootstrap failed');
      mockBootstrapApplication.mockRejectedValue(mockError);

      const { default: bootstrap } = await import('./main.server');

      await expect(bootstrap() as Promise<unknown>).rejects.toThrow('Bootstrap failed');
    });
  });
});
