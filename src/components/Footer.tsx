import React from 'react';
import { ScanText, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo">
            <ScanText size={18} className="text-primary" />
            <span className="footer-brand-name">Metin</span>
          </div>
          <span className="footer-copy">
            Açık kaynaklı, tarayıcı tabanlı yerel görselden metin çıkarma (OCR) aracı
          </span>
        </div>

        <div className="footer-right">
          <div className="footer-privacy-note">
            <ShieldCheck size={14} className="text-emerald" />
            <span>Verileriniz bilgisayarınızdan dışarı çıkmaz</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
