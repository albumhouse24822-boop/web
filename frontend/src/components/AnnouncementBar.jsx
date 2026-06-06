import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function AnnouncementBar() {
  const { config } = useSite();
  const items = (config.announcements && config.announcements.length > 0)
    ? config.announcements
    : ['Loading...'];
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return undefined;
    const total = items.length;
    const t = setInterval(() => setI((p) => (p + 1) % total), 4500);
    return () => clearInterval(t);
  }, [playing, items.length]);

  const total = items.length;
  const goPrev = () => setI((p) => (p - 1 + total) % total);
  const goNext = () => setI((p) => (p + 1) % total);

  return (
    <div className="announcement-bar w-full">
      <div className="max-w-screen-2xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
        <button aria-label="play/pause" onClick={() => setPlaying((p) => !p)} className="opacity-70 hover:opacity-100">
          {playing ? <Pause size={12} /> : <Play size={12} />}
        </button>
        <button aria-label="prev" onClick={goPrev} className="opacity-70 hover:opacity-100">
          <ChevronLeft size={14} />
        </button>
        <p className="text-center min-w-0 truncate">{items[i]}</p>
        <button aria-label="next" onClick={goNext} className="opacity-70 hover:opacity-100">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
