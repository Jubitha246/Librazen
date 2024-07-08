import React, { useState } from 'react';
import list from '../../public/list.json'; // Adjust the path as needed
import {Link} from 'react-router-dom';
// Mock user data
const mockUser = {
  isLoggedIn: true,
  isAdmin: false, // Change this to true for admin
};

function Catalogue() {
  const [user] = useState(mockUser);

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
      <div className="mt-28 items-center justify-center text-center">
      <h1 className="text-2xl md:text-4xl">
          We're delighted to have you{" "}
          <span className="text-blue-400"> Here! :)) </span>
        </h1>
        <p className="mt-12 text-lg">
          Welcome to the Librazen Catalogue! Here, you can explore our extensive collection of books, journals, and other resources. Our library management system is designed to help you find and access the materials you need with ease.
        </p>
       <Link to="/">
       <button className="mt-6 bg-slate-500 text-white px-2 py-2 rounded md hover:bg-slate-700 duration-300">
          Back
        </button>
       </Link>
        {list.map(category => (
          <div key={category.id} className="mt-12">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <div className="grid grid-cols-5 gap-8 mt-4">
              {category.books.slice(0, 5).map(book => (
                <div key={book.id} className="product-wrapper hover:scale-105 duartion-200">
                  <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <img src={book.image} alt={book.title} className="w-full" />
                    <div className="product-info p-4">
                      <h2 className="text-blue-950 font-semibold">{book.title}</h2>
                      {user.isLoggedIn && (
                        <button className="btn btn-primary hover:bg-blue-400 hover:text-white duration-200">
                          {user.isAdmin ? 'Add' : 'Borrow'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-8 mt-4">
              {category.books.slice(5, 9).map(book => (
                <div key={book.id} className="product-wrapper hover:scale-105 duartion-200">
                  <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <img src={book.image} alt={book.title} className="w-full" />
                    <div className="product-info p-4">
                      <h2 className="text-blue-950 font-semibold">{book.title}</h2>
                      {user.isLoggedIn && (
                        <button className="btn btn-primary hover:bg-blue-400 hover:text-white duration-200">
                          {user.isAdmin ? 'Add' : 'Borrow'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default Catalogue;
