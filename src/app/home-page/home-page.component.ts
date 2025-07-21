import { Component } from '@angular/core';
import { FacebookLoginButtonComponent } from "../facebook-login-button/facebook-login-button.component";

@Component({
  selector: 'app-home-page',
  imports: [FacebookLoginButtonComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <!-- Header Section -->
      <header class="bg-white shadow-sm border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <img src="/post-vector-logo-mark.png" alt="PostVector Logo" class="h-10 w-10">
              <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <!-- Main Heading -->
          <h2 class="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Social Media
            <span class="bg-gradient-to-r from-[#1364C2] to-[#17BE98] bg-clip-text text-transparent">
              Simplified
            </span>
          </h2>

          <!-- Subtitle -->
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            An open source community project to help developers learn system design.
            Build, schedule, and manage your social media presence like Buffer or Hootsuite.
          </p>

          <img src="/post-vector-logo-transparent.png" alt="PostVector Logo" class="h-100 w-100 mx-auto mb-8">

          <!-- Feature Cards -->
          <div class="grid md:grid-cols-3 gap-8 mb-12 mt-16">
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div class="w-12 h-12 bg-gradient-to-r from-[#1364C2] to-[#17BE98] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span class="text-white text-xl">📅</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Schedule Posts</h3>
              <p class="text-gray-600">Plan and schedule your content across multiple social media platforms</p>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div class="w-12 h-12 bg-gradient-to-r from-[#1364C2] to-[#17BE98] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span class="text-white text-xl">👥</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p class="text-gray-600">Work together with your team to create and manage content</p>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div class="w-12 h-12 bg-gradient-to-r from-[#1364C2] to-[#17BE98] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span class="text-white text-xl">📊</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p class="text-gray-600">Track performance and engagement across all your social channels</p>
            </div>
          </div>

          <!-- CTA Section -->
          <div class="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Get Started Today</h3>
            <p class="text-gray-600 mb-6">Connect your social media accounts and start managing your content like a pro.</p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <app-facebook-login-button />
              <div class="text-sm text-gray-500">
                More platforms coming soon: Instagram, Twitter, LinkedIn
              </div>
            </div>
          </div>

          <!-- Footer Info -->
          <div class="mt-16 text-center">
            <p class="text-gray-500 text-sm">
              Open source • Community driven • Built for learning
            </p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: ``
})
export class HomePageComponent {
  title = 'PostVector';
}
