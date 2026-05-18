jest.mock('@angular/router', () => ({
  Routes: jest.fn(),
}));

jest.mock('./auth-success/auth-success.component', () => ({
  AuthSuccessComponent: jest.fn(),
}));

jest.mock('./home-page/home-page.component', () => ({
  HomePageComponent: jest.fn(),
}));

jest.mock('./dashboard/dashboard.component', () => ({
  DashboardComponent: jest.fn(),
}));

import { routes } from './app.routes';
import { AuthSuccessComponent } from './auth-success/auth-success.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';

describe('app.routes', () => {
  describe('routes', () => {
    it('should be defined', () => {
      expect(routes).toBeDefined();
    });

    it('should be an array', () => {
      expect(Array.isArray(routes)).toBe(true);
    });

    it('should contain exactly 3 routes', () => {
      expect(routes).toHaveLength(3);
    });

    it('should have a dashboard route with path "dashboard"', () => {
      const dashboardRoute = routes.find((r) => r.path === 'dashboard');
      expect(dashboardRoute).toBeDefined();
      expect(dashboardRoute?.component).toBe(DashboardComponent);
    });

    it('should have an auth-success route with path "auth-success"', () => {
      const authSuccessRoute = routes.find((r) => r.path === 'auth-success');
      expect(authSuccessRoute).toBeDefined();
      expect(authSuccessRoute?.component).toBe(AuthSuccessComponent);
    });

    it('should have a home page route with empty path ""', () => {
      const homeRoute = routes.find((r) => r.path === '');
      expect(homeRoute).toBeDefined();
      expect(homeRoute?.component).toBe(HomePageComponent);
    });

    it('should have the dashboard route as the first route', () => {
      expect(routes[0].path).toBe('dashboard');
      expect(routes[0].component).toBe(DashboardComponent);
    });

    it('should have the auth-success route as the second route', () => {
      expect(routes[1].path).toBe('auth-success');
      expect(routes[1].component).toBe(AuthSuccessComponent);
    });

    it('should have the home page route as the third route', () => {
      expect(routes[2].path).toBe('');
      expect(routes[2].component).toBe(HomePageComponent);
    });

    it('should have a component defined for every route', () => {
      routes.forEach((route) => {
        expect(route.component).toBeDefined();
      });
    });

    it('should not have any redirect routes', () => {
      routes.forEach((route) => {
        expect(route.redirectTo).toBeUndefined();
      });
    });

    it('should not have any wildcard routes', () => {
      routes.forEach((route) => {
        expect(route.path).not.toBe('**');
      });
    });
  });
});
