import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import HeroSlideshow from './components/HeroSlideshow';
import ThemesSection from './components/ThemesSection';
import ProductCarousel from './components/ProductCarousel';
import { PromoBanners, MentorPicks, StudioBookings, Marquee, Stores, Footer } from './components/Sections';
import ReviewsSection from './components/ReviewsSection';
import { newArrivals, readyMadeThemes } from './mock';
import { Toaster } from './components/ui/sonner';

function Home() {
  return (
    <main className="bg-white">
      <HeroSlideshow />
      <div className="py-8 text-center">
        <p className="font-serif italic text-xl md:text-2xl text-neutral-700">
          Handcrafted & handpicked props in a premium finish at affordable pricing.
        </p>
      </div>
      <ThemesSection />
      <ProductCarousel title="New Arrivals" products={newArrivals} viewAllLabel="View all 195 products" />
      <ProductCarousel title="Ready-made themes" products={readyMadeThemes} viewAllLabel="View all 9 products" />
      <PromoBanners />
      <MentorPicks />
      <StudioBookings />
      <Marquee />
      <ReviewsSection />
      <Stores />
      <Footer />
    </main>
  );
}

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <AnnouncementBar />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
