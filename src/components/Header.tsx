import React from 'react';
import { ScanText, ShieldCheck, Sun, Moon, History, Command } from 'lucide-react';
import type { ThemeMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
  onOpenShortcuts: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenHistory,
  onOpenShortcuts,
  historyCount,
}) => {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-logo-icon">
            <ScanText className="icon-brand" size={24} />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">Metin</h1>
              <span className="brand-badge">Açık Kaynak OCR</span>
            </div>
            <p className="brand-subtitle">Görsel ve Evrakları Yerel Olarak Metne Dönüştürün</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="privacy-pill" title="Tüm işlemler yerel WebAssembly motoru ile tarayıcınızda yapılır">
            <ShieldCheck size={15} className="pill-icon text-emerald" />
            <span>%100 Tarayıcıda • Sıfır Veri Kaydı</span>
          </div>

          {/* Shortcuts button */}
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="header-action-btn"
            title="Klavye Kısayolları"
          >
            <Command size={15} />
            <span className="btn-label-desktop">Kısayollar</span>
          </button>

          {/* History button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="header-action-btn"
            title="Son Taramalar Geçmişi"
          >
            <History size={15} />
            <span className="btn-label-desktop">Geçmiş</span>
            {historyCount > 0 && <span className="history-badge-count">{historyCount}</span>}
          </button>

          {/* Theme switcher toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            aria-label={theme === 'light' ? 'Karanlık temaya geç' : 'Aydınlık temaya geç'}
            title={theme === 'light' ? 'Karanlık Moda Geç' : 'Aydınlık Moda Geç'}
          >
            {theme === 'light' ? (
              <>
                <Moon size={16} className="theme-icon" />
                <span className="theme-text">Karanlık</span>
              </>
            ) : (
              <>
                <Sun size={16} className="theme-icon" />
                <span className="theme-text">Aydınlık</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
