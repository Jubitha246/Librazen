import React from 'react';
import Navbar from '../components/Navbar';
import Catalogue from '../components/Catalogue';
import Footer from '../components/Footer';

function Catalogues() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Catalogue />
      </div>
      <Footer />
    </div>
  );
}

export default Catalogues;