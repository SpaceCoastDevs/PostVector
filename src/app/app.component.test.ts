/// <reference types="jest" />

jest.mock('@angular/core', () => ({
  Component: jest.fn((metadata: Record<string, unknown>) => {
    return (target: new (...args: unknown[]) => unknown) => {
      (target as unknown as Record<string, unknown>)['__componentMetadata'] = metadata;
      return target;
    };
  }),
}));

jest.mock('@angular/router', () => ({
  RouterOutlet: class RouterOutlet {},
}));

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';

const mockComponent = Component as jest.Mock;

describe('AppComponent', () => {
  let component: AppComponent;

  beforeAll(() => {
    component = new AppComponent();
  });

  describe('instantiation', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should be an instance of AppComponent', () => {
      expect(component instanceof AppComponent).toBe(true);
    });
  });

  describe('@Component decorator metadata', () => {
    let metadata: Record<string, unknown>;

    beforeAll(() => {
      metadata = mockComponent.mock.calls[0][0] as Record<string, unknown>;
    });

    it('should have the selector "app-root"', () => {
      expect(metadata['selector']).toBe('app-root');
    });

    it('should have RouterOutlet in imports', () => {
      const imports = metadata['imports'] as unknown[];
      expect(Array.isArray(imports)).toBe(true);
      expect(imports.length).toBe(1);
      expect(imports[0]).toBe(RouterOutlet);
    });

    it('should have an empty styles string', () => {
      expect(metadata['styles']).toBe('');
    });
  });

  describe('template', () => {
    let template: string;

    beforeAll(() => {
      const metadata = mockComponent.mock.calls[0][0] as Record<string, unknown>;
      template = metadata['template'] as string;
    });

    it('should contain a main element with class "main"', () => {
      expect(template).toContain('<main');
      expect(template).toContain('class="main"');
    });

    it('should contain a div with class "content"', () => {
      expect(template).toContain('<div');
      expect(template).toContain('class="content"');
    });

    it('should contain a router-outlet element', () => {
      expect(template).toContain('<router-outlet');
    });

    it('should have the correct nesting: main > div > router-outlet', () => {
      const mainIndex = template.indexOf('<main');
      const divIndex = template.indexOf('<div');
      const outletIndex = template.indexOf('<router-outlet');

      expect(mainIndex).toBeLessThan(divIndex);
      expect(divIndex).toBeLessThan(outletIndex);
    });
  });
});
