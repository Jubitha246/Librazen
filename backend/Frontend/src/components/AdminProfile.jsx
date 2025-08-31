import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate } from 'react-router-dom';

function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_ENDPOINTS.USER_PROFILE, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(response.data);
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <Navbar />
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        <div className="mt-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Admin Profile
            </h1>
            <p className="text-gray-600 text-lg">Manage your admin account and access library controls</p>
          </div>

          {/* Admin Info Card */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-xl font-bold text-gray-800">{admin?.fullname}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-xl font-bold text-gray-800">{admin?.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="text-xl font-bold text-gray-800 capitalize">{admin?.role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Books Issued</p>
                    <p className="text-xl font-bold text-gray-800">{admin?.booksIssued || 0}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Books Returned</p>
                    <p className="text-xl font-bold text-gray-800">{admin?.booksReturned || 0}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dues</p>
                    <p className="text-xl font-bold text-gray-800">${admin?.dues || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Library Management</h3>
              </div>
              <p className="text-gray-600 mb-4">Manage books, categories, and library inventory</p>
              <button
                onClick={() => navigate('/admin')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Go to Admin Portal
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Account Settings</h3>
              </div>
              <p className="text-gray-600 mb-4">Update your profile information and preferences</p>
              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Manage Settings
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Analytics Dashboard</h3>
              </div>
              <p className="text-gray-600 mb-4">View comprehensive library statistics and insights</p>
              <button
                onClick={() => navigate('/admin/analytics')}
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
