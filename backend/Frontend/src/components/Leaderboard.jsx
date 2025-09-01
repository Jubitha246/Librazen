import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthProvider';

function Leaderboard() {
  const [authUser] = useAuth();
  const [leaderboardData, setLeaderboardData] = useState({
    topReaders: [],
    mostBorrowedBooks: [],
    topCategories: [],
    recentAchievements: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('readers');

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch comprehensive leaderboard data
        const [statsResponse, booksResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.ADMIN_STATISTICS, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(API_ENDPOINTS.BOOKS, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const stats = statsResponse.data;
        const books = booksResponse.data;

        // Process leaderboard data
        const topReaders = stats.topReaders || [];
        const mostBorrowedBooks = stats.popularBooks || [];
        const topCategories = stats.categoryStats || [];

        // Generate achievements based on data
        const recentAchievements = generateAchievements(topReaders, mostBorrowedBooks);

        setLeaderboardData({
          topReaders,
          mostBorrowedBooks,
          topCategories,
          recentAchievements
        });

      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const generateAchievements = (readers, books) => {
    const achievements = [];
    
    if (readers.length > 0) {
      const topReader = readers[0];
      if (topReader.booksRead >= 10) {
        achievements.push({
          id: 1,
          title: "Bookworm Champion",
          description: `${topReader.fullname} has read ${topReader.booksRead} books!`,
          icon: "📚",
          type: "reading",
          date: new Date().toISOString()
        });
      }
    }

    if (books.length > 0) {
      const popularBook = books[0];
      if (popularBook.borrowCount >= 5) {
        achievements.push({
          id: 2,
          title: "Popular Choice",
          description: `"${popularBook.title}" has been borrowed ${popularBook.borrowCount} times!`,
          icon: "🔥",
          type: "popularity",
          date: new Date().toISOString()
        });
      }
    }

    // Add some general achievements
    achievements.push({
      id: 3,
      title: "Library Milestone",
      description: "Library has reached 100+ books in collection!",
      icon: "🎉",
      type: "milestone",
      date: new Date().toISOString()
    });

    return achievements;
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `#${index + 1}`;
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0: return "from-yellow-400 to-yellow-600";
      case 1: return "from-gray-300 to-gray-500";
      case 2: return "from-orange-400 to-orange-600";
      default: return "from-blue-400 to-blue-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />
      <div className="container mx-auto max-w-screen-xl px-4 py-8">
        <div className="mt-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Leaderboard & Achievements
            </h1>
            <p className="text-gray-600 text-lg">Discover top readers, popular books, and library achievements</p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('readers')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'readers'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Top Readers
              </button>
              <button
                onClick={() => setActiveTab('books')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'books'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Popular Books
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'categories'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Top Categories
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'achievements'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Achievements
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'readers' && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-8 h-8 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                Top Readers
              </h3>

              {leaderboardData.topReaders.length > 0 ? (
                <div className="space-y-4">
                  {leaderboardData.topReaders.map((reader, index) => (
                    <div key={reader._id || index} className={`bg-gradient-to-r ${getRankColor(index)} p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-all duration-200`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-4xl mr-4">{getRankIcon(index)}</div>
                          <div>
                            <h4 className="text-2xl font-bold">{reader.fullname}</h4>
                            <p className="text-white/80">Books Read: {reader.booksRead}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{reader.booksRead}</div>
                          <div className="text-white/80 text-sm">books</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  <p className="text-xl text-gray-600">No reader data available yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'books' && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-8 h-8 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Most Popular Books
              </h3>

              {leaderboardData.mostBorrowedBooks.length > 0 ? (
                <div className="space-y-4">
                  {leaderboardData.mostBorrowedBooks.map((book, index) => (
                    <div key={book._id || index} className={`bg-gradient-to-r ${getRankColor(index)} p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-all duration-200`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-4xl mr-4">{getRankIcon(index)}</div>
                          <div>
                            <h4 className="text-2xl font-bold">{book.title}</h4>
                            <p className="text-white/80">by {book.author}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{book.borrowCount || book.borrows}</div>
                          <div className="text-white/80 text-sm">borrows</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <p className="text-xl text-gray-600">No book data available yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-8 h-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                Popular Categories
              </h3>

              {leaderboardData.topCategories.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leaderboardData.topCategories.map((category, index) => (
                    <div key={category._id || index} className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-3xl">{getRankIcon(index)}</div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{category.count}</div>
                          <div className="text-green-100 text-sm">books</div>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold capitalize">{category._id}</h4>
                      <p className="text-green-100 mt-2">Available: {category.available}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <p className="text-xl text-gray-600">No category data available yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-8 h-8 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
                Recent Achievements
              </h3>

              {leaderboardData.recentAchievements.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leaderboardData.recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                      <div className="flex items-center mb-4">
                        <div className="text-4xl mr-4">{achievement.icon}</div>
                        <div>
                          <h4 className="text-xl font-bold">{achievement.title}</h4>
                          <p className="text-yellow-100 text-sm">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-yellow-100">{achievement.description}</p>
                      <div className="mt-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          achievement.type === 'reading' ? 'bg-blue-500' :
                          achievement.type === 'popularity' ? 'bg-red-500' :
                          'bg-green-500'
                        }`}>
                          {achievement.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                  <p className="text-xl text-gray-600">No achievements unlocked yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
