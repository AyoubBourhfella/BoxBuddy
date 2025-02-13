
import React, { useEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import useLocalStorage from "./hooks/UseLocalStorage";
import { setUser } from "./store/slices/UserSlice";
import './App.css'

function App() {
  const [current_user] = useLocalStorage('current_user')
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setUser(current_user))
  },[current_user])

  if (current_user) {

    return (
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Signup" element={<Signup/>}/>
      </Routes>
    </>
  )
}

export default App;
