import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import { NavBar } from './components/NavBar'
import { Inicio } from './pages/inicio'
import { LoginPage } from './pages/Login'
import { Registrar } from './pages/registrar'
import { Revisar } from './pages/Revisar'


function App() {

  return (
    <>
    <BrowserRouter>
    <NavBar/>
      <Routes>
        <Route path="/" element={<Inicio/>}/>
        <Route path="/Login" element={<LoginPage/>}/>
        <Route path="/registrar" element={<Registrar/>}/>
        <Route path="/revisar" element={<Revisar/>}/>
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
