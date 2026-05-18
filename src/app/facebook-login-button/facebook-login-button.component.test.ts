/// <reference types="jest" />

jest.mock('@angular/core', () => ({
  Component: jest.fn((metadata: Record<string, unknown>) => {
    return (target: new (...args: unknown[]) => unknown) => {
      (target as unknown as Record<string, unknown>)['__componentMetadata'] = metadata;
      return target;
    };
  }),
}));

import { Component } from '@angular/core';
import { FacebookLoginButtonComponent } from './facebook-login-button.component';

const mockComponent = Component as jest.Mock;

describe('FacebookLoginButtonComponent', () => {
  let component: FacebookLoginButtonComponent;

  beforeAll(() => {
    component = new FacebookLoginButtonComponent();
  });

  describe('instantiation', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should be an instance of FacebookLoginButtonComponent', () => {
      expect(component instanceof FacebookLoginButtonComponent).toBe(true);
    });
  });

  describe('@Component decorator metadata', () => {
    let metadata: Record<string, unknown>;

    beforeAll(() => {
      metadata = mockComponent.mock.calls[0][0] as Record<string, unknown>;
    });

    it('should have the selector "app-facebook-login-button"', () => {
      expect(metadata['selector']).toBe('app-facebook-login-button');
    });

    it('should have an empty imports array', () => {
      expect(metadata['imports']).toEqual([]);
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

    it('should contain an anchor tag with href="/api/auth/facebook"', () => {
      expect(template).toContain('href="/api/auth/facebook"');
    });

    it('should contain the text "Continue with Facebook"', () => {
      expect(template).toContain('Continue with Facebook');
    });

    it('should contain an SVG icon for Facebook', () => {
      expect(template).toContain('<svg');
      expect(template).toContain('viewBox="0 0 24 24"');
      expect(template).toContain('fill="currentColor"');
    });

    it('should contain the Facebook logo path', () => {
      expect(template).toContain('<path');
      expect(template).toContain('M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z');
    });

    it('should use the Facebook brand color (#1877F2)', () => {
      expect(template).toContain('bg-[#1877F2]');
    });

    it('should use a darker hover color (#166FE5)', () => {
      expect(template).toContain('hover:bg-[#166FE5]');
    });

    it('should have white text', () => {
      expect(template).toContain('text-white');
    });

    it('should have font-semibold class', () => {
      expect(template).toContain('font-semibold');
    });

    it('should have rounded corners', () => {
      expect(template).toContain('rounded-lg');
    });

    it('should have shadow effects', () => {
      expect(template).toContain('shadow-lg');
      expect(template).toContain('hover:shadow-xl');
    });

    it('should have transition classes', () => {
      expect(template).toContain('transition-all');
      expect(template).toContain('duration-200');
    });

    it('should have focus accessibility classes', () => {
      expect(template).toContain('focus:outline-none');
      expect(template).toContain('focus:ring-4');
      expect(template).toContain('focus:ring-blue-300');
    });

    it('should use flexbox layout', () => {
      expect(template).toContain('inline-flex');
      expect(template).toContain('items-center');
    });

    it('should have proper padding', () => {
      expect(template).toContain('px-6');
      expect(template).toContain('py-3');
    });

    it('should have proper SVG sizing', () => {
      expect(template).toContain('w-5');
      expect(template).toContain('h-5');
    });

    it('should have margin between icon and text', () => {
      expect(template).toContain('mr-3');
    });
  });
});
