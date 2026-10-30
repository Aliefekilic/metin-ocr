import React from 'react';
import { ScanText, ShieldCheck, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-logo-icon">
            <ScanText className="icon-brand" size={26} />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">DeskPilot</h1>
              <span className="brand-badge">v1.0</span>
            </div>
            <p className="brand-subtitle">Görselden Metin Çıkarma (OCR) Web Uygulaması</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="privacy-pill">
            <ShieldCheck size={16} className="pill-icon text-emerald" />
            <span>%100 Tarayıcıda • Sıfır Sunucu Kaydı</span>
          </div>
          <div className="free-pill">
            <Sparkles size={15} className="pill-icon text-amber" />
            <span>Ücretsiz & Limitsiz</span>
          </div>
        </div>
      </div>
    </header>
  );
};
