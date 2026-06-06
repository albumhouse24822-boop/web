import React from 'react';
import { themes } from '../mock';

export default function ThemesSection() {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <h2 className="section-title mb-10">SHOP BY THEMES</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {themes.map((t) => (
            <a href="#" key={t.title} className="theme-card group block overflow-hidden bg-neutral-100">
              <div className="relative aspect-square overflow-hidden">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="text-center py-4 text-sm uppercase tracking-[0.16em] font-medium group-hover:underline">{t.title}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
