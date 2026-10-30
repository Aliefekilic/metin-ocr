import React from 'react';
import type { LanguageCode } from '../types';
import { Languages, Check } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  disabled?: boolean;
}

interface LanguageOptionItem {
  id: LanguageCode;
  title: string;
  badge: string;
  flag: string;
  description: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  disabled = false
}) => {
  const options: LanguageOptionItem[] = [
    {
      id: 'tur+eng',
      title: 'Türkçe + İngilizce',
      badge: 'Önerilen',
      flag: '🇹🇷 🇬🇧',
      description: 'Hem Türkçe hem İngilizce içeren belgeler için en geniş tanıma'
    },
    {
      id: 'tur',
      title: 'Yalnızca Türkçe',
      badge: 'Hızlı',
      flag: '🇹🇷',
      description: 'Özel Türkçe karakterler (ç, ğ, ı, İ, ö, ş, ü) ve basılı metinler'
    },
    {
      id: 'eng',
      title: 'Yalnızca İngilizce',
      badge: 'Standart',
      flag: '🇬🇧',
      description: 'Global İngilizce dokümanlar, kod ekranları ve makaleler'
    }
  ];

  return (
    <div className="language-selector-section">
      <div className="section-label-row">
        <div className="section-title-with-icon">
          <Languages size={18} className="text-primary" />
          <span className="section-label">Tanıma Dili Seçimi</span>
        </div>
        <span className="section-hint">Belgenizin diline uygun modeli seçin</span>
      </div>

      <div className="language-cards-grid">
        {options.map((opt) => {
          const isSelected = selectedLanguage === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectLanguage(opt.id)}
              className={`language-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              aria-pressed={isSelected}
            >
              <div className="lang-card-header">
                <div className="lang-flags-wrap">
                  <span className="lang-flag">{opt.flag}</span>
                  <span className="lang-title">{opt.title}</span>
                </div>
                {opt.badge && (
                  <span className={`lang-badge ${opt.id === 'tur+eng' ? 'recommended' : ''}`}>
                    {opt.badge}
                  </span>
                )}
              </div>
              <p className="lang-desc">{opt.description}</p>
              <div className="lang-check-indicator">
                {isSelected && <Check size={14} className="check-icon" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
