jest.mock('@angular/ssr', () => ({
  RenderMode: {
    Prerender: 'PRERENDER',
    Server: 'SERVER',
    Client: 'CLIENT',
  },
}));

import { RenderMode } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

describe('serverRoutes', () => {
  it('should be defined', () => {
    expect(serverRoutes).toBeDefined();
  });

  it('should be an array', () => {
    expect(Array.isArray(serverRoutes)).toBe(true);
  });

  it('should contain exactly one route', () => {
    expect(serverRoutes).toHaveLength(1);
  });

  it('should have a route with path "**" (wildcard)', () => {
    expect(serverRoutes[0].path).toBe('**');
  });

  it('should have renderMode set to Prerender', () => {
    expect(serverRoutes[0].renderMode).toBe(RenderMode.Prerender);
  });

  it('should match the expected ServerRoute shape', () => {
    const route = serverRoutes[0];
    expect(route).toEqual({
      path: '**',
      renderMode: RenderMode.Prerender,
    });
  });
});
