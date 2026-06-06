import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import HeroSlideshow from '../components/HeroSlideshow';
import ThemesSection from '../components/ThemesSection';
import ProductCarousel from '../components/ProductCarousel';
import { PromoBanners, MentorPicks, StudioBookings, Marquee, Stores, Footer, QuizCta } from '../components/Sections';
import ReviewsSection from '../components/ReviewsSection';
import { useSite } from '../context/SiteContext';

function TaglineBand() {
  const { config } = useSite();
  return (
    <section className="py-10 text-center" style={{ background: 'var(--ahps-cream)' }}>
      <p className="font-display italic text-xl md:text-2xl max-w-3xl mx-auto px-4" style={{ color: 'var(--ahps-text)', opacity: 0.85 }}>
        {config.tagline}
      </p>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="bg-[var(--ahps-cream)]">
      <AnnouncementBar />
      <Header />

      <HeroSlideshow />
      <TaglineBand />
      <ThemesSection />
      <ProductCarousel
        title="New Arrivals"
        eyebrow="Just dropped"
        category="new-arrivals"
        viewAllLabel="View all new arrivals"
      />
      <QuizCta />
      <ProductCarousel
        title="Ready-made themes"
        eyebrow="Curated bundles"
        category="ready-themes"
        viewAllLabel="View all themes"
      />
      <PromoBanners />
      <MentorPicks />
      <StudioBookings />
      <Marquee />
      <ReviewsSection />
      <Stores />
      <Footer />

      {/* Floating AI button */}
      <Link to="/quiz" className="floating-ai">
        <span className="ai-dot" />
        <Sparkles size={14} /> AI Stylist
      </Link>
    </main>
  );
}
