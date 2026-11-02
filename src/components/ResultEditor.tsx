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
  AlertTriangle,
  Search,
  Replace,
  FileCode,
  FileSpreadsheet,
  Printer,
  Wand2,
  WrapText,
  AlignLeft,
  CheckCircle2,
  Clock
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
  const [showToolsDropdown, setShowToolsDropdown] = useState<boolean>(false);
  const [findQuery, setFindQuery] = useState<string>('');
  const [replaceQuery, setReplaceQuery] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Compute live counts
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;
  const lineCount = text ? text.split(/\r\n|\r|\n/).length : 0;

  const showToast = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Handle Copy
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Metin panoya kopyalandı.');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  // Helper file downloader
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
    downloadFile(text, `${cleanName}.txt`, 'text/plain');
    showToast('TXT dosyası indirildi.');
  };

  // Download Markdown (.md)
  const handleDownloadMd = () => {
    if (!text) return;
    const mdContent = `# Metin OCR Çıktısı\n\n> Belge: ${originalFileName} | Tarih: ${new Date().toLocaleDateString('tr-TR')}\n\n---\n\n${text}\n`;
    downloadFile(mdContent, `${cleanName}.md`, 'text/markdown');
    showToast('Markdown dosyası indirildi.');
  };

  // Download JSON with metadata
  const handleDownloadJson = () => {
    if (!text) return;
    const jsonPayload = {
      meta: {
        sourceDocument: originalFileName,
        exportedAt: new Date().toISOString(),
        confidenceScore: result?.confidence ?? null,
        wordCount: wordCount,
        characterCount: charCount,
        processingDurationMs: result?.processingTimeMs ?? null,
      },
      text: text,
    };
    downloadFile(
      JSON.stringify(jsonPayload, null, 2),
      `${cleanName}.json`,
      'application/json'
    );
    showToast('JSON dosyası indirildi.');
  };

  // Print / Save as PDF
  const handlePrint = () => {
    if (!text) return;
    window.print();
  };

  // Smart Formatting Tool: Join broken lines (paragraf birleştirme)
  const handleJoinLines = () => {
    if (!text) return;
    // Replace single line breaks that don't look like paragraph endings with a space
    const joined = text
      .split(/\r?\n\r?\n/)
      .map((para) => para.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim())
      .join('\n\n');
    onTextChange(joined);
    showToast('Kopuk satırlar birleştirilerek paragraflar düzenlendi.');
  };

  // Clean redundant whitespace
  const handleCleanWhitespace = () => {
    if (!text) return;
    const cleaned = text
      .split('\n')
      .map((line) => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    onTextChange(cleaned);
    showToast('Fazla boşluklar ve boş satırlar temizlendi.');
  };

  // Uppercase
  const handleUpperCase = () => {
    if (!text) return;
    onTextChange(text.toLocaleUpperCase('tr-TR'));
    showToast('Tüm harfler BÜYÜK yapıldı.');
  };

  // Lowercase
  const handleLowerCase = () => {
    if (!text) return;
    onTextChange(text.toLocaleLowerCase('tr-TR'));
    showToast('Tüm harfler küçük yapıldı.');
  };

  // Title Case
  const handleTitleCase = () => {
    if (!text) return;
    const titled = text.replace(
      /\b([\p{L}\p{N}]+)/gu,
      (txt) => txt.charAt(0).toLocaleUpperCase('tr-TR') + txt.slice(1).toLocaleLowerCase('tr-TR')
    );
    onTextChange(titled);
    showToast('Baş harfler büyük yapıldı.');
  };

  // Find & Replace
  const handleReplaceAll = () => {
    if (!findQuery) return;
    const regex = new RegExp(findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      const updated = text.replace(regex, replaceQuery);
      onTextChange(updated);
      showToast(`${count} adet eşleşme güncellendi.`);
    } else {
      showToast('Eşleşen metin bulunamadı.');
    }
  };

  // Adjust font size
  const increaseFontSize = () => setFontSizeLevel((prev) => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSizeLevel((prev) => Math.max(prev - 2, 12));

  const isBlankResult = result !== null && trimmed.length === 0 && !isProcessing;

  return (
    <div className="result-editor-card">
      <div className="editor-header">
        <div className="editor-title-group">
          <FileText size={18} className="text-primary" />
          <h3 className="editor-title">Metin Düzenleyici & Çıktı</h3>
        </div>

        {/* Toolbar action buttons */}
        <div className="editor-actions-toolbar">
          {/* Find & Replace toggle */}
          <button
            type="button"
            onClick={() => setShowFindReplace((prev) => !prev)}
            disabled={!text || isProcessing}
            className={`ctrl-icon-btn ${showFindReplace ? 'active' : ''}`}
            title="Metin Bul ve Değiştir (Ctrl+F)"
          >
            <Search size={14} />
          </button>

          {/* Text Cleaning / Formatter Tools dropdown */}
          <div className="tools-dropdown-container">
            <button
              type="button"
              onClick={() => setShowToolsDropdown((prev) => !prev)}
              disabled={!text || isProcessing}
              className={`ctrl-icon-btn ${showToolsDropdown ? 'active' : ''}`}
              title="Metin Düzenleme ve Temizleme Araçları"
            >
              <Wand2 size={14} />
            </button>

            {showToolsDropdown && (
              <div className="tools-dropdown-menu">
                <button
                  type="button"
                  onClick={() => {
                    handleJoinLines();
                    setShowToolsDropdown(false);
                  }}
                  className="dropdown-item"
                >
                  <WrapText size={14} />
                  <span>Satırları Birleştir (Paragraf Yap)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleCleanWhitespace();
                    setShowToolsDropdown(false);
                  }}
                  className="dropdown-item"
                >
                  <AlignLeft size={14} />
                  <span>Fazla Boşlukları Temizle</span>
                </button>

                <div className="dropdown-divider"></div>

                <button
                  type="button"
                  onClick={() => {
                    handleTitleCase();
                    setShowToolsDropdown(false);
                  }}
                  className="dropdown-item"
                >
                  <span>Aa</span>
                  <span>Her Kelimenin Baş Harfini Büyüt</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleUpperCase();
                    setShowToolsDropdown(false);
                  }}
                  className="dropdown-item"
                >
                  <span>AA</span>
                  <span>Tümünü BÜYÜK Harf Yap</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleLowerCase();
                    setShowToolsDropdown(false);
                  }}
                  className="dropdown-item"
                >
                  <span>aa</span>
                  <span>Tümünü küçük harf yap</span>
                </button>
              </div>
            )}
          </div>

          {/* Font size adjustments */}
          <div className="font-controls">
            <button
              type="button"
              onClick={decreaseFontSize}
              disabled={fontSizeLevel <= 12}
              className="ctrl-icon-btn"
              title="Yazıyı Küçült"
            >
              <ZoomOut size={14} />
            </button>
            <span className="font-size-indicator">{fontSizeLevel}px</span>
            <button
              type="button"
              onClick={increaseFontSize}
              disabled={fontSizeLevel >= 24}
              className="ctrl-icon-btn"
              title="Yazıyı Büyüt"
            >
              <ZoomIn size={14} />
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
                <Check size={15} />
                <span>Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>Kopyala</span>
              </>
            )}
          </button>

          {/* Export Buttons */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            disabled={!trimmed || isProcessing}
            className="action-btn-secondary"
            id="btn-download-txt"
            title="Düz Metin (TXT) İndir"
          >
            <Download size={14} />
            <span>TXT</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMd}
            disabled={!trimmed || isProcessing}
            className="action-btn-secondary"
            title="Markdown (.md) Olarak İndir"
          >
            <FileCode size={14} />
            <span>MD</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            disabled={!trimmed || isProcessing}
            className="action-btn-secondary"
            title="JSON Formatında İndir"
          >
            <FileSpreadsheet size={14} />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={!trimmed || isProcessing}
            className="action-btn-secondary print-hide"
            title="Yazdır veya PDF Olarak Kaydet"
          >
            <Printer size={14} />
            <span>Yazdır</span>
          </button>

          {/* Clear Result Button */}
          <button
            type="button"
            onClick={onClearResult}
            disabled={!text || isProcessing}
            className="action-btn-ghost danger-text"
            title="Metin Alanını Temizle"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Find & Replace bar */}
      {showFindReplace && (
        <div className="find-replace-bar">
          <div className="find-input-wrap">
            <input
              type="text"
              placeholder="Aranacak ifade..."
              value={findQuery}
              onChange={(e) => setFindQuery(e.target.value)}
              className="find-input"
            />
          </div>
          <div className="replace-input-wrap">
            <input
              type="text"
              placeholder="Yeni ifade..."
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
            <Replace size={13} />
            <span>Tümünü Değiştir</span>
          </button>
        </div>
      )}

      {/* Floating status toast message */}
      {statusMsg && (
        <div className="editor-status-toast">
          <span>{statusMsg}</span>
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
                <CheckCircle2 size={13} />
                Doğruluk: %{result.confidence}
              </span>
            )}
            {result.processingTimeMs > 0 && (
              <span className="time-pill">
                <Clock size={12} />
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
            <AlertTriangle size={30} className="warning-icon" />
            <h4>Görselde Okunabilir Metin Tespit Edilemedi</h4>
            <p>
              Yüklenen görsel çok karanlık, bulanık veya metin içermiyor olabilir.
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
                ? 'Belge taranıyor, tanınan metin buraya aktarılacak...'
                : 'Metin tanıma sonucu burada görüntülenecek ve düzenlenebilecektir...'
            }
            disabled={isProcessing}
            spellCheck={false}
          />
        )}
      </div>

      {/* Printable view (only appears when printing) */}
      <div className="printable-document">
        <h2>Metin OCR Belge Çıktısı</h2>
        <div className="print-meta">
          <span>Kaynak: {originalFileName}</span>
          <span>Tarih: {result?.processedAt ? result.processedAt.toLocaleDateString('tr-TR') : '-'}</span>
        </div>
        <hr />
        <pre className="print-content">{text}</pre>
      </div>
    </div>
  );
};
