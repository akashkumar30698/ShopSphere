import React,{ useEffect } from 'react';
import './App.css'
import Navbar from './components/Navbar'



function App() {
  

  useEffect(()=>{
    console.log("app rendered")
  })
 
  return (
    <>
    <Navbar/>
    </>
  )
}

export default App
