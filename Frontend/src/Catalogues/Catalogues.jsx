import React from 'react';
import Navbar from '../components/Navbar';
import Catalogue from '../components/Catalogue';
import Footer from '../components/Footer';
function Catalogues() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen">
    <Catalogue/>
    </div>
    <Footer/>
    </>
  )
}


export default Catalogues;