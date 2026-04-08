import React, { useState, useEffect } from 'react'; // <--- AGREGAR useEffect
import { useLocation } from 'react-router-dom';     // <--- AGREGAR useLocation
import { Languages, ArrowRightLeft } from 'lucide-react';
import api from '../../api/axios';
import DiccionarioSeccion from './diccionario';

export default function LermaHome() {
    const location = useLocation();

    // Usamos el estado de la navegación para decidir qué vista mostrar al cargar
    const [vistaActiva, setVistaActiva] = useState(location.state?.seccion || "traductor");

    const [direccion, setDireccion] = useState("es_a_ot");
    const [textoTraductor, setTextoTraductor] = useState("");
    const [resultadoTraduccion, setResultadoTraduccion] = useState("");
    const [cargandoTraduccion, setCargandoTraduccion] = useState(false);

    // Este efecto asegura que si el usuario hace clic en "Volver" 
    // y el componente ya estaba montado, la vista cambie.
    useEffect(() => {
        // Si hay una sección definida en el estado de la navegación, úsala.
        if (location.state && location.state.seccion) {
            setVistaActiva(location.state.seccion);
        }
    }, [location.state]);

    const manejarTraduccion = async () => {
        if (!textoTraductor.trim()) return;
        setCargandoTraduccion(true);
        try {
            const { data } = await api.get(`vocabulario/buscar/?q=${textoTraductor}&dir=${direccion}`);
            if (data && data.length > 0) {
                if (direccion === "es_a_ot") {
                    setResultadoTraduccion(data[0].termino);
                } else {
                    // Buscamos en el array 'traducciones' que ahora tiene más info gracias al Serializer
                    const traduccionEsp = data[0].traducciones?.find(
                        t => t.idioma_nombre?.toLowerCase() === "español"
                    );
                    setResultadoTraduccion(traduccionEsp ? traduccionEsp.termino : "Sin traducción");
                }
            } else {
                setResultadoTraduccion("No encontrado");
            }
        } catch (e) {
            setResultadoTraduccion("Error");
        } finally {
            setCargandoTraduccion(false);
        }
    };

    const intercambiarIdiomas = () => {
        setDireccion(prev => prev === "es_a_ot" ? "ot_a_es" : "es_a_ot");
        setTextoTraductor(resultadoTraduccion);
        setResultadoTraduccion("");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col">
            <header className="bg-linear-to-r from-red-800 via-red-700 to-orange-600 text-white shadow-2xl">
                <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Languages className="w-8 h-8 text-orange-200" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight italic">Lerma Otomí</h1>
                            <p className="text-red-100 text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">UAEMex</p>
                        </div>
                    </div>
                    {/* NAV DE PESTAÑAS */}
                    <nav className="flex gap-2 bg-black/10 p-1.5 rounded-2xl">
                        <button
                            onClick={() => setVistaActiva("traductor")}
                            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${vistaActiva === "traductor" ? "bg-white text-red-700 shadow-lg" : "text-white hover:bg-white/10"}`}
                        >
                            TRADUCTOR
                        </button>
                        <button
                            onClick={() => setVistaActiva("diccionario")}
                            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${vistaActiva === "diccionario" ? "bg-white text-teal-700 shadow-lg" : "text-white hover:bg-white/10"}`}
                        >
                            DICCIONARIO
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12 grow w-full">
                {vistaActiva === "traductor" ? (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100 relative">
                            <div className="grid md:grid-cols-2 gap-8 items-center relative">
                                <div className="space-y-4 text-center">
                                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                        {direccion === "es_a_ot" ? "Español" : "Otomí"}
                                    </label>
                                    <textarea
                                        value={textoTraductor}
                                        onChange={(e) => setTextoTraductor(e.target.value)}
                                        placeholder="Escribe aquí..."
                                        className="w-full h-40 p-8 bg-slate-50 rounded-[2.5rem] text-xl italic outline-none resize-none focus:ring-2 focus:ring-red-100 transition-all"
                                    />
                                </div>

                                <button
                                    onClick={intercambiarIdiomas}
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-xl text-red-600 hover:rotate-180 transition-all border border-slate-100"
                                >
                                    <ArrowRightLeft size={24} />
                                </button>

                                <div className="space-y-4 text-center">
                                    <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest">
                                        {direccion === "es_a_ot" ? "Otomí" : "Español"}
                                    </label>
                                    <div className="w-full h-40 p-8 bg-linear-to-br from-teal-500 to-emerald-600 rounded-[2.5rem] text-white flex items-center justify-center text-3xl font-black italic shadow-inner">
                                        {cargandoTraduccion ? (
                                            <div className="animate-pulse">...</div>
                                        ) : (
                                            resultadoTraduccion || "---"
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={manejarTraduccion}
                                className="w-full mt-10 py-5 bg-linear-to-r from-red-700 to-orange-600 text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                TRADUCIR TÉRMINO
                            </button>
                        </div>
                    </div>
                ) : (
                    <DiccionarioSeccion />
                )}
            </main>

            <footer className="bg-slate-900 text-white py-12">
                <div className="max-w-6xl mx-auto px-6 text-center space-y-4 opacity-70">
                    <p className="text-sm font-bold uppercase tracking-[0.5em]">Lerma Otomí • UAEMex</p>
                    <p className="text-[10px]">2026 Diccionario Digital de la Lengua Otomí</p>
                </div>
            </footer>
        </div>
    );
}