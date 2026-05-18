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
import { DashboardComponent } from './dashboard.component';

const mockComponent = Component as jest.Mock;

describe('DashboardComponent', () => {
  let component: DashboardComponent;

  beforeAll(() => {
    component = new DashboardComponent();
  });

  describe('instantiation', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });

    it('should be an instance of DashboardComponent', () => {
      expect(component instanceof DashboardComponent).toBe(true);
    });
  });

  describe('@Component decorator metadata', () => {
    let metadata: Record<string, unknown>;

    beforeAll(() => {
      metadata = mockComponent.mock.calls[0][0] as Record<string, unknown>;
    });

    it('should have the selector "app-dashboard"', () => {
      expect(metadata['selector']).toBe('app-dashboard');
    });

    it('should have an empty imports array', () => {
      const imports = metadata['imports'] as unknown[];
      expect(Array.isArray(imports)).toBe(true);
      expect(imports.length).toBe(0);
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

    describe('overall layout', () => {
      it('should use a gradient background', () => {
        expect(template).toContain('bg-gradient-to-br');
        expect(template).toContain('from-blue-50');
        expect(template).toContain('to-green-50');
      });

      it('should have min-h-screen class', () => {
        expect(template).toContain('min-h-screen');
      });

      it('should use max-w-7xl for main content containers', () => {
        const maxWMatches = template.match(/max-w-7xl/g);
        expect(maxWMatches).not.toBeNull();
        expect(maxWMatches!.length).toBeGreaterThanOrEqual(2);
      });
    });

    describe('header section', () => {
      it('should contain a header element with white background and shadow', () => {
        expect(template).toContain('<header');
        expect(template).toContain('bg-white');
        expect(template).toContain('shadow-sm');
      });

      it('should contain the logo image', () => {
        expect(template).toContain('src="/post-vector-logo-mark.png"');
        expect(template).toContain('alt="PostVector Logo"');
        expect(template).toContain('h-10 w-10');
      });

      it('should display the PostVector brand name', () => {
        expect(template).toContain('PostVector');
      });

      it('should have Settings button', () => {
        expect(template).toContain('Settings');
      });

      it('should have Help button', () => {
        expect(template).toContain('Help');
      });

      it('should have a Sign Out link pointing to home', () => {
        expect(template).toContain('href="/"');
        expect(template).toContain('Sign Out');
      });

      it('should use brand colors for Sign Out link', () => {
        expect(template).toContain('text-[#1364C2]');
        expect(template).toContain('hover:text-[#17BE98]');
      });

      it('should have responsive header padding', () => {
        expect(template).toContain('px-4');
        expect(template).toContain('sm:px-6');
        expect(template).toContain('lg:px-8');
      });
    });

    describe('welcome section', () => {
      it('should contain the welcome heading', () => {
        expect(template).toContain('Welcome to your');
      });

      it('should display Dashboard with gradient text', () => {
        expect(template).toContain('Dashboard');
        expect(template).toContain('bg-gradient-to-r');
        expect(template).toContain('from-[#1364C2]');
        expect(template).toContain('to-[#17BE98]');
        expect(template).toContain('bg-clip-text');
        expect(template).toContain('text-transparent');
      });

      it('should contain the subtitle about managing social media', () => {
        expect(template).toContain('Manage your social media presence from one central location.');
      });
    });

    describe('quick actions grid', () => {
      it('should use a responsive grid layout with 4 columns on large screens', () => {
        expect(template).toContain('grid');
        expect(template).toContain('lg:grid-cols-4');
        expect(template).toContain('md:grid-cols-2');
      });

      it('should have 4 quick action cards', () => {
        const cardCount = (template.match(/Create Post|Schedule|Analytics|Content/g) || []).length;
        expect(cardCount).toBeGreaterThanOrEqual(4);
      });
    });

    describe('Create Post card', () => {
      it('should contain the Create Post title', () => {
        expect(template).toContain('Create Post');
      });

      it('should contain the pen emoji icon', () => {
        expect(template).toContain('✍️');
      });

      it('should have description about crafting social media posts', () => {
        expect(template).toContain('Craft and schedule your next social media post');
      });

      it('should have a Get Started button with gradient background', () => {
        expect(template).toContain('Get Started');
        expect(template).toContain('bg-gradient-to-r from-[#1364C2] to-[#17BE98]');
      });
    });

    describe('Schedule card', () => {
      it('should contain the Schedule title', () => {
        expect(template).toContain('Schedule');
      });

      it('should contain the calendar emoji icon', () => {
        expect(template).toContain('📅');
      });

      it('should have description about the posting calendar', () => {
        expect(template).toContain('View and manage your posting calendar');
      });

      it('should have a View Calendar button with border style', () => {
        expect(template).toContain('View Calendar');
        expect(template).toContain('border-2 border-[#1364C2]');
      });
    });

    describe('Analytics card', () => {
      it('should contain the Analytics title', () => {
        expect(template).toContain('Analytics');
      });

      it('should contain the chart emoji icon', () => {
        expect(template).toContain('📊');
      });

      it('should have description about tracking performance', () => {
        expect(template).toContain('Track your social media performance');
      });

      it('should have a View Stats button', () => {
        expect(template).toContain('View Stats');
      });
    });

    describe('Content Library card', () => {
      it('should contain the Content title', () => {
        expect(template).toContain('Content');
      });

      it('should contain the folder emoji icon', () => {
        expect(template).toContain('📁');
      });

      it('should have description about managing templates and media', () => {
        expect(template).toContain('Manage templates and media assets');
      });

      it('should have a Browse Library button', () => {
        expect(template).toContain('Browse Library');
      });
    });

    describe('card styling', () => {
      it('should use white rounded cards with shadow and border', () => {
        expect(template).toContain('bg-white');
        expect(template).toContain('rounded-xl');
        expect(template).toContain('shadow-lg');
        expect(template).toContain('border border-gray-100');
      });

      it('should have hover shadow effect on cards', () => {
        expect(template).toContain('hover:shadow-xl');
        expect(template).toContain('transition-shadow');
      });

      it('should use blue-50 background for card icons', () => {
        expect(template).toContain('bg-blue-50');
      });
    });

    describe('connected accounts section', () => {
      it('should contain the Connected Accounts heading', () => {
        expect(template).toContain('Connected Accounts');
      });

      it('should display Facebook as a connected account', () => {
        expect(template).toContain('Facebook');
        expect(template).toContain('Connected and active');
      });

      it('should show Facebook brand color', () => {
        expect(template).toContain('bg-[#1877F2]');
      });

      it('should have an Active status badge', () => {
        expect(template).toContain('Active');
        expect(template).toContain('bg-green-100');
        expect(template).toContain('text-green-800');
      });

      it('should have a Test button for Facebook', () => {
        expect(template).toContain('Test');
      });

      it('should have a Connect More Platforms section', () => {
        expect(template).toContain('Connect More Platforms');
      });

      it('should mention upcoming platforms', () => {
        expect(template).toContain('Instagram');
        expect(template).toContain('Twitter');
        expect(template).toContain('LinkedIn');
      });

      it('should have a Coming Soon button', () => {
        expect(template).toContain('Coming Soon');
      });

      it('should use dashed border for the add more section', () => {
        expect(template).toContain('border-dashed');
        expect(template).toContain('border-gray-300');
      });
    });

    describe('quick stats section', () => {
      it('should contain the Quick Stats heading', () => {
        expect(template).toContain('Quick Stats');
      });

      it('should display Posts This Week stat', () => {
        expect(template).toContain('Posts This Week');
      });

      it('should display Scheduled Posts stat', () => {
        expect(template).toContain('Scheduled Posts');
      });

      it('should display Total Engagement stat', () => {
        expect(template).toContain('Total Engagement');
      });
    });

    describe('recent activity section', () => {
      it('should contain the Recent Activity heading', () => {
        expect(template).toContain('Recent Activity');
      });

      it('should show no recent activity message', () => {
        expect(template).toContain('No recent activity');
      });

      it('should show prompt to create first post', () => {
        expect(template).toContain('Create your first post to get started');
      });
    });

    describe('quick actions sidebar', () => {
      it('should contain the Quick Actions heading', () => {
        expect(template).toContain('Quick Actions');
      });

      it('should have Test Facebook Connection action', () => {
        expect(template).toContain('Test Facebook Connection');
      });

      it('should have Account Settings action', () => {
        expect(template).toContain('Account Settings');
      });

      it('should have Help & Support action', () => {
        expect(template).toContain('Help & Support');
      });

      it('should use appropriate emojis for quick actions', () => {
        expect(template).toContain('🧪');
        expect(template).toContain('⚙️');
        expect(template).toContain('❓');
      });
    });

    describe('main content grid layout', () => {
      it('should use a 3-column grid with 2-column span for connected accounts', () => {
        expect(template).toContain('lg:grid-cols-3');
        expect(template).toContain('lg:col-span-2');
      });

      it('should have proper gap spacing', () => {
        expect(template).toContain('gap-8');
      });
    });

    describe('accessibility', () => {
      it('should have alt text on the logo image', () => {
        const imgMatches = template.match(/<img[^>]*>/g);
        expect(imgMatches).not.toBeNull();
        imgMatches?.forEach((img) => {
          expect(img).toContain('alt=');
        });
      });
    });

    describe('brand colors', () => {
      it('should use the primary blue color #1364C2', () => {
        expect(template).toContain('#1364C2');
      });

      it('should use the accent green color #17BE98', () => {
        expect(template).toContain('#17BE98');
      });
    });

    describe('typography', () => {
      it('should use proper heading sizes', () => {
        expect(template).toContain('text-2xl');
        expect(template).toContain('text-3xl');
        expect(template).toContain('text-xl');
        expect(template).toContain('text-lg');
      });

      it('should use proper text colors', () => {
        expect(template).toContain('text-gray-900');
        expect(template).toContain('text-gray-600');
        expect(template).toContain('text-gray-500');
        expect(template).toContain('text-gray-700');
      });

      it('should use font-bold for headings', () => {
        expect(template).toContain('font-bold');
        expect(template).toContain('font-semibold');
        expect(template).toContain('font-medium');
      });
    });

    describe('button styling', () => {
      it('should have cursor-pointer on interactive buttons', () => {
        expect(template).toContain('cursor-pointer');
      });

      it('should have transition effects on buttons', () => {
        expect(template).toContain('transition-colors');
        expect(template).toContain('transition-opacity');
      });

      it('should have proper button padding', () => {
        expect(template).toContain('py-2');
        expect(template).toContain('px-4');
      });

      it('should have rounded corners on buttons', () => {
        expect(template).toContain('rounded-lg');
      });
    });

    describe('responsive design', () => {
      it('should have responsive grid columns', () => {
        expect(template).toContain('lg:grid-cols-4');
        expect(template).toContain('md:grid-cols-2');
      });

      it('should have responsive padding', () => {
        expect(template).toContain('px-4');
        expect(template).toContain('sm:px-6');
        expect(template).toContain('lg:px-8');
      });
    });
  });
});
