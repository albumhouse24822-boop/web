import React from 'react';
import { useSite } from '../context/SiteContext';

export default function Logo({ size = 'md' }) {
  const { config } = useSite();
  const sizes = {
    sm: { wrap: 'gap-2', h: 'text-base md:text-lg', sub: 'text-[8px] md:text-[9px]' },
    md: { wrap: 'gap-2.5', h: 'text-xl md:text-2xl lg:text-[26px]', sub: 'text-[9px] md:text-[10px]' },
    lg: { wrap: 'gap-3', h: 'text-3xl md:text-4xl', sub: 'text-xs' },
  };
  const s = sizes[size];
  return (
    <a href="/" className={`flex items-center ${s.wrap} shrink-0`}>
      <span
        className="inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full"
        style={{ background: config.primaryColor, color: '#fff' }}
        aria-hidden="true"
      >
        <span className="font-display font-bold text-lg md:text-xl leading-none">A</span>
      </span>
      <span className="flex flex-col leading-none whitespace-nowrap">
        <span className={`font-display font-semibold ${s.h}`} style={{ color: 'var(--ahps-text)' }}>
          Album House
        </span>
        <span className={`uppercase tracking-[0.28em] ${s.sub} mt-1 font-medium`} style={{ color: config.primaryColor }}>
          Prop Store
        </span>
      </span>
    </a>
  );
}
