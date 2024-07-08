import React from "react";
import Home from"./home/Home";
import { Route,Routes } from "react-router-dom";
import Catalogues from "./Catalogues/Catalogues";
import Signup from "./components/Signup";
function App() {
  return(
  <>
  {/* <Home/>
  <Catalogue/> */}
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/Catalogue" element={<Catalogues/>}/>
    <Route path="/signup" element={<Signup/>}/>
  </Routes>
  </>)
}

export default App;