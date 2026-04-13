import { Link } from 'react-router-dom'
import logo from '../../assets/lerma_home.png'

export default function Navbar() {
  return (
    <nav className="bg-green-950 text-white shadow-lg"> {/* Un verde más oscuro para que resalte el logo */}
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Aquí aplicamos tu efecto */}
        <Link 
          to="/" 
          className="font-black tracking-tighter transition-transform hover:scale-105"
        >
          <img src={logo} alt="UAEMex" className="w-10 h-10 object-contain" />
          <div className="logo-lerma text-sm text-green-300">
            LERMA_OTOMÍ
            </div>
        </Link>

        <div className="space-x-6 font-medium flex items-center">
          <Link to="/" className="hover:text-green-300 transition">Diccionario</Link>
          <span className="text-green-800">|</span>
          <span className="text-xs bg-green-900 px-3 py-1 rounded-full border border-green-800 text-green-200">
            UAEMex
          </span>
        </div>
      </div>
    </nav>
  )
}