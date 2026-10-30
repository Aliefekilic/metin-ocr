import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { 
  LanguageCode, 
  UploadedImage, 
  OcrProgressState, 
  OcrResultData, 
  StatusToast 
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
import { formatBytes, generateSampleImage } from './utils/formatters';
import { processImageOcr } from './services/ocrService';

export const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('tur+eng');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressState, setProgressState] = useState<OcrProgressState>({
    status: '',
    rawStatus: '',
    progress: 0
  });
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [ocrResult, setOcrResult] = useState<OcrResultData | null>(null);
  const [editableText, setEditableText] = useState<string>('');
  const [alert, setAlert] = useState<StatusToast | null>(null);

  // Timer reference for elapsed time during OCR
  const timerRef = useRef<number | null>(null);

  // Clean up Object URL when component unmounts
  useEffect(() => {
    return () => {
      if (uploadedImage?.previewUrl) {
        URL.revokeObjectURL(uploadedImage.previewUrl);
      }
    };
  }, [uploadedImage]);

  // Handle OCR processing
  const runOcr = useCallback(async (imageFile: File, language: LanguageCode) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setAlert(null);
    setProgressState({
      status: 'OCR motoru hazırlanıyor...',
      rawStatus: 'starting',
      progress: 5
    });

    // Start elapsed timer
    setElapsedSeconds(0);
    const startTimestamp = Date.now();
    timerRef.current = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimestamp) / 1000));
    }, 500);

    try {
      const result = await processImageOcr(imageFile, language, (pState) => {
        setProgressState(pState);
      });

      setOcrResult(result);
      setEditableText(result.text);

      if (!result.text.trim()) {
        setAlert({
          type: 'warning',
          message: 'Görsel tarandı ancak okunabilir herhangi bir metin tespit edilemedi. Daha net veya yüksek kontrastlı bir görsel ile deneyebilirsiniz.'
        });
      } else {
        setAlert({
          type: 'success',
          message: `Metin çıkarma başarıyla tamamlandı! (${result.wordCount} kelime, ${result.charCount} karakter tespit edildi)`
        });
      }
    } catch (err) {
      console.error('OCR process failure:', err);
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu';
      setAlert({
        type: 'error',
        message: `OCR işlemi sırasında hata oluştu: ${errorMessage}. Lütfen görseli kontrol edin veya sayfayı yenileyip tekrar deneyin.`
      });
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsProcessing(false);
    }
  }, [isProcessing]);

  // Handle file selection from Dropzone or Paste
  const handleFileSelect = useCallback((file: File) => {
    // Revoke previous preview URL if any
    if (uploadedImage?.previewUrl) {
      URL.revokeObjectURL(uploadedImage.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    const newImage: UploadedImage = {
      file,
      name: file.name,
      sizeBytes: file.size,
      sizeFormatted: formatBytes(file.size),
      previewUrl
    };

    // Calculate dimensions
    const img = new Image();
    img.onload = () => {
      newImage.dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      setUploadedImage({ ...newImage });
    };
    img.src = previewUrl;

    setUploadedImage(newImage);
    setOcrResult(null);
    setEditableText('');
    setAlert(null);

    // Automatically trigger OCR for seamless user experience
    runOcr(file, selectedLanguage);
  }, [uploadedImage, selectedLanguage, runOcr]);

  // Handle loading sample demo document
  const handleLoadSample = useCallback(async () => {
    try {
      const sampleFile = await generateSampleImage();
      handleFileSelect(sampleFile);
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Örnek görsel oluşturulurken bir hata oluştu.'
      });
    }
  }, [handleFileSelect]);

  // Handle language change
  const handleLanguageChange = (newLang: LanguageCode) => {
    setSelectedLanguage(newLang);
    // If an image is already loaded, prompt user or re-run
    if (uploadedImage && !isProcessing) {
      runOcr(uploadedImage.file, newLang);
    }
  };

  // Handle clear all
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

  return (
    <div className="deskpilot-app">
      {/* Background ambient lighting */}
      <div className="ambient-background">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
      </div>

      <Header />

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
                  disabled={isProcessing}
                  maxSizeBytes={15 * 1024 * 1024}
                />
              ) : (
                <ImagePreview
                  image={uploadedImage}
                  onClear={handleClear}
                  onRunOcr={() => runOcr(uploadedImage.file, selectedLanguage)}
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

          {/* Features and Roadmap Section */}
          <FeaturesGuide />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
