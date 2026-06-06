import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { fetchReviews } from '../api';

function ReviewCard({ review }) {
  return (
    <div className="bg-white p-7 rounded-2xl border border-[var(--ahps-text)]/8 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-1 text-[var(--ahps-accent)] mb-3">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star
            key={`${review.id}-star-${s}`}
            size={14}
            fill={s < review.stars ? 'var(--ahps-accent)' : 'transparent'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <h4 className="font-display text-lg mb-2">{review.title}</h4>
      <p className="text-sm text-neutral-700 leading-relaxed mb-5">{review.body}</p>
      <div className="text-xs text-neutral-500">
        <p className="font-semibold text-[var(--ahps-text)]">{review.author}</p>
        <p>{review.date}</p>
        <a href="#" className="underline mt-2 inline-block">{review.product}</a>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [i, setI] = useState(0);
  const visible = 3;

  useEffect(() => {
    fetchReviews().then(setReviews).catch(() => setReviews([]));
  }, []);

  const max = Math.max(0, reviews.length - visible);
  const items = reviews.slice(i, i + visible);

  if (!reviews.length) return null;

  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--ahps-soft)' }}>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-eyebrow">Stories from photographers</span>
          <h2 className="section-title">Loved by <span className="accent-underline">{reviews.length * 145}+</span> creators.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((r) => (<ReviewCard key={r.id} review={r} />))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setI(Math.max(0, i - 1))}
            disabled={i === 0}
            aria-label="previous reviews"
            className="w-11 h-11 rounded-full border border-[var(--ahps-text)]/20 hover:bg-[var(--ahps-text)] hover:text-white hover:border-[var(--ahps-text)] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--ahps-text)] transition-colors flex items-center justify-center"
          >
            <ChevronLeft size={18}/>
          </button>
          <span className="text-xs text-neutral-700 mx-3 tabular-nums font-medium">
            {i + 1}–{Math.min(i + visible, reviews.length)} of {reviews.length}
          </span>
          <button
            onClick={() => setI(Math.min(max, i + 1))}
            disabled={i >= max}
            aria-label="next reviews"
            className="w-11 h-11 rounded-full border border-[var(--ahps-text)]/20 hover:bg-[var(--ahps-text)] hover:text-white hover:border-[var(--ahps-text)] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--ahps-text)] transition-colors flex items-center justify-center"
          >
            <ChevronRight size={18}/>
          </button>
        </div>
      </div>
    </section>
  );
}
