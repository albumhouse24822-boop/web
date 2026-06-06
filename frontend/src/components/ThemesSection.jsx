import React, { useEffect, useState } from 'react';
import { fetchThemes } from '../api';

export default function ThemesSection() {
  const [themes, setThemes] = useState([]);
  useEffect(() => {
    fetchThemes().then(setThemes).catch(() => setThemes([]));
  }, []);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-eyebrow">Shop By Mood</span>
          <h2 className="section-title">Find Your <span className="accent-underline">Theme</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {themes.map((t, idx) => (
            <a href="#" key={t.id} className="theme-card group block">
              <div className="relative aspect-square overflow-hidden">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="badge-corner">Bestseller</span>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="font-display text-lg md:text-xl font-medium leading-tight">{t.title}</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] mt-1 opacity-80">{String(idx + 1).padStart(2, '0')} · Explore</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
