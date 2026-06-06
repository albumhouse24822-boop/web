import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { heroSlides } from '../mock';

export default function HeroSlideshow() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((p) => (p + 1) % heroSlides.length), 5500);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <section className="relative w-full overflow-hidden bg-neutral-100" style={{aspectRatio: '12 / 5'}}>
      <div className="relative w-full h-full">
        {heroSlides.map((s, idx) => (
          <div key={idx} className={`hero-slide ${idx === i ? 'active' : ''}`}>
            <picture>
              <source media="(max-width: 768px)" srcSet={s.mobile} />
              <img src={s.desktop} alt={s.alt} className="w-full h-full object-cover" loading={idx === 0 ? 'eager' : 'lazy'} />
            </picture>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full">
        <button onClick={() => setI((p) => (p - 1 + heroSlides.length) % heroSlides.length)} aria-label="prev"><ChevronLeft size={16}/></button>
        <button onClick={() => setPlaying(p => !p)} aria-label="play">{playing ? <Pause size={14}/> : <Play size={14}/>}</button>
        <span className="text-[11px] tabular-nums">{i + 1} / {heroSlides.length}</span>
        <button onClick={() => setI((p) => (p + 1) % heroSlides.length)} aria-label="next"><ChevronRight size={16}/></button>
      </div>
      <div className="absolute bottom-4 right-4 hidden md:flex gap-1.5">
        {heroSlides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-8 bg-neutral-900' : 'w-1.5 bg-neutral-900/40'}`} />
        ))}
      </div>
    </section>
  );
}
