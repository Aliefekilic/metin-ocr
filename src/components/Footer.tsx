import React from 'react';
import { ScanText, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo">
            <ScanText size={18} className="text-primary" />
            <span className="footer-brand-name">DeskPilot</span>
          </div>
          <span className="footer-copy">
            Görselden metin çıkarma (OCR) web uygulaması
          </span>
        </div>

        <div className="footer-right">
          <span className="footer-built-with">
            React, TypeScript & Tesseract.js ile geliştirildi
          </span>
          <span className="heart-span">
            <Heart size={14} className="heart-icon" />
          </span>
        </div>
      </div>
    </footer>
  );
};
