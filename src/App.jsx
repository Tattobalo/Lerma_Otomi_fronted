import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DetalleVocabulario from './pages/Vocabulario/DetalleVocabulario';
import LermaHome from './pages/Vocabulario/lerma_home';
import DiccionarioPagina from './pages/Vocabulario/diccionario';

export default function App() {
  return (
    <BrowserRouter>
      {/* Quitamos el main con bg-slate ya que el fondo ahora lo manejan las páginas */}
      <Routes>
        {/* Redirigimos la raíz directamente a Home */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<LermaHome />} />
        {/* Agregamos una ruta específica para el diccionario */}
        <Route path="/diccionario" element={<DiccionarioPagina />} />
        <Route path="/vocabulario/:id" element={<DetalleVocabulario />} />

        {/* Error 404 */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-4xl font-black text-slate-300">404</h2>
            <p className="text-slate-500">Esta página no existe.</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}