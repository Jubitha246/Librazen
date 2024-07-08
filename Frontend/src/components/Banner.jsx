import React from 'react'
import banner from "../../public/Banner1.png"
function Banner() {
  return (
    <>
    <div className="max w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row my-10">
    <div className="order-2 md:order-1 w-full md:w-1/2 mt-10 md:mt-32">
    <div className="space-y-10">
    <h1 className="text-4xl font-bold">Explore, Discover, and Manage Your Library with{" "}<span className="text-blue-400">Librazen!!</span></h1><p className="text-xl">
    Efficiently manage catalogs, streamline operations, and enhance<br/>library accessibility with digital lending and analytics. Librazen<br/>empowers libraries with advanced tools for seamless resource <br/>management and improved patron experiences in the digital era.</p>
    </div>
    <button className="btn btn-info mt-4">Get started</button></div>
    <div className="order-1 w-full md:w-1/2">
    <img src={banner} className="w-81 h-80 mt-40 ml-20" alt=" "/>
    </div>
    </div>
    </>
  )
}

export default Banner