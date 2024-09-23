import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import { NavBar } from './components/NavBar'
import { Inicio } from './pages/inicio'
import { LoginPage } from './pages/Login'
import { Registrar } from './pages/registrar'
import { Revisar } from './pages/Revisar'
import { Asignar } from './pages/Asignar'
import { Gestionar } from './pages/Gestionar'
import Estadisticas from './pages/Estadisticas'


function App() {

  return (
    <>
    <BrowserRouter>
    <NavBar/>
      <Routes>
        <Route path="/" element={<Inicio/>}/>
        <Route path="/Login" element={<LoginPage/>}/>
        <Route path="/registrar" element={<Registrar/>}/>
        <Route path="/gestionar" element={<Gestionar/>}/>
        <Route path="/revisar" element={<Revisar/>}/>
        <Route path="/asignar" element={<Asignar/>}/>
        <Route path="/estadisticas" element={<Estadisticas/>}/>
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
