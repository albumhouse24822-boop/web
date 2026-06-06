import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SiteProvider } from './context/SiteContext';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div className="App">
      <SiteProvider>
        <CartProvider>
          <BrowserRouter>
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
      </SiteProvider>
    </div>
  );
}

export default App;
