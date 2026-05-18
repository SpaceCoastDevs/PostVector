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
  Router: jest.fn().mockImplementation(() => ({})),
  RouterLink: class RouterLink {},
}));

import { Component } from '@angular/core';
import { AuthSuccessComponent } from './auth-success.component';

const mockComponent = Component as jest.Mock;

describe('AuthSuccessComponent', () => {
  let component: AuthSuccessComponent;

  beforeAll(() => {
    component = new AuthSuccessComponent();
  });

  describe('instantiation', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should be an instance of AuthSuccessComponent', () => {
      expect(component instanceof AuthSuccessComponent).toBe(true);
    });
  });

  describe('@Component decorator metadata', () => {
    let metadata: Record<string, unknown>;

    beforeAll(() => {
      metadata = mockComponent.mock.calls[0][0] as Record<string, unknown>;
    });

    it('should have the selector "app-auth-success"', () => {
      expect(metadata['selector']).toBe('app-auth-success');
    });

    it('should have RouterLink in imports', () => {
      const imports = metadata['imports'] as unknown[];
      expect(Array.isArray(imports)).toBe(true);
      expect(imports.length).toBe(1);
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

    describe('header section', () => {
      it('should contain the PostVector logo image', () => {
        expect(template).toContain('/post-vector-logo-mark.png');
        expect(template).toContain('alt="PostVector Logo"');
      });

      it('should contain the PostVector brand name', () => {
        expect(template).toContain('PostVector');
      });

      it('should contain a link back to home', () => {
        expect(template).toContain('href="/"');
        expect(template).toContain('Back to Home');
      });
    });

    describe('success message section', () => {
      it('should contain a success checkmark SVG icon', () => {
        expect(template).toContain('<svg');
        expect(template).toContain('M5 13l4 4L19 7');
      });

      it('should contain the "Authentication Successful!" heading', () => {
        expect(template).toContain('Authentication Successful!');
      });

      it('should mention Facebook account connection', () => {
        expect(template).toContain('Facebook');
        expect(template).toContain('connected');
      });

      it('should mention scheduling and managing social media posts', () => {
        expect(template).toContain('scheduling');
        expect(template).toContain('managing');
      });
    });

    describe('connected account info section', () => {
      it('should contain the Facebook icon SVG', () => {
        expect(template).toContain('bg-[#1877F2]');
        expect(template).toContain('M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z');
      });

      it('should display "Facebook Connected" text', () => {
        expect(template).toContain('Facebook Connected');
      });

      it('should display an "Active" status badge', () => {
        expect(template).toContain('Active');
        expect(template).toContain('bg-green-100');
        expect(template).toContain('text-green-800');
      });

      it('should mention managing connection in settings', () => {
        expect(template).toContain('manage your connection in settings');
      });
    });

    describe('action buttons', () => {
      it('should contain a routerLink to /dashboard', () => {
        expect(template).toContain('[routerLink]');
        expect(template).toContain('/dashboard');
      });

      it('should contain "View Dashboard" text', () => {
        expect(template).toContain('View Dashboard');
      });

      it('should contain a "Test Connection" button', () => {
        expect(template).toContain('Test Connection');
      });

      it('should use gradient colors for primary actions', () => {
        expect(template).toContain('from-[#1364C2]');
        expect(template).toContain('to-[#17BE98]');
      });
    });

    describe('bottom actions section', () => {
      it('should contain a link to return to home', () => {
        expect(template).toContain('Return to Home');
      });

      it('should contain a "Connect Another Account" button', () => {
        expect(template).toContain('Connect Another Account');
      });
    });

    describe('styling and layout', () => {
      it('should use a gradient background', () => {
        expect(template).toContain('bg-gradient-to-br');
        expect(template).toContain('from-blue-50');
        expect(template).toContain('to-green-50');
      });

      it('should use responsive max-width containers', () => {
        expect(template).toContain('max-w-7xl');
        expect(template).toContain('max-w-4xl');
        expect(template).toContain('max-w-2xl');
      });

      it('should use Tailwind responsive padding classes', () => {
        expect(template).toContain('sm:px-6');
        expect(template).toContain('lg:px-8');
      });

      it('should use gradient text for the main heading', () => {
        expect(template).toContain('bg-gradient-to-r');
        expect(template).toContain('bg-clip-text');
        expect(template).toContain('text-transparent');
      });

      it('should use card styling for the connected account info', () => {
        expect(template).toContain('rounded-2xl');
        expect(template).toContain('shadow-xl');
        expect(template).toContain('border-gray-100');
      });
    });

    describe('accessibility', () => {
      it('should have alt text on the logo image', () => {
        expect(template).toContain('alt="PostVector Logo"');
      });

      it('should have alt text on the success icon container', () => {
        expect(template).toContain('alt=');
      });
    });
  });
});
