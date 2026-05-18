/// <reference types="jest" />

jest.mock('@angular/core', () => ({
  Component: jest.fn((metadata: Record<string, unknown>) => {
    return (target: new (...args: unknown[]) => unknown) => {
      (target as unknown as Record<string, unknown>)['__componentMetadata'] = metadata;
      return target;
    };
  }),
}));

jest.mock('../facebook-login-button/facebook-login-button.component', () => ({
  FacebookLoginButtonComponent: class FacebookLoginButtonComponent {},
}));

import { Component } from '@angular/core';
import { FacebookLoginButtonComponent } from '../facebook-login-button/facebook-login-button.component';
import { HomePageComponent } from './home-page.component';

const mockComponent = Component as jest.Mock;

describe('HomePageComponent', () => {
  let component: HomePageComponent;

  beforeAll(() => {
    component = new HomePageComponent();
  });

  describe('instantiation', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should be an instance of HomePageComponent', () => {
      expect(component instanceof HomePageComponent).toBe(true);
    });
  });

  describe('component properties', () => {
    it('should have title set to "PostVector"', () => {
      expect(component.title).toBe('PostVector');
    });
  });

  describe('@Component decorator metadata', () => {
    let metadata: Record<string, unknown>;

    beforeAll(() => {
      metadata = mockComponent.mock.calls[0][0] as Record<string, unknown>;
    });

    it('should have the selector "app-home-page"', () => {
      expect(metadata['selector']).toBe('app-home-page');
    });

    it('should have FacebookLoginButtonComponent in imports', () => {
      const imports = metadata['imports'] as unknown[];
      expect(Array.isArray(imports)).toBe(true);
      expect(imports.length).toBe(1);
      expect(imports[0]).toBe(FacebookLoginButtonComponent);
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
      it('should contain a header element', () => {
        expect(template).toContain('<header');
        expect(template).toContain('</header>');
      });

      it('should contain the logo image', () => {
        expect(template).toContain('src="/post-vector-logo-mark.png"');
        expect(template).toContain('alt="PostVector Logo"');
      });

      it('should bind the title property', () => {
        expect(template).toContain('{{ title }}');
      });

      it('should have responsive header padding', () => {
        expect(template).toContain('px-4');
        expect(template).toContain('sm:px-6');
        expect(template).toContain('lg:px-8');
      });
    });

    describe('hero section', () => {
      it('should contain a main element', () => {
        expect(template).toContain('<main');
        expect(template).toContain('</main>');
      });

      it('should contain the main heading "Social Media Simplified"', () => {
        expect(template).toContain('Social Media');
        expect(template).toContain('Simplified');
      });

      it('should use gradient text for "Simplified"', () => {
        expect(template).toContain('bg-gradient-to-r');
        expect(template).toContain('from-[#1364C2]');
        expect(template).toContain('to-[#17BE98]');
        expect(template).toContain('bg-clip-text');
        expect(template).toContain('text-transparent');
      });

      it('should contain the subtitle about open source', () => {
        expect(template).toContain('An open source community project to help developers learn system design.');
      });

      it('should mention Buffer and Hootsuite', () => {
        expect(template).toContain('Buffer');
        expect(template).toContain('Hootsuite');
      });

      it('should contain the transparent logo image', () => {
        expect(template).toContain('src="/post-vector-logo-transparent.png"');
        expect(template).toContain('alt="PostVector Logo"');
      });
    });

    describe('feature cards', () => {
      it('should have a 3-column grid layout', () => {
        expect(template).toContain('grid');
        expect(template).toContain('md:grid-cols-3');
      });

      it('should contain the "Schedule Posts" feature card', () => {
        expect(template).toContain('Schedule Posts');
        expect(template).toContain('Plan and schedule your content across multiple social media platforms');
        expect(template).toContain('📅');
      });

      it('should contain the "Team Collaboration" feature card', () => {
        expect(template).toContain('Team Collaboration');
        expect(template).toContain('Work together with your team to create and manage content');
        expect(template).toContain('👥');
      });

      it('should contain the "Analytics" feature card', () => {
        expect(template).toContain('Analytics');
        expect(template).toContain('Track performance and engagement across all your social channels');
        expect(template).toContain('📊');
      });

      it('should style feature cards with rounded corners and shadows', () => {
        expect(template).toContain('rounded-xl');
        expect(template).toContain('shadow-lg');
        expect(template).toContain('hover:shadow-xl');
        expect(template).toContain('transition-shadow');
      });

      it('should use gradient backgrounds for card icons', () => {
        expect(template).toContain('bg-gradient-to-r from-[#1364C2] to-[#17BE98]');
      });
    });

    describe('CTA section', () => {
      it('should contain "Get Started Today" heading', () => {
        expect(template).toContain('Get Started Today');
      });

      it('should contain the CTA description', () => {
        expect(template).toContain('Connect your social media accounts and start managing your content like a pro.');
      });

      it('should include the Facebook login button component', () => {
        expect(template).toContain('<app-facebook-login-button');
      });

      it('should mention upcoming platforms', () => {
        expect(template).toContain('More platforms coming soon');
        expect(template).toContain('Instagram');
        expect(template).toContain('Twitter');
        expect(template).toContain('LinkedIn');
      });

      it('should use responsive flex layout for CTA buttons', () => {
        expect(template).toContain('flex');
        expect(template).toContain('sm:flex-row');
        expect(template).toContain('gap-4');
      });
    });

    describe('footer info', () => {
      it('should contain the footer text', () => {
        expect(template).toContain('Open source');
        expect(template).toContain('Community driven');
        expect(template).toContain('Built for learning');
      });
    });

    describe('overall layout', () => {
      it('should use a gradient background', () => {
        expect(template).toContain('bg-gradient-to-br');
        expect(template).toContain('from-blue-50');
        expect(template).toContain('to-green-50');
      });

      it('should have min-h-screen class', () => {
        expect(template).toContain('min-h-screen');
      });

      it('should use max-w-7xl for content containers', () => {
        expect(template).toContain('max-w-7xl');
      });

      it('should have proper spacing with py-16', () => {
        expect(template).toContain('py-16');
      });

      it('should center text in the hero section', () => {
        expect(template).toContain('text-center');
      });
    });

    describe('typography', () => {
      it('should use large heading sizes', () => {
        expect(template).toContain('text-5xl');
        expect(template).toContain('sm:text-6xl');
      });

      it('should use proper text colors', () => {
        expect(template).toContain('text-gray-900');
        expect(template).toContain('text-gray-600');
        expect(template).toContain('text-gray-500');
      });

      it('should use font-bold for headings', () => {
        expect(template).toContain('font-bold');
      });

      it('should use proper line height for subtitle', () => {
        expect(template).toContain('leading-relaxed');
      });
    });

    describe('accessibility', () => {
      it('should have alt text on all images', () => {
        const imgMatches = template.match(/<img[^>]*>/g);
        expect(imgMatches).not.toBeNull();
        imgMatches?.forEach((img) => {
          expect(img).toContain('alt=');
        });
      });
    });
  });
});
