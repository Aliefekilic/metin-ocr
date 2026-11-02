import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Stop camera stream safely
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: { ideal: 'environment' },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Kamera erişim hatası:', err);
      setIsLoading(false);
      setError(
        'Kamera erişimi sağlanamadı. Lütfen tarayıcı izinlerini kontrol edin veya cihazınızda çalışan bir kamera olduğundan emin olun.'
      );
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, startCamera, stopStream]);

  // Capture frame to File
  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `kamera-belge-${Date.now()}.png`, {
        type: 'image/png',
      });
      stopStream();
      onCapture(file);
      onClose();
    }, 'image/png');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="camera-modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Camera size={20} className="text-cyan" />
            <h3 className="modal-title">Kamera ile Belge / Yazı Tara</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="modal-close-btn"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="camera-view-container">
          {isLoading && (
            <div className="camera-loading-state">
              <RefreshCw size={28} className="spinner-icon text-indigo" />
              <span>Kamera başlatılıyor...</span>
            </div>
          )}

          {error && (
            <div className="camera-error-state">
              <AlertCircle size={32} className="text-rose" />
              <p>{error}</p>
            </div>
          )}

          <video
            ref={videoRef}
            className={`camera-video ${isLoading || error ? 'hidden' : ''}`}
            playsInline
            muted
          />

          {!isLoading && !error && (
            <div className="camera-overlay-guide">
              <div className="guide-corners"></div>
              <span className="guide-label">Metni veya belgeyi çerçevenin içine hizalayın</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="btn-modal-cancel"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSnap}
            disabled={isLoading || !!error}
            className="btn-modal-capture"
          >
            <Camera size={18} />
            <span>Fotoğrafı Çek ve Tara</span>
          </button>
        </div>
      </div>
    </div>
  );
};
