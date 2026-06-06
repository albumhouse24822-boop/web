import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchSiteConfig } from '../api';

const SiteContext = createContext(null);

const DEFAULTS = {
  brand: 'Album House Prop Store',
  tagline: 'Handcrafted with love. Designed to make tiny moments unforgettable.',
  announcements: ['Loading...'],
  primaryColor: '#E85A4F',
  secondaryColor: '#0F4C5C',
  accentColor: '#F2C94C',
  creamColor: '#FFF8F0',
  textColor: '#2D1B0F',
  instagram: 'https://www.instagram.com/',
  email: 'hello@albumhousepropstore.com',
  aboutText: '',
  heroSubText: '',
};

export function SiteProvider({ children }) {
  const [config, setConfig] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      const data = await fetchSiteConfig();
      setConfig({ ...DEFAULTS, ...data });
    } catch (e) {
      console.error('Failed to load site config', e);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Apply CSS vars on root
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--ahps-primary', config.primaryColor);
    r.style.setProperty('--ahps-secondary', config.secondaryColor);
    r.style.setProperty('--ahps-accent', config.accentColor);
    r.style.setProperty('--ahps-cream', config.creamColor);
    r.style.setProperty('--ahps-text', config.textColor);
  }, [config]);

  const value = useMemo(() => ({ config, loaded, refresh: load }), [config, loaded]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
};
