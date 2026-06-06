import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { announcements } from '../mock';

export default function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return undefined;
    const total = announcements.length;
    const t = setInterval(() => setI((p) => (p + 1) % total), 4000);
    return () => clearInterval(t);
  }, [playing]);

  const total = announcements.length;
  const goPrev = () => setI((p) => (p - 1 + total) % total);
  const goNext = () => setI((p) => (p + 1) % total);

  return (
    <div className="announcement-bar w-full">
      <div className="max-w-screen-2xl mx-auto px-4 py-2 flex items-center justify-center gap-3">
        <button aria-label="play/pause" onClick={() => setPlaying((p) => !p)} className="opacity-70 hover:opacity-100">
          {playing ? <Pause size={12} /> : <Play size={12} />}
        </button>
        <button aria-label="prev" onClick={goPrev} className="opacity-70 hover:opacity-100">
          <ChevronLeft size={14} />
        </button>
        <p className="text-center min-w-0 truncate">{announcements[i].text}</p>
        <button aria-label="next" onClick={goNext} className="opacity-70 hover:opacity-100">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
