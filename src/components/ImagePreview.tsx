import React from 'react';
import type { UploadedImage } from '../types';
import { Trash2, RefreshCw, Eye, Sparkles } from 'lucide-react';

interface ImagePreviewProps {
  image: UploadedImage;
  onClear: () => void;
  onRunOcr: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  onClear,
  onRunOcr,
  isProcessing,
  disabled = false
}) => {
  return (
    <div className="preview-card">
      <div className="preview-header">
        <div className="preview-title-wrap">
          <Eye size={18} className="text-primary" />
          <h3 className="preview-title">Yüklenen Görsel</h3>
        </div>
        <div className="preview-actions">
          <button
            type="button"
            onClick={onClear}
            disabled={isProcessing || disabled}
            className="action-btn-danger"
            title="Görseli ve sonucu kaldır"
          >
            <Trash2 size={15} />
            <span>Kaldır</span>
          </button>
        </div>
      </div>

      <div className="preview-image-container">
        <img
          src={image.previewUrl}
          alt={image.name}
          className="preview-img-element"
        />
        <div className="preview-overlay-info">
          <span className="info-chip">{image.name}</span>
          <span className="info-chip">{image.sizeFormatted}</span>
          {image.dimensions && (
            <span className="info-chip">
              {image.dimensions.width} × {image.dimensions.height} px
            </span>
          )}
        </div>
      </div>

      <div className="preview-footer-toolbar">
        <button
          type="button"
          onClick={onRunOcr}
          disabled={isProcessing || disabled}
          className="btn-start-ocr"
          id="btn-start-ocr"
        >
          {isProcessing ? (
            <>
              <RefreshCw size={18} className="spinner-icon" />
              <span>Metin Taranıyor...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Metni Çıkar (OCR Başlat)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
