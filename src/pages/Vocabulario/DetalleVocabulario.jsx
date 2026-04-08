import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, Volume2, Bookmark, Share2, Hash, BookOpen } from 'lucide-react';

const BASE_URL = 'http://127.0.0.1:8000';

export default function DetalleVocabulario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [p, setP] = useState(null);

    useEffect(() => {
        const cargarDetalle = async () => {
            try {
                const { data } = await api.get(`vocabulario/${id}/`);
                setP(data);
                console.log("DATOS RECIBIDOS:", data);
            } catch (error) { console.error("Error al obtener datos:", error); }
        };
        cargarDetalle();
    }, [id]);


    useEffect(() => {
        // Verificamos si venimos de una navegación que envió el estado 'diccionario'
        if (location.state?.seccion === 'diccionario') {
            setVistaActiva('diccionario');

            // Limpiamos el estado para que si el usuario recarga la página (F5), 
            // no se quede "pegado" siempre en el diccionario.
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);


    if (!p) return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-700"></div>
        </div>
    );

    // --- LÓGICA DE HERENCIA ---
    const traduccionConInfo = p.traducciones?.find(t => t.imagen || t.categoria_gramatical_nombre || t.tema_nombre);

    const imagenHeredada = p.imagen || traduccionConInfo?.imagen;
    const fullImgUrl = imagenHeredada
        ? (imagenHeredada.startsWith('http') ? imagenHeredada : `${BASE_URL}${imagenHeredada}`)
        : null;

    const gramaticaHeredada = p.categoria_gramatical_nombre || traduccionConInfo?.categoria_gramatical_nombre || 'Sin categoría';
    const temaHeredado = p.tema_nombre || traduccionConInfo?.tema_nombre || 'General';

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 flex flex-col">
            {/* Header / Nav */}
            <div className="max-w-6xl mx-auto w-full p-6 flex justify-between items-center">
                <button onClick={() => navigate('/', { state: { seccion: 'diccionario' } })} className="group flex items-center text-teal-800 font-black text-xs uppercase tracking-[0.2em]">
                    <ArrowLeft className="mr-2 group-hover:-translate-x-2 transition-transform" size={18} />
                    Volver al Diccionario
                </button>
                <div className="flex gap-4">
                    <button className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-teal-600">
                        <Bookmark size={20} />
                    </button>
                    <button className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-teal-600">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 w-full grow">
                <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100">

                    {/* Hero Section */}
                    <div className="relative bg-slate-900 pt-24 pb-32 px-10 md:px-20 overflow-hidden">
                        {/* Decoración de fondo */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-teal-500/10 to-transparent"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-1 bg-teal-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                    {p.idioma_nombre}
                                </span>
                                <span className="text-slate-500 font-bold">/</span>
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Hash size={12} /> {temaHeredado}
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-end gap-8">
                                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter italic leading-none uppercase">
                                    {p.termino}
                                </h1>
                                <button className="mb-2 p-4 bg-teal-500/20 hover:bg-teal-500 text-teal-400 hover:text-white rounded-full transition-all backdrop-blur-md">
                                    <Volume2 size={32} />
                                </button>
                            </div>
                            <p className="mt-6 text-3xl text-teal-500 font-serif italic tracking-widest">
                                / {p.fonetica || p.termino} /
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-12 gap-0">
                        {/* Columna Izquierda: Contenido */}
                        <div className="md:col-span-7 p-10 md:p-20 space-y-16">
                            <section>
                                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                                    <BookOpen size={14} /> Contexto de Uso
                                </h3>
                                <p className="text-4xl text-slate-800 font-serif leading-tight italic border-l-8 border-teal-600 pl-10 py-2">
                                    “{p.ejemplo || 'No hay un ejemplo registrado para este término todavía.'}”
                                </p>
                            </section>

                            <section>
                                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8">Equivalencias</h3>
                                <div className="space-y-4">
                                    {p.traducciones?.map((t, i) => (
                                        <div key={i} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-teal-50 transition-colors">
                                            <span className="text-4xl font-black text-slate-900 uppercase group-hover:text-teal-700 transition-colors">{t.termino}</span>
                                            <span className="px-4 py-1 bg-white text-slate-400 rounded-lg text-[10px] font-black uppercase shadow-sm">{t.idioma_nombre}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Columna Derecha: Sidebar */}
                        <div className="md:col-span-5 bg-slate-50/80 p-10 md:p-16 border-l border-slate-100 flex flex-col gap-10">
                            {/* Imagen con Herencia */}
                            <div className="relative">
                                {fullImgUrl ? (
                                    <div className="rounded-[3rem] overflow-hidden shadow-2xl border-12 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                        <img src={fullImgUrl} alt={p.termino} className="w-full h-80 object-cover" />
                                        {!p.imagen && (
                                            <div className="absolute bottom-4 left-4 bg-teal-600 text-white text-[8px] px-3 py-1 rounded-full font-black tracking-tighter shadow-lg">
                                                IMAGEN DE REFERENCIA
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-80 rounded-[3rem] bg-slate-200 flex flex-col items-center justify-center text-slate-400 border-4 border-dashed border-slate-300">
                                        <span className="font-black text-[10px] uppercase tracking-widest">Sin imagen</span>
                                    </div>
                                )}
                            </div>

                            {/* Info Adicional */}
                            <div className="space-y-6">
                                <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Categoría Gramatical</p>
                                    <p className="text-2xl font-black text-teal-700 uppercase italic tracking-tighter">
                                        {gramaticaHeredada}
                                    </p>
                                </div>

                                <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">ID de Registro</p>
                                    <p className="text-xl font-bold text-slate-400">#00{p.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}