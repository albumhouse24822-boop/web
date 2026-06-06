import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { fetchProducts } from '../api';

export default function ProductCarousel({ title, eyebrow, category, viewAllLabel = 'View all' }) {
  const ref = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts(category ? { category } : {}).then(setProducts).catch(() => setProducts([]));
  }, [category]);

  const scrollBy = (dir) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * (ref.current.clientWidth * 0.9), behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  const viewAllHref = `/shop${category ? `?category=${category}` : ''}`;

  return (
    <section id={category} className="py-14 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
            <h2 className="section-title text-left">{title}</h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => scrollBy(-1)} className="w-11 h-11 rounded-full border border-[var(--ahps-text)]/20 hover:bg-[var(--ahps-text)] hover:text-white hover:border-[var(--ahps-text)] transition-colors flex items-center justify-center" aria-label="prev"><ChevronLeft size={18}/></button>
            <button onClick={() => scrollBy(1)} className="w-11 h-11 rounded-full border border-[var(--ahps-text)]/20 hover:bg-[var(--ahps-text)] hover:text-white hover:border-[var(--ahps-text)] transition-colors flex items-center justify-center" aria-label="next"><ChevronRight size={18}/></button>
          </div>
        </div>
        <div ref={ref} className="no-scrollbar flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-2">
          {products.map((p) => (
            <div key={p.id} className="snap-start shrink-0 w-[72%] sm:w-[44%] md:w-[30%] lg:w-[22%]">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to={viewAllHref} className="inline-block text-[12px] uppercase tracking-[0.18em] font-semibold underline underline-offset-8 decoration-2 decoration-[var(--ahps-primary)]">
            {viewAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
