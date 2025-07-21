import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-success',
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
            <a href="/" class="text-[#1364C2] hover:text-[#17BE98] font-medium transition-colors">
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      <!-- Success Content -->
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <!-- Success Icon -->
          <div class="mx-auto w-20 h-20 bg-gradient-to-r from-[#17BE98] to-[#1364C2] rounded-full flex items-center justify-center mb-8">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <!-- Main Heading -->
          <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            <span class="bg-gradient-to-r from-[#17BE98] to-[#1364C2] bg-clip-text text-transparent">
              Authentication Successful!
            </span>
          </h2>

          <!-- Success Message -->
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Great! Your Facebook account has been successfully connected to PostVector.
            You can now start scheduling and managing your social media posts.
          </p>

          <!-- Next Steps Cards -->
          <!-- <div class="grid md:grid-cols-2 gap-6 mb-12 mt-16">
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div class="w-12 h-12 bg-gradient-to-r from-[#1364C2] to-[#17BE98] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span class="text-white text-xl">✍️</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Create Your First Post</h3>
              <p class="text-gray-600 mb-4">Start crafting engaging content for your audience</p>
              <button class="w-full bg-gradient-to-r from-[#1364C2] to-[#17BE98] text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                Create Post
              </button>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div class="w-12 h-12 bg-gradient-to-r from-[#1364C2] to-[#17BE98] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span class="text-white text-xl">⚙️</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Configure Settings</h3>
              <p class="text-gray-600 mb-4">Set up your posting preferences and schedule</p>
              <button class="w-full bg-white border-2 border-[#1364C2] text-[#1364C2] font-medium py-2 px-4 rounded-lg hover:bg-[#1364C2] hover:text-white transition-colors">
                Go to Settings
              </button>
            </div>
          </div> -->

          <!-- Connected Account Info -->
          <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <div class="flex items-center justify-center mb-4">
              <div class="w-8 h-8 bg-[#1877F2] rounded-lg flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Facebook Connected</h3>
              <div class="ml-auto">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ● Active
                </span>
              </div>
            </div>
            <p class="text-gray-600 text-sm mb-4">
              Your Facebook account is now connected and ready for posting. You can manage your connection in settings.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button class="flex-1 bg-gradient-to-r from-[#1364C2] to-[#17BE98] text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                View Dashboard
              </button>
              <button class="flex-1 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Test Connection
              </button>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/" class="text-[#1364C2] hover:text-[#17BE98] font-medium transition-colors">
              ← Return to Home
            </a>
            <span class="text-gray-300 hidden sm:block">|</span>
            <button class="text-gray-500 hover:text-gray-700 font-medium transition-colors">
              Connect Another Account
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: ``
})
export class AuthSuccessComponent {

}
