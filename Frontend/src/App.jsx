import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './home/Home';
import Catalogues from './Catalogues/Catalogues';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile'; // Add this import
import AdminProfile from './components/AdminProfile';
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
        <Route path="/user/profile" element={authUser ? <UserProfile /> : <Navigate to="/signup" />} /> {/* Add this route */}
        <Route path ="/admin/profile" element={authUser?.role === 'admin' ? <AdminProfile /> : <Navigate to="/signup" />}/>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
