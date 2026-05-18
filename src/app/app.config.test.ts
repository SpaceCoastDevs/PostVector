jest.mock('@angular/core', () => ({
  provideZoneChangeDetection: jest.fn((options) => ({
    provide: 'ZONE_CHANGE_DETECTION',
    useValue: options,
  })),
  ApplicationConfig: jest.fn(),
}));

jest.mock('@angular/router', () => ({
  provideRouter: jest.fn((routes) => ({
    provide: 'ROUTER',
    useValue: routes,
  })),
}));

jest.mock('@angular/platform-browser', () => ({
  provideClientHydration: jest.fn((...args) => ({
    provide: 'CLIENT_HYDRATION',
    useValue: args,
  })),
  withEventReplay: jest.fn(() => ({ eventReplay: true })),
}));

jest.mock('./app.routes', () => ({
  routes: [{ path: '**', redirectTo: '/home' }],
}));

import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { appConfig } from './app.config';

describe('app.config', () => {
  describe('appConfig', () => {
    it('should be defined', () => {
      expect(appConfig).toBeDefined();
    });

    it('should have a providers array', () => {
      expect(Array.isArray(appConfig.providers)).toBe(true);
    });

    it('should have exactly 3 providers', () => {
      expect(appConfig.providers.length).toBe(3);
    });

    it('should include zone change detection provider', () => {
      expect(provideZoneChangeDetection).toHaveBeenCalledWith({ eventCoalescing: true });
    });

    it('should include router provider with routes', () => {
      expect(provideRouter).toHaveBeenCalledWith(routes);
    });

    it('should include client hydration provider', () => {
      expect(provideClientHydration).toHaveBeenCalled();
    });

    it('should include event replay with client hydration', () => {
      expect(withEventReplay).toHaveBeenCalled();
    });

    it('should have zone change detection as the first provider', () => {
      const provider = appConfig.providers[0] as { provide?: string };
      expect(provider.provide).toBe('ZONE_CHANGE_DETECTION');
    });

    it('should have router as the second provider', () => {
      const provider = appConfig.providers[1] as { provide?: string };
      expect(provider.provide).toBe('ROUTER');
    });

    it('should have client hydration as the third provider', () => {
      const provider = appConfig.providers[2] as { provide?: string };
      expect(provider.provide).toBe('CLIENT_HYDRATION');
    });
  });
});
