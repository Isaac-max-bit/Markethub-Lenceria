import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InicioSesion from '../components/Inicio-Sesion';
import Home from '../pages/home';

export default function Enrutador() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tu vista actual de inicio de sesión y registro */}
        <Route path="/" element={<InicioSesion />} />
        
        {/* La página principal a la que se navegará */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}