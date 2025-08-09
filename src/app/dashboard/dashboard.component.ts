import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <!-- Header Section -->
      <header class="bg-white shadow-sm border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <img src="/post-vector-logo-mark.png" alt="PostVector Logo" class="h-10 w-10">
              <h1 class="text-2xl font-bold text-gray-900">PostVector</h1>
            </div>
            <div class="flex items-center space-x-4">
              <button class="text-gray-500 hover:text-gray-700 font-medium transition-colors">
                Settings
              </button>
              <button class="text-gray-500 hover:text-gray-700 font-medium transition-colors">
                Help
              </button>
              <a href="/" class="text-[#1364C2] hover:text-[#17BE98] font-medium transition-colors">
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Dashboard Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your
            <span class="bg-gradient-to-r from-[#1364C2] to-[#17BE98] bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
          <p class="text-gray-600">Manage your social media presence from one central location.</p>
        </div>

        <!-- Quick Actions Grid -->
        <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8 items-stretch">
          <!-- Create New Post -->
          <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <span class="text-white text-xl">✍️</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Create Post</h3>
            </div>
            <p class="text-gray-600 text-sm mb-4">Craft and schedule your next social media post</p>
            <button class="mt-auto w-full bg-gradient-to-r from-[#1364C2] to-[#17BE98] text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
              Get Started
            </button>
          </div>

          <!-- Schedule Posts -->
          <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <span class="text-white text-xl">📅</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Schedule</h3>
            </div>
            <p class="text-gray-600 text-sm mb-4">View and manage your posting calendar</p>
            <button class="mt-auto w-full bg-white border-2 border-[#1364C2] text-[#1364C2] font-medium py-2 px-4 rounded-lg hover:bg-[#1364C2] hover:text-white transition-colors cursor-pointer">
              View Calendar
            </button>
          </div>

          <!-- Analytics -->
          <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <span class="text-white text-xl">📊</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Analytics</h3>
            </div>
            <p class="text-gray-600 text-sm mb-4">Track your social media performance</p>
            <button class="mt-auto w-full bg-white border-2 border-[#1364C2] text-[#1364C2] font-medium py-2 px-4 rounded-lg hover:bg-[#1364C2] hover:text-white transition-colors cursor-pointer">
              View Stats
            </button>
          </div>

          <!-- Content Library -->
          <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col h-full">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <span class="text-white text-xl">📁</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Content</h3>
            </div>
            <p class="text-gray-600 text-sm mb-4">Manage templates and media assets</p>
            <button class="mt-auto w-full bg-white border-2 border-[#1364C2] text-[#1364C2] font-medium py-2 px-4 rounded-lg hover:bg-[#1364C2] hover:text-white transition-colors cursor-pointer">
              Browse Library
            </button>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Connected Accounts -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Connected Accounts</h3>

              <!-- Facebook Account -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-[#1877F2] rounded-lg flex items-center justify-center mr-4">
                    <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">Facebook</h4>
                    <p class="text-sm text-gray-600">Connected and active</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ● Active
                  </span>
                  <button class="text-[#1364C2] hover:text-[#17BE98] text-sm font-medium transition-colors">
                    Test
                  </button>
                </div>
              </div>

              <!-- Add More Accounts -->
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span class="text-gray-400 text-xl">+</span>
                </div>
                <h4 class="font-medium text-gray-900 mb-2">Connect More Platforms</h4>
                <p class="text-sm text-gray-600 mb-4">Instagram, Twitter, LinkedIn coming soon</p>
                <button class="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Activity & Quick Stats -->
          <div class="space-y-6">
            <!-- Quick Stats -->
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Posts This Week</span>
                  <span class="font-semibold text-gray-900">0</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Scheduled Posts</span>
                  <span class="font-semibold text-gray-900">0</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Total Engagement</span>
                  <span class="font-semibold text-gray-900">-</span>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div class="text-center py-8">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span class="text-gray-400 text-xl">📝</span>
                </div>
                <p class="text-gray-600 text-sm">No recent activity</p>
                <p class="text-gray-500 text-xs mt-1">Create your first post to get started</p>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <span class="text-lg mr-3">🧪</span>
                  <span class="text-gray-700">Test Facebook Connection</span>
                </button>
                <button class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <span class="text-lg mr-3">⚙️</span>
                  <span class="text-gray-700">Account Settings</span>
                </button>
                <button class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <span class="text-lg mr-3">❓</span>
                  <span class="text-gray-700">Help & Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: ``
})
export class DashboardComponent {

}
