import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ title, products, viewAllLabel = 'View all' }) {
  const ref = useRef(null);
  const scrollBy = (dir) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * (ref.current.clientWidth * 0.9), behavior: 'smooth' });
  };
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <h2 className="section-title text-left">{title}</h2>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => scrollBy(-1)} className="w-10 h-10 border border-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors flex items-center justify-center" aria-label="prev"><ChevronLeft size={18}/></button>
            <button onClick={() => scrollBy(1)} className="w-10 h-10 border border-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors flex items-center justify-center" aria-label="next"><ChevronRight size={18}/></button>
          </div>
        </div>
        <div ref={ref} className="no-scrollbar flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-2">
          {products.map((p) => (
            <div key={p.id} className="snap-start shrink-0 w-[70%] sm:w-[44%] md:w-[30%] lg:w-[22%]">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#" className="inline-block text-[12px] uppercase tracking-[0.18em] underline underline-offset-4">{viewAllLabel}</a>
        </div>
      </div>
    </section>
  );
}
