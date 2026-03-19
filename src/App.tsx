import {  Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Work from "./pages/Work"
import Thinking from "./pages/Thinking"
import Growth from "./pages/Growth"
import Experiments from "./pages/Experiments"
import Contact from "./pages/Contact"
// import Navbar from "./components/layout/Navbar"
// import Footer from "./components/layout/Footer"

const App = () => {
  return (
   
  

    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/work" element={<Work />} />
      <Route path="/thinking" element={<Thinking />} />
      <Route path="/growth" element={<Growth />} />
      <Route path="/experiments" element={<Experiments />} />
      <Route path="/contact" element={<Contact />} />
     
    </Routes>

    
  
  )
}

export default App
