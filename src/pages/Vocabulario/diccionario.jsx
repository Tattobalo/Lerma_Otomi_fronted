import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function DiccionarioSeccion() {
    const navigate = useNavigate();
    const [palabras, setPalabras] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [catGramatical, setCatGramatical] = useState("");
    const [catTematica, setCatTematica] = useState("");

    const [opcionesGramaticales, setOpcionesGramaticales] = useState([]);
    const [opcionesTematicas, setOpcionesTematicas] = useState([]);

    useEffect(() => {
    const cargarFiltros = async () => {
        try {
            const [gram, tema] = await Promise.all([
                // Coincide con: router.register(r'categorias-gramaticales', ...)
                api.get('categorias-gramaticales/'), 
                // Coincide con: router.register(r'temas', ...)
                api.get('temas/') 
            ]);
            
            // DRF devuelve los datos en .data (o .data.results si hay paginación)
            const dataGram = gram.data.results || gram.data;
            const dataTema = tema.data.results || tema.data;

            setOpcionesGramaticales(dataGram);
            setOpcionesTematicas(dataTema);
        } catch (e) { 
            console.error("Error al cargar filtros:", e); 
        }
    };
    cargarFiltros();
}, []);

    useEffect(() => {
        const buscar = async () => {
            try {
                // Quitamos el filtro de idioma de la URL para evitar el error 200 (vacío)
                let url = `vocabulario/?search=${busqueda}`;
                if (catGramatical) url += `&categoria_gramatical=${catGramatical}`;
                if (catTematica) url += `&tema=${catTematica}`;

                const { data } = await api.get(url);
                const res = data.results || data;

                // Filtramos manualmente por otomí (insensible a mayúsculas/acentos)
                const filtradas = res.filter(p =>
                    p.idioma_nombre?.toLowerCase().includes('otom')
                );

                setPalabras(filtradas);
            } catch (e) { console.error("Error en búsqueda", e); }
        };
        const timeoutId = setTimeout(buscar, 300);
        return () => clearTimeout(timeoutId);
    }, [busqueda, catGramatical, catTematica]);

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar en otomí..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none transition-all font-medium"
                        />
                    </div>
                    <select value={catGramatical} onChange={(e) => setCatGramatical(e.target.value)} className="px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-slate-600 appearance-none">
                        <option value="">Todas las Categorías</option>
                        {opcionesGramaticales.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                    </select>
                    <select value={catTematica} onChange={(e) => setCatTematica(e.target.value)} className="px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-slate-600 appearance-none">
                        <option value="">Todos los Temas</option>
                        {opcionesTematicas.map(tema => <option key={tema.id} value={tema.id}>{tema.nombre}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="grid grid-cols-12 gap-4 p-8 bg-linear-to-r from-teal-700 to-cyan-600 text-white font-black uppercase text-[10px] tracking-[0.2em]">
                    <div className="col-span-4 flex items-center gap-2"><BookOpen size={14} /> Término (Otomí)</div>
                    <div className="col-span-4 flex items-center gap-2"><Hash size={14} /> Gramática / Tema</div>
                    <div className="col-span-4 text-right">Acciones</div>
                </div>
                <div className="divide-y divide-slate-50 max-h-125 overflow-y-auto">
                    {palabras.map((p) => {
                        // HERENCIA: Si la palabra principal no tiene categoría, buscamos en su traducción
                        const trad = p.traducciones && p.traducciones.length > 0 ? p.traducciones[0] : null;
                        const gFinal = p.categoria_gramatical_nombre || trad?.categoria_gramatical_nombre || 'N/A';
                        const tFinal = p.tema_nombre || trad?.tema_nombre || 'General';

                        return (
                            <div key={p.id} className="grid grid-cols-12 gap-4 p-8 items-center hover:bg-teal-50/50 transition-colors group">
                                <div className="col-span-4">
                                    <div className="text-2xl font-black text-slate-800 group-hover:text-teal-700 uppercase">{p.termino}</div>
                                    <div className="text-xs text-slate-400 font-serif italic">{p.idioma_nombre}</div>
                                </div>
                                <div className="col-span-4 space-y-1">
                                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase mr-2">{gFinal}</span>
                                    <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-[9px] font-black uppercase">{tFinal}</span>
                                </div>
                                <div className="col-span-4 flex justify-end gap-3">
                                    <button onClick={() => navigate(`/vocabulario/${p.id}`)} className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg">Ver Ficha</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}