import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCcw, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitQuiz, formatPrice } from '../api';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import AnnouncementBar from '../components/AnnouncementBar';
import { Footer } from '../components/Sections';

const STEPS = [
  {
    key: 'subject',
    title: 'Who are we styling for?',
    sub: 'This helps us pick the right scale & style of props.',
    options: [
      { v: 'newborn', label: 'Newborn (0–4 weeks)' },
      { v: 'baby', label: 'Baby / Sitter (3–12 months)' },
      { v: 'kids', label: 'Kids (1–6 years)' },
      { v: 'maternity', label: 'Maternity Mama' },
    ],
  },
  {
    key: 'style',
    title: 'Pick a vibe',
    sub: 'Choose the aesthetic that excites you most.',
    options: [
      { v: 'boho', label: 'Boho · Natural · Earthy' },
      { v: 'fairytale', label: 'Fairytale · Floral · Dreamy' },
      { v: 'vintage', label: 'Vintage · Rustic · Timeless' },
      { v: 'modern', label: 'Modern · Minimal · Editorial' },
      { v: 'traditional', label: 'Traditional · Royal · Cultural' },
    ],
  },
  {
    key: 'color',
    title: 'Color mood?',
    sub: 'We will match the palette to your vision.',
    options: [
      { v: 'warm', label: 'Warm · Peach · Honey · Coral' },
      { v: 'cool', label: 'Cool · Sage · Teal · Mist' },
      { v: 'neutral', label: 'Neutral · Cream · Beige · Brown' },
      { v: 'bold', label: 'Bold · Jewel · Rich tones' },
    ],
  },
  {
    key: 'setting',
    title: 'Where are you shooting?',
    sub: 'Studio props vs portable / outdoor setups.',
    options: [
      { v: 'studio', label: 'In studio' },
      { v: 'outdoor', label: 'Outdoor / location' },
      { v: 'both', label: 'A mix of both' },
    ],
  },
  {
    key: 'budget',
    title: 'Your budget for this shoot?',
    sub: 'No judgment — we have something at every range.',
    options: [
      { v: 'under-5k', label: 'Under ₹5,000' },
      { v: '5k-15k', label: '₹5,000 – ₹15,000' },
      { v: '15k-50k', label: '₹15,000 – ₹50,000' },
      { v: 'premium', label: 'Premium · ₹50,000+' },
    ],
  },
];

function QuizStepUI({ step, value, onSelect }) {
  return (
    <div>
      <h2 className="font-display text-3xl md:text-5xl leading-tight mb-3 text-[var(--ahps-text)]">{step.title}</h2>
      <p className="text-neutral-600 mb-7">{step.sub}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {step.options.map((o) => (
          <button
            key={o.v}
            type="button"
            className={`quiz-option ${value === o.v ? 'selected' : ''}`}
            onClick={() => onSelect(o.v)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ result, onRestart }) {
  const { addItem } = useCart();
  return (
    <div>
      <div className="text-center mb-10">
        <span className="chip mb-4">
          <Sparkles size={12} className="text-[var(--ahps-primary)]" /> Your AI-styled bundle
        </span>
        <h2 className="font-display text-3xl md:text-5xl leading-tight mb-4 text-[var(--ahps-text)]">{result.title}</h2>
        <p className="text-neutral-700 max-w-2xl mx-auto">{result.message}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {result.categories.map((c) => (
            <span key={c} className="chip" style={{ background: 'var(--ahps-soft)' }}>{c}</span>
          ))}
        </div>
      </div>

      <h3 className="font-display text-2xl mb-5 text-center">Picked for you</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {result.products.map((p) => (
          <div key={p.id} className="product-card">
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ahps-cream)]">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 text-center">
              <p className="text-sm font-medium leading-tight line-clamp-2 min-h-[2.5em]">{p.name}</p>
              <p className="mt-1 text-[var(--ahps-primary)] font-semibold">{formatPrice(p.price)}</p>
              <button
                onClick={() => addItem(p)}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold py-2.5 rounded-full"
                style={{ background: 'var(--ahps-text)', color: '#fff' }}
              >
                <ShoppingBag size={12}/> Add to bag
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10 flex flex-wrap items-center justify-center gap-3">
        <button onClick={onRestart} className="btn-secondary"><RefreshCcw size={16} className="mr-2"/> Retake quiz</button>
        <Link to="/" className="btn-primary">Continue shopping <ArrowRight size={16}/></Link>
      </div>
    </div>
  );
}

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const value = answers[current?.key];

  const handleSelect = (v) => {
    setAnswers((a) => ({ ...a, [current.key]: v }));
  };

  const handleNext = async () => {
    if (!value) return;
    if (!isLast) { setStep(step + 1); return; }
    setLoading(true);
    setError('');
    try {
      const res = await submitQuiz(answers);
      setResult(res);
    } catch (e) {
      setError('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => { setStep(0); setAnswers({}); setResult(null); setError(''); };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ahps-cream)' }}>
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          {!result && (
            <>
              <div className="text-center mb-8">
                <span className="section-eyebrow">AI Prop Stylist · 60 seconds</span>
                <h1 className="font-display text-4xl md:text-6xl font-medium leading-tight">
                  Find your <span className="accent-underline">perfect</span> bundle
                </h1>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-10">
                {STEPS.map((s, idx) => (
                  <div
                    key={s.key}
                    className="flex-1 h-1.5 rounded-full transition-colors"
                    style={{ background: idx <= step ? 'var(--ahps-primary)' : 'rgba(0,0,0,0.08)' }}
                  />
                ))}
              </div>

              <QuizStepUI step={current} value={value} onSelect={handleSelect} />

              {error && <p className="text-sm text-[var(--ahps-primary)] mt-4">{error}</p>}

              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  className="text-sm font-semibold flex items-center gap-2 disabled:opacity-40"
                  disabled={step === 0}
                >
                  <ArrowLeft size={16}/> Back
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary disabled:opacity-60"
                  disabled={!value || loading}
                >
                  {loading ? 'Styling your bundle…' : (isLast ? <>Get my bundle <Sparkles size={16}/></> : <>Continue <ArrowRight size={16}/></>)}
                </button>
              </div>
            </>
          )}

          {result && <ResultCard result={result} onRestart={handleRestart} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
