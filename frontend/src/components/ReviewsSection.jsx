import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { reviews } from '../mock';

export default function ReviewsSection() {
  const [i, setI] = useState(0);
  const visible = 3;
  const max = Math.max(0, reviews.length - visible);
  const items = reviews.slice(i, i + visible);

  return (
    <section className="py-14 md:py-20 bg-[#f7f3ee]">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <h2 className="section-title mb-2">Let customers speak for us</h2>
        <p className="text-center text-sm text-neutral-600 mb-10">from 1165 reviews</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((r, idx) => (
            <div key={idx} className="bg-white p-7 border border-neutral-200">
              <div className="flex items-center gap-1 text-[#e3a96b] mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} fill={s < r.stars ? '#e3a96b' : 'transparent'} strokeWidth={1.5}/>
                ))}
              </div>
              <h4 className="font-medium mb-2">{r.title}</h4>
              <p className="text-sm text-neutral-700 leading-relaxed mb-5">{r.body}</p>
              <div className="text-xs text-neutral-500">
                <p className="font-medium text-neutral-900">{r.author}</p>
                <p>{r.date}</p>
                <a href="#" className="underline mt-2 inline-block">{r.product}</a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} className="w-10 h-10 border border-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-neutral-900 transition-colors flex items-center justify-center"><ChevronLeft size={18}/></button>
          <span className="text-xs text-neutral-600 mx-3 tabular-nums">{i + 1}–{Math.min(i + visible, reviews.length)} of {reviews.length}</span>
          <button onClick={() => setI(Math.min(max, i + 1))} disabled={i >= max} className="w-10 h-10 border border-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-neutral-900 transition-colors flex items-center justify-center"><ChevronRight size={18}/></button>
        </div>
      </div>
    </section>
  );
}
