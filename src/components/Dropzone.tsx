import React, { useRef, useState, useCallback, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, FileCheck2, Camera } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

interface DropzoneProps {
  onFileSelected: (file: File) => void;
  onLoadSample: () => void;
  onOpenCam: () => void;
  disabled?: boolean;
  maxSizeBytes?: number;
}

const SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
const DEFAULT_MAX_SIZE = 15 * 1024 * 1024; // 15 MB

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelected,
  onLoadSample,
  onOpenCam,
  disabled = false,
  maxSizeBytes = DEFAULT_MAX_SIZE,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndPassFile = useCallback(
    (file: File) => {
      setLocalError(null);

      // File type validation
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      const hasValidExt = SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
      const hasValidMime = SUPPORTED_MIME_TYPES.includes(fileType);

      if (!hasValidMime && !hasValidExt) {
        setLocalError(
          `Desteklenmeyen dosya formatı ("${file.name}"). Lütfen sadece PNG, JPG/JPEG veya WEBP formatında bir görsel yükleyin.`
        );
        return;
      }

      // Size limit validation (15 MB)
      if (file.size > maxSizeBytes) {
        setLocalError(
          `Dosya boyutu çok büyük (${formatBytes(file.size)}). DeskPilot maksimum ${formatBytes(maxSizeBytes)} boyutundaki görselleri kabul etmektedir.`
        );
        return;
      }

      onFileSelected(file);
    },
    [maxSizeBytes, onFileSelected]
  );

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  };

  // Handle Drag Leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndPassFile(droppedFile);
    }
  };

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      validateAndPassFile(selected);
      e.target.value = '';
    }
  };

  // Handle global paste event (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const pastedFile = items[i].getAsFile();
          if (pastedFile) {
            validateAndPassFile(pastedFile);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [disabled, validateAndPassFile]);

  return (
    <div className="dropzone-container">
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden-file-input"
        id="file-upload-input"
      />

      <div
        className={`dropzone-card ${isDragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Görsel yükleme alanı"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
      >
        <div className="dropzone-inner">
          <div className="upload-icon-wrapper">
            <UploadCloud size={44} className="upload-icon" />
          </div>

          <h2 className="dropzone-title">Görseli buraya sürükleyip bırakın</h2>
          <p className="dropzone-subtitle">
            veya cihazınızdan dosya seçmek için <span className="highlight-browse">göz atın</span>
          </p>

          <div className="dropzone-badges">
            <span className="format-badge">
              <ImageIcon size={13} className="badge-icon" />
              PNG, JPG, WEBP
            </span>
            <span className="format-badge">
              <FileCheck2 size={13} className="badge-icon" />
              Maks. {formatBytes(maxSizeBytes, 0)}
            </span>
            <span className="format-badge ctrl-v-badge">
              <span>📋 Ctrl + V ile Yapıştır</span>
            </span>
          </div>
        </div>
      </div>

      {localError && (
        <div className="dropzone-error-box">
          <AlertCircle size={18} className="error-icon" />
          <span>{localError}</span>
        </div>
      )}

      {/* Quick action buttons row: Sample + Camera */}
      <div className="sample-loader-row">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCam();
          }}
          disabled={disabled}
          className="cam-btn"
          title="Kamera ile fotoğraf çekerek belge tara"
        >
          <Camera size={15} />
          <span>Kamera ile Çek</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLoadSample();
          }}
          disabled={disabled}
          className="sample-btn"
        >
          <Sparkles size={15} className="sample-btn-icon" />
          <span>Örnek Türkçe Notu Yükle</span>
        </button>
      </div>
    </div>
  );
};
