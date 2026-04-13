import React, { useState, useEffect } from 'react'; // <--- AGREGAR useEffect
import { useLocation } from 'react-router-dom';     // <--- AGREGAR useLocation
import { Languages, ArrowRightLeft } from 'lucide-react';
import api from '../../api/axios';
import DiccionarioSeccion from './diccionario';
import logo from '../../assets/logo_lerma1.png';

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
        const textoLimpio = textoTraductor.trim(); // Limpieza extra
        if (!textoLimpio) return;

        setCargandoTraduccion(true);
        setResultadoTraduccion("");

        try {
            const { data } = await api.get(`vocabulario/buscar/`, {
                params: { q: textoLimpio, dir: direccion } // Usar params es más seguro
            });

            if (Array.isArray(data) && data.length > 0) {
                // Buscamos la traducción que NO sea igual al término buscado
                const palabraEncontrada = data[0];
                const trad = palabraEncontrada.traducciones?.find(t =>
                    t.termino.toLowerCase() !== textoLimpio.toLowerCase()
                );

                if (trad) {
                    setResultadoTraduccion(trad.termino);
                } else {
                    setResultadoTraduccion("Sin traducción vinculada");
                }
            } else {
                setResultadoTraduccion("No se encontro el termino");
            }
        } catch (e) {
            setResultadoTraduccion("Error de conexión");
        } finally {
            setCargandoTraduccion(false);
        }
    };

    const intercambiarIdiomas = () => {
        setDireccion(prev => prev === "es_a_ot" ? "ot_a_es" : "es_a_ot");

        // 2. Lógica inteligente para mover el texto:
        // Solo movemos el resultado al cuadro de texto si NO es un mensaje de error o aviso
        const mensajesDeError = [
            "No se encontro el termino",
            "Error de conexión",
            "Sin traducción vinculada",
            "---"
        ];

        if (resultadoTraduccion && !mensajesDeError.includes(resultadoTraduccion)) {
            setTextoTraductor(resultadoTraduccion);
        } else {
            // Si había un error o estaba vacío, mejor limpiamos el input para el usuario
            setTextoTraductor("");
        }

        // 3. Siempre limpiamos el resultado para que el nuevo cuadro verde empiece vacío
        setResultadoTraduccion("");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col">
            <header className="bg-linear-to-r from-red-800 via-red-700 to-orange-600 text-white shadow-2xl">
                <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                            <img src={logo} alt="Lerma-otomi-png" className="w-full h-full object-contain" />
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
                        <div className="traductor-card">
                            <div className="grid md:grid-cols-2 gap-8 items-center relative">

                                {/* ENTRADA */}
                                <div className="text-center">
                                    <label className="traductor-label text-blue-500">
                                        {direccion === "es_a_ot" ? "Español" : "Otomí"}
                                    </label>
                                    <textarea
                                        value={textoTraductor}
                                        onChange={(e) => setTextoTraductor(e.target.value)}
                                        placeholder="Escribe aquí..."
                                        className="traductor-input"
                                    />
                                </div>

                                <button onClick={intercambiarIdiomas} className="btn-swap">
                                    <ArrowRightLeft size={24} />
                                </button>

                                {/* SALIDA */}
                                <div className="text-center">
                                    <label className="traductor-label text-teal-500">
                                        {direccion === "es_a_ot" ? "Otomí" : "Español"}
                                    </label>
                                    <div className="traductor-output">
                                        {cargandoTraduccion ? (
                                            <div className="animate-pulse text-lg">Traduciendo...</div>
                                        ) : (
                                            resultadoTraduccion || "---"
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button onClick={manejarTraduccion} className="btn-traductor">
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