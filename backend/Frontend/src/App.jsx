import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './home/Home';
import Catalogues from './Catalogues/Catalogues';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import AdminProfile from './components/AdminProfile';
import AdminPortal from './components/AdminPortal';
import AdminAnalytics from './components/AdminAnalytics';
import AdminSettings from './components/AdminSettings';
import Leaderboard from './components/Leaderboard';
import AboutUs from './components/AboutUs';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthProvider';

function App() {
  const [authUser, setAuthUser] = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Catalogue" element={authUser ? <Catalogues /> : <Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user/profile" element={authUser ? <UserProfile /> : <Navigate to="/signup" />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admin" element={authUser?.role === 'admin' ? <AdminPortal /> : <Navigate to="/signup" />} />
        <Route path="/admin/profile" element={authUser?.role === 'admin' ? <AdminProfile /> : <Navigate to="/signup" />} />
        <Route path="/admin/analytics" element={authUser?.role === 'admin' ? <AdminAnalytics /> : <Navigate to="/signup" />} />
        <Route path="/admin/settings" element={authUser?.role === 'admin' ? <AdminSettings /> : <Navigate to="/signup" />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
