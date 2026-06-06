import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchBanners } from '../api';
import { useSite } from '../context/SiteContext';

export default function HeroSlideshow() {
  const { config } = useSite();
  const [slides, setSlides] = useState([]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    fetchBanners('hero').then(setSlides).catch(() => setSlides([]));
  }, []);

  useEffect(() => {
    if (!playing || slides.length === 0) return undefined;
    const total = slides.length;
    const t = setInterval(() => setI((p) => (p + 1) % total), 6000);
    return () => clearInterval(t);
  }, [playing, slides.length]);

  const total = slides.length;
  const goPrev = () => setI((p) => (p - 1 + total) % total);
  const goNext = () => setI((p) => (p + 1) % total);

  return (
    <section className="relative w-full overflow-hidden bg-[var(--ahps-cream)]">
      <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
        {/* Blob accent */}
        <div
          className="blob hidden md:block"
          style={{ width: 380, height: 380, top: -100, right: -80, background: config.primaryColor }}
        />
        <div
          className="blob hidden md:block"
          style={{ width: 320, height: 320, bottom: -120, left: -80, background: config.accentColor, opacity: 0.35 }}
        />

        {slides.map((s, idx) => (
          <div key={s.id} className={`hero-slide ${idx === i ? 'active' : ''}`}>
            <picture>
              {s.mobile && <source media="(max-width: 768px)" srcSet={s.mobile} />}
              <img src={s.desktop || s.image} alt={s.alt || 'Album House Prop Store'} className="w-full h-full object-cover" loading={idx === 0 ? 'eager' : 'lazy'} />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--ahps-cream)] via-[var(--ahps-cream)]/40 to-transparent" />
          </div>
        ))}

        {/* Centered content overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-16 w-full">
            <div className="max-w-2xl">
              <span className="chip mb-5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.primaryColor }} />
                India's Boldest Prop Store
              </span>
              <h1 className="font-display text-[40px] md:text-6xl lg:text-7xl font-medium leading-[1.02] tracking-tight" style={{ color: 'var(--ahps-text)' }}>
                Tiny moments,
                <br />
                <span className="accent-underline">timeless</span> stories.
              </h1>
              <p className="mt-5 text-base md:text-lg max-w-xl" style={{ color: 'var(--ahps-text)', opacity: 0.75 }}>
                {config.heroSubText || config.tagline}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/quiz" className="btn-primary">
                  <Sparkles size={16} /> Try AI Prop Stylist
                </Link>
                <Link to="/shop?category=new-arrivals" className="btn-secondary">
                  Shop New Arrivals <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/85 backdrop-blur px-4 py-2 rounded-full shadow-lg">
          <button onClick={goPrev} aria-label="prev"><ChevronLeft size={16}/></button>
          <button onClick={() => setPlaying(p => !p)} aria-label="play">{playing ? <Pause size={14}/> : <Play size={14}/>}</button>
          <span className="text-[11px] tabular-nums font-medium">{i + 1} / {total}</span>
          <button onClick={goNext} aria-label="next"><ChevronRight size={16}/></button>
        </div>
      )}
    </section>
  );
}
