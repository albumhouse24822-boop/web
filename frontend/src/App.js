import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SiteProvider } from './context/SiteContext';
import { NavigationProvider } from './components/DesktopNav';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from './components/ui/sonner';

function ImageProtection() {
  useEffect(() => {
    // Disable right-click on images globally
    const onContext = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };
    // Disable drag-start on images
    const onDrag = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };
    // Block common save shortcuts
    const onKey = (e) => {
      // Block Ctrl+S / Cmd+S on the document
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', onContext);
    document.addEventListener('dragstart', onDrag);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('contextmenu', onContext);
      document.removeEventListener('dragstart', onDrag);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  return null;
}

function App() {
  return (
    <div className="App">
      <SiteProvider>
        <NavigationProvider>
          <CartProvider>
            <BrowserRouter>
              <ImageProtection />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </CartProvider>
        </NavigationProvider>
      </SiteProvider>
    </div>
  );
}

export default App;
