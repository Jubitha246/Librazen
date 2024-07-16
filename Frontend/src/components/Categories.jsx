import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from './Cards';
import { useNavigate } from 'react-router-dom';

function Categories() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Popular Books', image: '/images/Popular1.jpg' },
    { name: 'New Arrivals', image: '/images/Popular1.jpg' },
    { name: 'Genres', image: '/images/Popular1.jpg' },
    { name: 'Recommended Reads', image: '/images/Popular1.jpg' },
    { name: 'E-books', image: '/images/Popular1.jpg' },
    { name: 'Children\'s Books', image: '/images/Popular1.jpg' },
  ];

  const handleViewClick = () => {
    navigate('/signup');
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 ">
      <div>
        <h1 className="font-semibold text-xl pb-2">Categories</h1>
      </div>
      <Slider {...settings}>
        {categories.map((category, index) => (
          <div key={index} className="p-2">
            <Cards category={category} handleViewClick={handleViewClick} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Categories;

