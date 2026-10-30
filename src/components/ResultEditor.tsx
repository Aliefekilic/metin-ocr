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
  AlertTriangle,
  Search,
  Replace,
  FileCode,
  FileSpreadsheet
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
  isProcessing,
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(15);
  const [showFindReplace, setShowFindReplace] = useState<boolean>(false);
  const [findQuery, setFindQuery] = useState<string>('');
  const [replaceQuery, setReplaceQuery] = useState<string>('');
  const [replaceCountMsg, setReplaceCountMsg] = useState<string | null>(null);

  // Handle Copy
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

  // Generic file downloader helper
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cleanName = originalFileName.replace(/\.[^/.]+$/, '') || 'metin';

  // Download TXT
  const handleDownloadTxt = () => {
    if (!text) return;
    downloadFile(text, `deskpilot-${cleanName}.txt`, 'text/plain');
  };

  // Download Markdown (.md)
  const handleDownloadMd = () => {
    if (!text) return;
    const mdContent = `# DeskPilot OCR Metin Çıktısı\n\n> Kaynak: ${originalFileName} | Tarih: ${new Date().toLocaleDateString('tr-TR')}\n\n---\n\n${text}\n`;
    downloadFile(mdContent, `deskpilot-${cleanName}.md`, 'text/markdown');
  };

  // Download JSON with metadata
  const handleDownloadJson = () => {
    if (!text) return;
    const jsonPayload = {
      meta: {
        sourceImage: originalFileName,
        exportedAt: new Date().toISOString(),
        confidenceScore: result?.confidence ?? null,
        wordCount: wordCount,
        characterCount: charCount,
        processingDurationMs: result?.processingTimeMs ?? null,
      },
      content: text,
    };
    downloadFile(
      JSON.stringify(jsonPayload, null, 2),
      `deskpilot-${cleanName}.json`,
      'application/json'
    );
  };

  // Handle Find & Replace
  const handleReplaceAll = () => {
    if (!findQuery) return;
    const regex = new RegExp(findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      const updated = text.replace(regex, replaceQuery);
      onTextChange(updated);
      setReplaceCountMsg(`${count} adet eşleşme değiştirildi.`);
    } else {
      setReplaceCountMsg('Eşleşen metin bulunamadı.');
    }
    setTimeout(() => setReplaceCountMsg(null), 3000);
  };

  // Adjust font size
  const increaseFontSize = () => setFontSizeLevel((prev) => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSizeLevel((prev) => Math.max(prev - 2, 12));

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
          {/* Find & Replace toggle */}
          <button
            type="button"
            onClick={() => setShowFindReplace((prev) => !prev)}
            disabled={!text || isProcessing}
            className={`ctrl-icon-btn ${showFindReplace ? 'active' : ''}`}
            title="Metin Bul ve Değiştir"
          >
            <Search size={15} />
          </button>

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

          {/* Export Dropdown / Buttons */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            disabled={!trimmed || isProcessing}
            className="action-btn-secondary"
            id="btn-download-txt"
            title="TXT Dosyası Olarak İndir"
          >
            <Download size={15} />
            <span>TXT</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMd}
            disabled={!trimmed || isProcessing}
            className="action-btn-secondary"
            title="Markdown (.md) Olarak İndir"
          >
            <FileCode size={15} />
            <span>MD</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            disabled={!trimmed || isProcessing}
            className="action-btn-secondary"
            title="JSON Formatında İndir"
          >
            <FileSpreadsheet size={15} />
            <span>JSON</span>
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

      {/* Find & Replace bar */}
      {showFindReplace && (
        <div className="find-replace-bar">
          <div className="find-input-wrap">
            <input
              type="text"
              placeholder="Aranacak kelime..."
              value={findQuery}
              onChange={(e) => setFindQuery(e.target.value)}
              className="find-input"
            />
          </div>
          <div className="replace-input-wrap">
            <input
              type="text"
              placeholder="Yeni metin..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="find-input"
            />
          </div>
          <button
            type="button"
            onClick={handleReplaceAll}
            disabled={!findQuery}
            className="btn-replace-all"
          >
            <Replace size={14} />
            <span>Tümünü Değiştir</span>
          </button>
          {replaceCountMsg && (
            <span className="replace-status-text">{replaceCountMsg}</span>
          )}
        </div>
      )}

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
              <span
                className={`confidence-pill ${
                  result.confidence > 75
                    ? 'high'
                    : result.confidence > 50
                    ? 'medium'
                    : 'low'
                }`}
              >
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
              Sol paneldeki <strong>İyileştir</strong> menüsünden görseli döndürmeyi, kontrastı artırmayı veya siyah-beyaza çevirmeyi deneyebilirsiniz.
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
        <span>💡 İpucu: Tanınan metni buradan düzenleyebilir, Bul & Değiştir ile imla hatalarını düzeltebilir, TXT, MD veya JSON olarak indirebilirsiniz.</span>
      </div>
    </div>
  );
};
