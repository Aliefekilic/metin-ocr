import React from 'react';
import type { ScanHistoryItem } from '../types';
import { History, X, Trash2, ArrowUpRight, Clock, FileText } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryItem[];
  onSelectHistoryItem: (item: ScanHistoryItem) => void;
  onClearAll: () => void;
  onDeleteItem: (id: string) => void;
}

function formatHistoryDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return `Bugün, ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearAll,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="history-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <History size={20} className="text-primary" />
            <div>
              <h3 className="modal-title">Son Taramalar</h3>
              <p className="modal-subtitle">Yalnızca bu tarayıcıda saklanan yerel geçmiş</p>
            </div>
          </div>
          <div className="modal-header-actions">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="action-btn-ghost danger-text"
                title="Tüm geçmişi sil"
              >
                <Trash2 size={15} />
                <span>Geçmişi Temizle</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="history-list-body">
          {history.length === 0 ? (
            <div className="history-empty-state">
              <FileText size={36} className="text-muted" />
              <p className="empty-title">Henüz kayıtlı tarama bulunmuyor</p>
              <p className="empty-desc">
                Görsel taradığınızda sonuçlar bu alanda listelenecek ve dilediğiniz zaman tekrar yüklenebilecektir.
              </p>
            </div>
          ) : (
            <div className="history-items-container">
              {history.map((item) => (
                <div key={item.id} className="history-item-row">
                  <div className="history-item-meta">
                    <div className="history-file-title">
                      <FileText size={16} className="text-primary" />
                      <span className="file-name">{item.fileName}</span>
                    </div>
                    <div className="history-tags">
                      <span className="history-time-tag">
                        <Clock size={12} />
                        {formatHistoryDate(item.timestamp)}
                      </span>
                      <span className="history-count-tag">{item.wordCount} kelime</span>
                      <span className="history-count-tag">{item.charCount} karakter</span>
                      {item.confidence !== null && (
                        <span className="history-confidence-tag">
                          %{item.confidence} doğruluk
                        </span>
                      )}
                    </div>
                    <p className="history-snippet">
                      {item.text.length > 180 ? `${item.text.slice(0, 180)}...` : item.text}
                    </p>
                  </div>

                  <div className="history-item-actions">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectHistoryItem(item);
                        onClose();
                      }}
                      className="history-load-btn"
                      title="Bu metni düzenleyiciye aktar"
                    >
                      <ArrowUpRight size={15} />
                      <span>Yükle</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="history-del-btn"
                      title="Bu kaydı sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <span className="history-footer-note">
            🛡️ Gizlilik güvencesi: Geçmiş verileriniz hiçbir sunucuya gönderilmez, tarayıcınızın yerel belleğinde saklanır.
          </span>
          <button type="button" onClick={onClose} className="btn-modal-cancel">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
