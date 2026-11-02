import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { 
  LanguageCode, 
  UploadedImage, 
  OcrProgressState, 
  OcrResultData, 
  StatusToast,
  ThemeMode,
  ScanHistoryItem
} from './types';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { LanguageSelector } from './components/LanguageSelector';
import { ImagePreview } from './components/ImagePreview';
import { ProgressBar } from './components/ProgressBar';
import { ResultEditor } from './components/ResultEditor';
import { FeaturesGuide } from './components/FeaturesGuide';
import { Footer } from './components/Footer';
import { AlertBanner } from './components/AlertBanner';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { HistoryModal } from './components/HistoryModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { formatBytes, generateSampleImage } from './utils/formatters';
import { processImageOcr } from './services/ocrService';
import { 
  getScanHistory, 
  saveScanHistory, 
  deleteScanHistoryItem, 
  clearScanHistory 
} from './utils/historyManager';

export const App: React.FC = () => {
  // Theme state: defaults to 'light' per user request
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('metin_theme') as ThemeMode;
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light';
  });

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('tur+eng');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => getScanHistory());

  const [progressState, setProgressState] = useState<OcrProgressState>({
    status: '',
    rawStatus: '',
    progress: 0,
  });
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [ocrResult, setOcrResult] = useState<OcrResultData | null>(null);
  const [editableText, setEditableText] = useState<string>('');
  const [alert, setAlert] = useState<StatusToast | null>(null);

  const timerRef = useRef<number | null>(null);

  // Sync theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('metin_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Clean up Object URL on unmount
  useEffect(() => {
    return () => {
      if (uploadedImage?.previewUrl) {
        URL.revokeObjectURL(uploadedImage.previewUrl);
      }
    };
  }, [uploadedImage]);

  // Handle OCR processing
  const runOcr = useCallback(
    async (imageFile?: File, language?: LanguageCode) => {
      const targetFile = imageFile || uploadedImage?.file;
      const targetLang = language || selectedLanguage;

      if (!targetFile || isProcessing) return;

      setIsProcessing(true);
      setAlert(null);
      setProgressState({
        status: 'OCR motoru hazırlanıyor...',
        rawStatus: 'starting',
        progress: 5,
      });

      // Start elapsed timer
      setElapsedSeconds(0);
      const startTimestamp = Date.now();
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTimestamp) / 1000));
      }, 500);

      try {
        const result = await processImageOcr(targetFile, targetLang, (pState) => {
          setProgressState(pState);
        });

        setOcrResult(result);
        setEditableText(result.text);

        if (!result.text.trim()) {
          setAlert({
            type: 'warning',
            message:
              'Görsel tarandı ancak okunabilir metin tespit edilemedi. Görseli iyileştirmek için sol paneldeki "İyileştir" menüsünden döndürmeyi veya kontrastı artırmayı deneyin.',
          });
        } else {
          setAlert({
            type: 'success',
            message: `Metin başarıyla çıkarıldı (${result.wordCount} kelime, ${result.charCount} karakter).`,
          });

          // Save to local scan history
          const updatedHistory = saveScanHistory({
            fileName: targetFile.name,
            text: result.text,
            charCount: result.charCount,
            wordCount: result.wordCount,
            confidence: result.confidence,
            language: targetLang,
          });
          setHistory(updatedHistory);
        }
      } catch (err) {
        console.error('OCR process failure:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu';
        setAlert({
          type: 'error',
          message: `OCR işlemi sırasında hata oluştu: ${errorMessage}. Lütfen görseli kontrol edip tekrar deneyin.`,
        });
      } finally {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsProcessing(false);
      }
    },
    [isProcessing, uploadedImage, selectedLanguage]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (file: File) => {
      if (uploadedImage?.previewUrl) {
        URL.revokeObjectURL(uploadedImage.previewUrl);
      }

      const previewUrl = URL.createObjectURL(file);
      const newImage: UploadedImage = {
        file,
        name: file.name,
        sizeBytes: file.size,
        sizeFormatted: formatBytes(file.size),
        previewUrl,
      };

      const img = new Image();
      img.onload = () => {
        newImage.dimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };
        setUploadedImage({ ...newImage });
      };
      img.src = previewUrl;

      setUploadedImage(newImage);
      setOcrResult(null);
      setEditableText('');
      setAlert(null);

      // Automatically run OCR
      runOcr(file, selectedLanguage);
    },
    [uploadedImage, selectedLanguage, runOcr]
  );

  // Global keyboard shortcuts (Ctrl+Enter to run OCR, Esc to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (uploadedImage && !isProcessing) {
          e.preventDefault();
          runOcr(uploadedImage.file, selectedLanguage);
        }
      } else if (e.key === 'Escape') {
        setIsCameraOpen(false);
        setIsHistoryOpen(false);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [uploadedImage, isProcessing, selectedLanguage, runOcr]);

  // Load sample demo document
  const handleLoadSample = useCallback(async () => {
    try {
      const sampleFile = await generateSampleImage();
      handleFileSelect(sampleFile);
    } catch (err) {
      console.warn('Örnek görsel hatası:', err);
      setAlert({
        type: 'error',
        message: 'Örnek görsel oluşturulurken bir hata oluştu.',
      });
    }
  }, [handleFileSelect]);

  // Language change
  const handleLanguageChange = (newLang: LanguageCode) => {
    setSelectedLanguage(newLang);
    if (uploadedImage && !isProcessing) {
      runOcr(uploadedImage.file, newLang);
    }
  };

  // Clear workspace
  const handleClear = () => {
    if (uploadedImage?.previewUrl) {
      URL.revokeObjectURL(uploadedImage.previewUrl);
    }
    setUploadedImage(null);
    setOcrResult(null);
    setEditableText('');
    setAlert(null);
    setProgressState({ status: '', rawStatus: '', progress: 0 });
    setElapsedSeconds(0);
  };

  // Restore item from history
  const handleSelectHistoryItem = (item: ScanHistoryItem) => {
    setEditableText(item.text);
    setOcrResult({
      text: item.text,
      confidence: item.confidence,
      charCount: item.charCount,
      wordCount: item.wordCount,
      lineCount: item.text ? item.text.split('\n').length : 0,
      processedAt: new Date(item.timestamp),
      processingTimeMs: 0,
      languageUsed: selectedLanguage,
    });
    setAlert({
      type: 'info',
      message: `"${item.fileName}" başlıklı geçmiş taraması yüklendi.`,
    });
  };

  // History operations
  const handleClearAllHistory = () => {
    clearScanHistory();
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteScanHistoryItem(id);
    setHistory(updated);
  };

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        historyCount={history.length}
      />

      <main className="main-content">
        <div className="content-container">
          {/* Status Alert Banner */}
          {alert && (
            <div className="alert-wrapper">
              <AlertBanner
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          {/* Language Selector */}
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
            disabled={isProcessing}
          />

          {/* Main Workspace Grid */}
          <div className="workspace-grid">
            {/* Left Column: Upload / Image Preview */}
            <div className="workspace-column left-column">
              {!uploadedImage ? (
                <Dropzone
                  onFileSelected={handleFileSelect}
                  onLoadSample={handleLoadSample}
                  onOpenCam={() => setIsCameraOpen(true)}
                  disabled={isProcessing}
                  maxSizeBytes={15 * 1024 * 1024}
                />
              ) : (
                <ImagePreview
                  image={uploadedImage}
                  onClear={handleClear}
                  onRunOcr={(customFile) =>
                    runOcr(customFile || uploadedImage.file, selectedLanguage)
                  }
                  isProcessing={isProcessing}
                />
              )}

              {/* Progress bar displayed during processing */}
              {isProcessing && (
                <div className="processing-block">
                  <ProgressBar
                    progressState={progressState}
                    elapsedSeconds={elapsedSeconds}
                  />
                </div>
              )}
            </div>

            {/* Right Column: Result Editor */}
            <div className="workspace-column right-column">
              <ResultEditor
                result={ocrResult}
                text={editableText}
                onTextChange={setEditableText}
                onClearResult={() => setEditableText('')}
                originalFileName={uploadedImage?.name}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {/* Features, Tips and FAQs */}
          <FeaturesGuide />
        </div>
      </main>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleFileSelect}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearAll={handleClearAllHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default App;
