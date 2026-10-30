import React, { useState } from 'react';
import type { OcrResultData } from '../types';
import { 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  Sparkles,
  AlertTriangle 
} from 'lucide-react';

interface ResultEditorProps {
  result: OcrResultData | null;
  text: string;
  onTextChange: (newText: string) => void;
  onClearResult: () => void;
  originalFileName?: string;
  isProcessing: boolean;
}

export const ResultEditor: React.FC<ResultEditorProps> = ({
  result,
  text,
  onTextChange,
  onClearResult,
  originalFileName = 'belge',
  isProcessing
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(15); // in pixels

  // Handle Copy to clipboard
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  // Handle TXT file download
  const handleDownloadTxt = () => {
    if (!text) return;
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const cleanName = originalFileName.replace(/\.[^/.]+$/, '');
      link.href = url;
      link.download = `deskpilot-${cleanName || 'metin'}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('İndirme hatası:', err);
    }
  };

  // Adjust font size
  const increaseFontSize = () => setFontSizeLevel(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSizeLevel(prev => Math.max(prev - 2, 12));

  // Compute live counts
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;
  const lineCount = text ? text.split(/\r\n|\r|\n/).length : 0;

  const isBlankResult = result !== null && trimmed.length === 0 && !isProcessing;

  return (
    <div className="result-editor-card">
      <div className="editor-header">
        <div className="editor-title-group">
          <FileText size={18} className="text-cyan" />
          <h3 className="editor-title">Tanınan Metin & Düzenleyici</h3>
        </div>

        {/* Toolbar action buttons */}
        <div className="editor-actions-toolbar">
          {/* Font size adjustments */}
          <div className="font-controls">
            <button
              type="button"
              onClick={decreaseFontSize}
              disabled={fontSizeLevel <= 12}
              className="ctrl-icon-btn"
              title="Yazıyı Küçült"
            >
              <ZoomOut size={15} />
            </button>
            <span className="font-size-indicator">{fontSizeLevel}px</span>
            <button
              type="button"
              onClick={increaseFontSize}
              disabled={fontSizeLevel >= 24}
              className="ctrl-icon-btn"
              title="Yazıyı Büyüt"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!trimmed || isProcessing}
            className={`action-btn-primary ${copied ? 'copied' : ''}`}
            id="btn-copy-text"
            title="Panoya Kopyala"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Kopyala</span>
              </>
            )}
          </button>

          {/* Download TXT Button */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            disabled={!trimmed || isProcessing}
            className="action-btn-secondary"
            id="btn-download-txt"
            title="TXT Dosyası Olarak İndir"
          >
            <Download size={16} />
            <span>TXT İndir</span>
          </button>

          {/* Clear Result Button */}
          <button
            type="button"
            onClick={onClearResult}
            disabled={!text || isProcessing}
            className="action-btn-ghost"
            title="Metin Alanını Temizle"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="editor-stats-bar">
        <div className="stats-group">
          <span className="stat-pill">
            <span className="stat-num">{charCount}</span> karakter
          </span>
          <span className="stat-pill">
            <span className="stat-num">{wordCount}</span> kelime
          </span>
          <span className="stat-pill">
            <span className="stat-num">{lineCount}</span> satır
          </span>
        </div>

        {result && (
          <div className="meta-stats-group">
            {result.confidence !== null && (
              <span className={`confidence-pill ${result.confidence > 75 ? 'high' : result.confidence > 50 ? 'medium' : 'low'}`}>
                <Sparkles size={13} />
                Güven Skoru: %{result.confidence}
              </span>
            )}
            {result.processingTimeMs > 0 && (
              <span className="time-pill">
                {(result.processingTimeMs / 1000).toFixed(1)} sn
              </span>
            )}
          </div>
        )}
      </div>

      {/* Editor Body */}
      <div className="editor-body">
        {isBlankResult ? (
          <div className="blank-result-warning">
            <AlertTriangle size={32} className="warning-icon" />
            <h4>Görselde Okunabilir Metin Tespit Edilemedi</h4>
            <p>
              Yüklenen görsel boş, çok bulanık, düşük çözünürlüklü veya aşırı el yazısı içeriyor olabilir.
              Daha net, yüksek kontrastlı ve yatay bir görselle tekrar deneyebilirsiniz.
            </p>
          </div>
        ) : (
          <textarea
            id="ocr-result-textarea"
            className="editor-textarea"
            style={{ fontSize: `${fontSizeLevel}px` }}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={
              isProcessing
                ? 'Görsel taranıyor, metin buraya aktarılacak...'
                : 'Metin tanıma sonucu burada görüntülenecek ve doğrudan düzenlenebilir olacaktır...'
            }
            disabled={isProcessing}
            spellCheck={false}
          />
        )}
      </div>

      {/* Help tooltip note */}
      <div className="editor-footer-note">
        <span>💡 İpucu: Tanınan metni bu alandan doğrudan düzenleyebilir veya klavyeden yeni notlar ekleyebilirsiniz.</span>
      </div>
    </div>
  );
};
