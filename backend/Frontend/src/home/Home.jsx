import React from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Categories from '../components/Categories';

function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Banner />
        <Categories />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
