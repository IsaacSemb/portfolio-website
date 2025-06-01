import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './assets/styles/App.css'

// pages
import HomePage from './pages/HomePage'
import About from './pages/About'
import Contact from './pages/Contact'
import NavBar from './components/NavBar'
import TestingComponent from './components/TestingComponent'



function App() {

  return (

    

      
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/test-component' element={<TestingComponent/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
