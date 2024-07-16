import React from 'react';

function Cards({ category, handleViewClick }) {
  return (
    <div className="card bg-white w-92 shadow-xl hover:scale-105 duration-200">
      <figure>
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-50 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{category.name}</h2>
        <div className="card-actions justify-end">
          <button 
            className="btn btn-primary hover:bg-blue-400 hover:text-white duration-200"
            onClick={handleViewClick}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cards;
