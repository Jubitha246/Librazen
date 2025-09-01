import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { API_ENDPOINTS } from '../config/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalBorrows: 0,
    overdueBooks: 0,
    popularBooks: [],
    categoryDistribution: [],
    monthlyBorrows: [],
    userActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.ADMIN_STATISTICS, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const stats = response.data;
      setAnalytics({
        totalBooks: stats.totalBooks || 0,
        totalUsers: stats.totalUsers || 0,
        totalBorrows: stats.totalBorrowedBooks || 0,
        overdueBooks: stats.overdueBooks || 0,
        popularBooks: stats.popularBooks?.map(book => ({
          title: book.title,
          borrows: book.borrowCount
        })) || [],
        categoryDistribution: stats.categoryStats?.map(cat => ({
          category: cat._id,
          count: cat.count
        })) || [],
        monthlyBorrows: stats.monthlyBorrows || [],
        userActivity: stats.topReaders?.map(user => ({
          user: user.fullname,
          booksRead: user.booksRead
        })) || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set empty data instead of mock data
      setAnalytics({
        totalBooks: 0,
        totalUsers: 0,
        totalBorrows: 0,
        overdueBooks: 0,
        popularBooks: [],
        categoryDistribution: [],
        monthlyBorrows: [],
        userActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const monthlyBorrowsData = {
    labels: analytics.monthlyBorrows.map(item => item.month),
    datasets: [
      {
        label: 'Books Borrowed',
        data: analytics.monthlyBorrows.map(item => item.borrows),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: analytics.categoryDistribution.map(item => item.category),
    datasets: [
      {
        data: analytics.categoryDistribution.map(item => item.count),
        backgroundColor: [
          '#8B5CF6',
          '#06B6D4',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#EC4899'
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const popularBooksData = {
    labels: analytics.popularBooks.map(item => item.title),
    datasets: [
      {
        label: 'Times Borrowed',
        data: analytics.popularBooks.map(item => item.borrows),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  };

  const userActivityData = {
    labels: analytics.userActivity.map(item => item.user),
    datasets: [
      {
        label: 'Books Read',
        data: analytics.userActivity.map(item => item.booksRead),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        <div className="mt-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Library Analytics
            </h1>
            <p className="text-gray-600 text-lg">Comprehensive insights into your library's performance</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-800">{analytics.totalBooks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{analytics.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Borrows</p>
                  <p className="text-2xl font-bold text-gray-800">{analytics.totalBorrows}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overdue Books</p>
                  <p className="text-2xl font-bold text-gray-800">{analytics.overdueBooks}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Borrows Chart */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Borrowing Trends</h3>
              <div className="h-64">
                {analytics.monthlyBorrows.length > 0 ? (
                <Line 
                  data={monthlyBorrowsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No borrowing data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Book Categories Distribution</h3>
              <div className="h-64">
                {analytics.categoryDistribution.length > 0 ? (
                <Doughnut 
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No category data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Books */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Most Popular Books</h3>
              <div className="h-64">
                {analytics.popularBooks.length > 0 ? (
                <Bar 
                  data={popularBooksData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No popular books data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* User Activity */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Readers</h3>
              <div className="h-64">
                {analytics.userActivity.length > 0 ? (
                <Bar 
                  data={userActivityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No user activity data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
