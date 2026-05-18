jest.mock('@angular/ssr', () => ({
  provideServerRendering: jest.fn((withRoutesResult) => ({
    provide: 'SERVER_RENDERING',
    useValue: withRoutesResult,
  })),
  withRoutes: jest.fn((routes) => ({ routes })),
  RenderMode: {
    Prerender: 'PRERENDER',
    Server: 'SERVER',
    Client: 'CLIENT',
  },
}));

jest.mock('@angular/core', () => ({
  mergeApplicationConfig: jest.fn((baseConfig, serverConfig) => ({
    ...baseConfig,
    ...serverConfig,
    providers: [...baseConfig.providers, ...serverConfig.providers],
  })),
  ApplicationConfig: jest.fn(),
}));

jest.mock('./app.config', () => ({
  appConfig: {
    providers: [
      { provide: 'ZONE_CHANGE_DETECTION', useValue: true },
      { provide: 'ROUTER', useValue: true },
      { provide: 'CLIENT_HYDRATION', useValue: true },
    ],
  },
}));

jest.mock('./app.routes.server', () => ({
  serverRoutes: [
    { path: '**', renderMode: 'PRERENDER' },
  ],
}));

import { provideServerRendering, withRoutes } from '@angular/ssr';
import { mergeApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { config } from './app.config.server';

describe('app.config.server', () => {
  describe('config', () => {
    it('should be defined', () => {
      expect(config).toBeDefined();
    });

    it('should have a providers array', () => {
      expect(Array.isArray(config.providers)).toBe(true);
    });

    it('should include providers from appConfig', () => {
      appConfig.providers.forEach((provider) => {
        expect(config.providers).toContain(provider);
      });
    });

    it('should include the server rendering provider', () => {
      const serverProvider = config.providers.find(
        (p: unknown) => typeof p === 'object' && p !== null && (p as { provide?: string }).provide === 'SERVER_RENDERING'
      );
      expect(serverProvider).toBeDefined();
    });

    it('should have more providers than appConfig alone', () => {
      expect(config.providers.length).toBeGreaterThan(appConfig.providers.length);
    });

    it('should have exactly one more provider than appConfig', () => {
      expect(config.providers.length).toBe(appConfig.providers.length + 1);
    });

    it('should be the result of mergeApplicationConfig', () => {
      expect(mergeApplicationConfig).toHaveBeenCalledWith(
        appConfig,
        expect.objectContaining({
          providers: expect.any(Array),
        })
      );
    });

    it('should have a server rendering provider that contains the server routes', () => {
      const serverProvider = config.providers.find(
        (p: unknown) => typeof p === 'object' && p !== null && (p as { provide?: string }).provide === 'SERVER_RENDERING'
      ) as { useValue?: { routes: unknown[] } };
      expect(serverProvider.useValue).toBeDefined();
      expect(serverProvider.useValue!.routes).toEqual(serverRoutes);
    });

    it('should have called withRoutes with serverRoutes', () => {
      expect(withRoutes).toHaveBeenCalledWith(serverRoutes);
    });

    it('should have called provideServerRendering', () => {
      expect(provideServerRendering).toHaveBeenCalled();
    });
  });
});
