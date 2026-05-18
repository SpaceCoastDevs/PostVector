jest.mock('@angular/platform-browser', () => ({
  bootstrapApplication: jest.fn().mockResolvedValue({}),
}));

jest.mock('./app/app.config', () => ({
  appConfig: { providers: [] },
}));

jest.mock('./app/app.component', () => ({
  AppComponent: class AppComponent {},
}));

describe('main.ts', () => {
  let bootstrapApplication: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    bootstrapApplication = require('@angular/platform-browser').bootstrapApplication;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should call bootstrapApplication with AppComponent and appConfig', () => {
    const { AppComponent } = require('./app/app.component');
    const { appConfig } = require('./app/app.config');

    require('./main');

    expect(bootstrapApplication).toHaveBeenCalledWith(AppComponent, appConfig);
  });

  it('should catch bootstrap errors and log them via console.error', async () => {
    const mockError = new Error('Bootstrap failed');
    bootstrapApplication.mockRejectedValueOnce(mockError);

    require('./main');

    // Wait for the promise rejection to be handled
    await new Promise((resolve) => setImmediate(resolve));

    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
  });
});
