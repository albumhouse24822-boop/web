import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts } from '../api';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import { Footer } from '../components/Sections';
import ProductCard from '../components/ProductCard';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { v: '', label: 'All' },
  { v: 'new-arrivals', label: 'New Arrivals' },
  { v: 'ready-themes', label: 'Ready-made themes' },
  { v: 'baby', label: 'Baby' },
  { v: 'maternity', label: 'Maternity' },
];

const SORTS = [
  { v: 'featured', label: 'Featured' },
  { v: 'price-asc', label: 'Price: low to high' },
  { v: 'price-desc', label: 'Price: high to low' },
  { v: 'name', label: 'Name: A → Z' },
];

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('featured');
  const category = params.get('category') || '';
  const q = params.get('q') || '';
  const title = params.get('title') || '';

  useEffect(() => {
    setLoading(true);
    const queryParams = {};
    if (category) queryParams.category = category;
    if (q) queryParams.q = q;
    fetchProducts(queryParams)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category, q]);

  const sorted = useMemo(() => {
    const list = [...items];
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [items, sort]);

  const heading = title || (q ? `Search results for "${q}"` : CATEGORIES.find((c) => c.v === category)?.label || 'All Products');

  const setCategory = (v) => {
    const np = new URLSearchParams(params);
    if (v) np.set('category', v); else np.delete('category');
    np.delete('q');
    np.delete('title');
    setParams(np);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ahps-cream)' }}>
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Header band */}
        <section className="py-10 md:py-16" style={{ background: 'var(--ahps-soft)' }}>
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-neutral-700 mb-4">
              <Link to="/" className="hover:text-[var(--ahps-primary)]">Home</Link>
              <ChevronRight size={12} />
              <span className="text-[var(--ahps-text)] font-semibold">{heading}</span>
            </nav>
            <h1 className="font-display text-4xl md:text-6xl leading-tight">{heading}</h1>
            <p className="text-sm md:text-base text-neutral-700 mt-3">
              {loading ? 'Loading…' : `${sorted.length} product${sorted.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </section>

        {/* Filters bar */}
        <section className="py-5 border-b border-[var(--ahps-text)]/10 sticky top-[60px] z-30 bg-[var(--ahps-cream)]/95 backdrop-blur">
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 flex-shrink-0">
              {CATEGORIES.map((c) => (
                <button
                  key={c.v || 'all'}
                  onClick={() => setCategory(c.v)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    category === c.v
                      ? 'bg-[var(--ahps-text)] text-white'
                      : 'bg-white text-[var(--ahps-text)] hover:bg-[var(--ahps-text)] hover:text-white border border-[var(--ahps-text)]/15'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <SlidersHorizontal size={14} className="text-neutral-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs font-semibold uppercase tracking-wider bg-transparent border border-[var(--ahps-text)]/15 rounded-full px-3 py-2 outline-none cursor-pointer"
              >
                {SORTS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-10 md:py-14">
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
            {sorted.length === 0 && !loading ? (
              <div className="py-20 text-center">
                <p className="font-display text-2xl mb-3">No products found.</p>
                <p className="text-sm text-neutral-600 mb-6">Try clearing filters or browsing all products.</p>
                <button onClick={() => setCategory('')} className="btn-primary">View all products</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {sorted.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
