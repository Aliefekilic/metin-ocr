import React from 'react';
import { Command, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      keys: ['Ctrl', 'V'],
      mac: ['⌘', 'V'],
      desc: 'Herhangi bir ekrandan veya panodan doğrudan görseli yapıştırın',
    },
    {
      keys: ['Ctrl', 'Enter'],
      mac: ['⌘', 'Enter'],
      desc: 'Yüklenen görsel için metin çıkarmayı (OCR) hemen başlatın',
    },
    {
      keys: ['Ctrl', 'F'],
      mac: ['⌘', 'F'],
      desc: 'Metin düzenleyicide Bul & Değiştir çubuğunu açın/kapatın',
    },
    {
      keys: ['Esc'],
      mac: ['Esc'],
      desc: 'Açık olan pencereleri veya modalları kapatın',
    },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="shortcuts-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Command size={20} className="text-primary" />
            <h3 className="modal-title">Klavye Kısayolları</h3>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Kapat">
            <X size={18} />
          </button>
        </div>

        <div className="shortcuts-list">
          {shortcuts.map((sc, i) => (
            <div key={i} className="shortcut-row">
              <span className="shortcut-desc">{sc.desc}</span>
              <div className="shortcut-keys">
                {sc.keys.map((k, ki) => (
                  <kbd key={ki} className="kbd-badge">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn-modal-cancel">
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
