import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, Volume2, Hash, BookOpen } from 'lucide-react';

//const BASE_URL = 'http://127.0.0.1:8000'; 
const BASE_URL = 'https://g6q4l19k-8000.use.devtunnels.ms';

export default function DetalleVocabulario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [p, setP] = useState(null);

    useEffect(() => {
        const cargarDetalle = async () => {
            try {
                const { data } = await api.get(`vocabulario/${id}/`);
                setP(data);
            } catch (error) { console.error("Error:", error); }
        };
        cargarDetalle();
    }, [id]);

    if (!p) return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-700"></div>
        </div>
    );

    // --- LÓGICA DE HERENCIA Y RECURSOS ---
    const traduccionConInfo = p.traducciones?.find(t => t.imagen || t.categoria_gramatical_nombre || t.tema_nombre || t.ejemplo);

    // Función para limpiar URLs de medios
    const getMediaUrl = (url) => {
        if (!url) return null;

        if (url.startsWith('http')) {
            return url;
        }

        // Si es una ruta relativa por alguna razón, le pegas el BASE_URL (que debe ser http://localhost:8000)
        const cleanPath = url.startsWith('/') ? url : `/${url}`;
        return `${BASE_URL}${cleanPath}`;
    };

    const fullImgUrl = getMediaUrl(p.imagen || traduccionConInfo?.imagen);
    const gramaticaHeredada = p.categoria_gramatical_nombre || traduccionConInfo?.categoria_gramatical_nombre || 'Sin categoría';
    const temaHeredado = p.tema_nombre || traduccionConInfo?.tema_nombre || 'General';
    const ejemploHeredado = p.ejemplo || traduccionConInfo?.ejemplo;

    const reproducirAudio = () => {
        const urlAudio = getMediaUrl(p.audio);
        if (urlAudio) {
            new Audio(urlAudio).play().catch(e => console.error("Error audio:", e));
        } else {
            alert("Este término no tiene un audio registrado.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 flex flex-col">
            <div className="max-w-6xl mx-auto w-full p-6">
                <button
                    onClick={() => navigate('/', { state: { seccion: 'diccionario' } })}
                    className="group flex items-center text-teal-800 font-black text-xs uppercase tracking-[0.2em]"
                >
                    <ArrowLeft className="mr-2 group-hover:-translate-x-2 transition-transform" size={18} />
                    Volver al Diccionario
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 w-full grow">
                <div className="detalle-card">
                    {/* Hero */}
                    <div className="hero-section">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-teal-500/10 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="tag-pill bg-teal-600 text-white">{p.idioma_nombre}</span>
                                <span className="text-slate-500 font-bold">/</span>
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Hash size={12} /> {temaHeredado}
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-end gap-8">
                                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter italic leading-none uppercase">
                                    {p.termino}
                                </h1>
                                <button
                                    onClick={reproducirAudio}
                                    className={`mb-2 p-4 rounded-full transition-all backdrop-blur-md ${p.audio
                                        ? "bg-teal-500/20 hover:bg-teal-500 text-teal-400 hover:text-white"
                                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                                        }`}
                                >
                                    <Volume2 size={32} />
                                </button>
                            </div>
                            <p className="mt-6 text-3xl text-teal-500 font-serif italic tracking-widest">
                                / {p.fonetica || p.termino} /
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-12">
                        {/* Contenido */}
                        <div className="md:col-span-7 p-10 md:p-20 space-y-16">
                            <section>
                                <h3 className="section-label"><BookOpen size={14} /> Contexto de Uso</h3>
                                <p className="text-4xl text-slate-800 font-serif leading-tight italic border-l-8 border-teal-600 pl-10 py-2">
                                    “{ejemploHeredado || 'No hay un ejemplo registrado.'}”
                                </p>
                            </section>

                            <section>
                                <h3 className="section-label">Equivalencias</h3>
                                <div className="space-y-4">
                                    {p.traducciones?.map((t, i) => (
                                        <div key={i} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-teal-50 transition-colors">
                                            <span className="text-4xl font-black text-slate-900 uppercase group-hover:text-teal-700">{t.termino}</span>
                                            <span className="tag-pill bg-white text-slate-400 shadow-sm">{t.idioma_nombre}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="md:col-span-5 bg-slate-50/80 p-10 md:p-16 border-l border-slate-100 space-y-10">
                            {fullImgUrl ? (
                                <div className="polaroid-frame">
                                    <img src={fullImgUrl} alt={p.termino} className="w-full h-80 object-cover" />
                                </div>
                            ) : (
                                <div className="h-80 rounded-[3rem] bg-slate-200 flex items-center justify-center text-slate-400 border-4 border-dashed border-slate-300 font-black text-[10px] uppercase tracking-widest">
                                    Sin imagen
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="info-tile">
                                    <p className="section-label mb-4 opacity-50">Categoría Gramatical</p>
                                    <p className="text-2xl font-black text-teal-700 uppercase italic tracking-tighter">{gramaticaHeredada}</p>
                                </div>
                                <div className="info-tile">
                                    <p className="section-label mb-4 opacity-50">ID de Registro</p>
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