import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate } from 'react-router-dom';

function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [usersWithBorrowedBooks, setUsersWithBorrowedBooks] = useState([]);
  const [overdueUsers, setOverdueUsers] = useState([]);
  const [libraryStats, setLibraryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAdditionalData, setLoadingAdditionalData] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // First, fetch admin profile quickly
        const adminResponse = await axios.get(API_ENDPOINTS.ADMIN_PROFILE, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(adminResponse.data);
        setLoading(false);

        // Then fetch additional data in parallel
        const [borrowedResponse, overdueResponse, statsResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.ADMIN_USERS_BORROWED, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(API_ENDPOINTS.ADMIN_USERS_OVERDUE, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(API_ENDPOINTS.ADMIN_STATISTICS, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUsersWithBorrowedBooks(borrowedResponse.data);
        setOverdueUsers(overdueResponse.data);
        setLibraryStats(statsResponse.data);

      } catch (error) {
        console.error('Error fetching admin data:', error);
        setLoading(false);
      } finally {
        setLoadingAdditionalData(false);
      }
    };

    fetchAdminData();
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Manage library operations and monitor user activities</p>
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
                    <p className="text-xl font-bold text-gray-800">{admin?.user?.fullname}</p>
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
                    <p className="text-xl font-bold text-gray-800">{admin?.user?.email}</p>
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
                    <p className="text-xl font-bold text-gray-800 capitalize">{admin?.user?.role}</p>
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
                    <p className="text-sm text-gray-600">Total Books</p>
                    <p className="text-xl font-bold text-gray-800">
                      {loadingAdditionalData ? (
                        <div className="animate-pulse bg-gray-300 h-6 w-16 rounded"></div>
                      ) : (
                        libraryStats?.totalBooks || 0
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Books Borrowed</p>
                    <p className="text-xl font-bold text-gray-800">
                      {loadingAdditionalData ? (
                        <div className="animate-pulse bg-gray-300 h-6 w-16 rounded"></div>
                      ) : (
                        libraryStats?.totalBorrowedBooks || 0
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Overdue Books</p>
                    <p className="text-xl font-bold text-gray-800">
                      {loadingAdditionalData ? (
                        <div className="animate-pulse bg-gray-300 h-6 w-16 rounded"></div>
                      ) : (
                        libraryStats?.overdueBooks || 0
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Library Overview
              </button>
              <button
                onClick={() => setActiveTab('borrowed')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'borrowed'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Users with Borrowed Books ({loadingAdditionalData ? '...' : usersWithBorrowedBooks.length})
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'overdue'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Overdue Users ({loadingAdditionalData ? '...' : overdueUsers.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Library Statistics */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-8 h-8 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Library Statistics
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Users</p>
                        <p className="text-3xl font-bold">
                          {loadingAdditionalData ? (
                            <div className="animate-pulse bg-blue-300 h-8 w-16 rounded"></div>
                          ) : (
                            libraryStats?.totalUsers || 0
                          )}
                        </p>
                      </div>
                      <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Total Books</p>
                        <p className="text-3xl font-bold">
                          {loadingAdditionalData ? (
                            <div className="animate-pulse bg-green-300 h-8 w-16 rounded"></div>
                          ) : (
                            libraryStats?.totalBooks || 0
                          )}
                        </p>
                      </div>
                      <svg className="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Books Borrowed</p>
                        <p className="text-3xl font-bold">
                          {loadingAdditionalData ? (
                            <div className="animate-pulse bg-purple-300 h-8 w-16 rounded"></div>
                          ) : (
                            libraryStats?.totalBorrowedBooks || 0
                          )}
                        </p>
                      </div>
                      <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100">Overdue Books</p>
                        <p className="text-3xl font-bold">
                          {loadingAdditionalData ? (
                            <div className="animate-pulse bg-red-300 h-8 w-16 rounded"></div>
                          ) : (
                            libraryStats?.overdueBooks || 0
                          )}
                        </p>
                      </div>
                      <svg className="w-12 h-12 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category Statistics */}
                {libraryStats?.categoryStats && libraryStats.categoryStats.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Books by Category</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {libraryStats.categoryStats.map((category, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-800 capitalize">{category._id}</h5>
                          <p className="text-gray-600">Total: {category.count}</p>
                          <p className="text-gray-600">Available: {category.available}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'borrowed' && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Users with Borrowed Books
              </h3>

              {usersWithBorrowedBooks.length > 0 ? (
                <div className="space-y-6">
                  {usersWithBorrowedBooks.map((user) => (
                    <div key={user._id} className="bg-gray-50 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">{user.fullname}</h4>
                          <p className="text-gray-600">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Active Borrows</p>
                          <p className="text-2xl font-bold text-blue-600">{user.activeBorrows}</p>
                        </div>
                      </div>
                      
                      {user.borrowedBooks.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700">Currently Borrowed Books:</h5>
                          {user.borrowedBooks.map((borrow, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-gray-800">{borrow.book.title}</p>
                                  <p className="text-sm text-gray-600">Author: {borrow.book.author}</p>
                                  <p className="text-sm text-gray-600">Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}</p>
                                  <p className="text-sm text-gray-600">Due: {new Date(borrow.dueDate).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    new Date(borrow.dueDate) < new Date()
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {new Date(borrow.dueDate) < new Date() ? 'Overdue' : 'Active'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <p className="text-xl text-gray-600">No users with borrowed books</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overdue' && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                Overdue Users
              </h3>

              {overdueUsers.length > 0 ? (
                <div className="space-y-6">
                  {overdueUsers.map((user) => (
                    <div key={user._id} className="bg-red-50 p-6 rounded-xl border-l-4 border-red-500">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">{user.fullname}</h4>
                          <p className="text-gray-600">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Fine</p>
                          <p className="text-2xl font-bold text-red-600">₹{user.totalFine}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold text-red-700">Overdue Books ({user.totalOverdue}):</h5>
                        {user.overdueBooks.map((overdue, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-gray-800">{overdue.book.title}</p>
                                <p className="text-sm text-gray-600">Author: {overdue.book.author}</p>
                                <p className="text-sm text-gray-600">Borrowed: {new Date(overdue.borrowDate).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600">Due: {new Date(overdue.dueDate).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-red-600 font-semibold">{overdue.daysOverdue} days overdue</p>
                                <p className="text-lg font-bold text-red-600">₹{overdue.fine}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-xl text-gray-600">No overdue users! All books are returned on time.</p>
                </div>
              )}
            </div>
          )}

          {/* Admin Actions */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
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
