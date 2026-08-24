import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

/**
 * Reproductor de audio reutilizable.
 * variant: 'default' (ficha de detalle, con "onda") | 'compact' (listados, solo botón)
 */
export default function AudioPlayer({ src, variant = 'default' }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Si cambia la fuente (ej. al navegar entre palabras), reseteamos el estado
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setHasError(false);
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    setIsLoading(true);
    audio.play().catch(() => {
      setHasError(true);
      setIsLoading(false);
    });
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio?.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const compact = variant === 'compact';

  // Caso: no hay audio registrado para este término
  if (!src) {
    return (
      <div className={`flex items-center gap-2 text-slate-300 ${compact ? 'text-xs' : 'text-sm'}`}>
        <VolumeX size={compact ? 16 : 20} />
        {!compact && <span className="font-bold uppercase tracking-widest">Sin audio</span>}
      </div>
    );
  }

  // Caso: el archivo existe en la BD pero falló al cargar/reproducir
  if (hasError) {
    return (
      <div className={`flex items-center gap-2 text-red-300 ${compact ? 'text-xs' : 'text-sm'}`} title="No se pudo cargar el audio">
        <VolumeX size={compact ? 16 : 20} />
        {!compact && <span className="font-bold uppercase tracking-widest">Audio no disponible</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => { setIsPlaying(true); setIsLoading(false); }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); setProgress(0); }}
        onTimeUpdate={handleTimeUpdate}
        onError={() => { setHasError(true); setIsLoading(false); }}
      />

      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
        className={`${compact ? 'p-2' : 'p-4'} rounded-full transition-all backdrop-blur-md shrink-0 ${
          isPlaying
            ? 'bg-teal-500 text-white'
            : 'bg-teal-500/20 hover:bg-teal-500 text-teal-400 hover:text-white'
        }`}
      >
        {isLoading ? (
          <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${compact ? 'w-[18px] h-[18px]' : 'w-8 h-8'}`} />
        ) : isPlaying ? (
          <Pause size={compact ? 18 : 32} />
        ) : (
          <Play size={compact ? 18 : 32} />
        )}
      </button>

      {/* "Onda" visual — solo en la variante grande de la ficha de detalle */}
      {!compact && (
        <div className="flex-1 flex items-end gap-[3px] h-8">
          {Array.from({ length: 28 }).map((_, i) => {
            const barPercent = (i / 28) * 100;
            const isActive = barPercent <= progress;
            const height = 25 + Math.abs(Math.sin(i * 1.4)) * 60;
            return (
              <span
                key={i}
                className={`w-1 rounded-full transition-colors duration-150 ${
                  isActive ? 'bg-teal-500' : 'bg-slate-200'
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}