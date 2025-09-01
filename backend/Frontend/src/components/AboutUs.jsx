import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthProvider';

function AboutUs() {
  const [authUser] = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        <div className="mt-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              About Librazen
            </h1>
            <p className="text-gray-600 text-lg">Your digital gateway to knowledge and learning</p>
          </div>

          {/* Mission Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                To democratize access to knowledge by providing a modern, user-friendly digital library platform 
                that connects readers with books, fosters learning communities, and celebrates the joy of reading.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Extensive Collection</h3>
              <p className="text-gray-600">
                Browse through thousands of books across multiple categories including fiction, non-fiction, 
                science, technology, and more.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">User-Friendly Interface</h3>
              <p className="text-gray-600">
                Enjoy a seamless reading experience with our intuitive design, easy navigation, 
                and responsive layout that works on all devices.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Analytics</h3>
              <p className="text-gray-600">
                Track your reading progress, discover popular books, and get personalized recommendations 
                based on your reading history.
              </p>
            </div>
          </div>

          {/* Admin Features (if admin is logged in) */}
          {authUser?.role === 'admin' && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-2xl shadow-xl mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="text-white font-semibold mb-2">Book Management</h3>
                  <p className="text-white/80 text-sm">Add, edit, and organize library books</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="text-white font-semibold mb-2">User Management</h3>
                  <p className="text-white/80 text-sm">Monitor user activity and borrowing</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="text-white font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-white/80 text-sm">View comprehensive library statistics</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <h3 className="text-white font-semibold mb-2">Leaderboards</h3>
                  <p className="text-white/80 text-sm">Track top readers and popular books</p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Library Statistics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">Books Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">Access Available</div>
              </div>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-xl text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                Have questions, suggestions, or feedback? We'd love to hear from you! 
                Reach out to us and help us make Librazen even better.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:contact@librazen.com" 
                  className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200"
                >
                  📧 contact@librazen.com
                </a>
                <a 
                  href="tel:+1234567890" 
                  className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200"
                >
                  📞 +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
