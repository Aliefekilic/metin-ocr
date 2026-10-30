import React, { useState } from 'react';
import type { UploadedImage } from '../types';
import { 
  Trash2, 
  RefreshCw, 
  Eye, 
  Sparkles, 
  RotateCw, 
  SlidersHorizontal, 
  Contrast, 
  SunMedium, 
  Undo2 
} from 'lucide-react';
import { 
  type ImageFilterOptions, 
  DEFAULT_FILTERS, 
  applyImageFilters 
} from '../utils/imageProcessor';

interface ImagePreviewProps {
  image: UploadedImage;
  onClear: () => void;
  onRunOcr: (customFile?: File) => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  onClear,
  onRunOcr,
  isProcessing,
  disabled = false,
}) => {
  const [filters, setFilters] = useState<ImageFilterOptions>(DEFAULT_FILTERS);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string>(image.previewUrl);
  const [filteredFile, setFilteredFile] = useState<File>(image.file);
  const [isApplyingFilter, setIsApplyingFilter] = useState<boolean>(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);

  // Apply new filters
  const handleUpdateFilters = async (newFilters: ImageFilterOptions) => {
    setFilters(newFilters);
    setIsApplyingFilter(true);
    try {
      const result = await applyImageFilters(image.file, newFilters);
      setActivePreviewUrl(result.previewUrl);
      setFilteredFile(result.file);
    } catch (err) {
      console.error('Filtre uygulama hatası:', err);
    } finally {
      setIsApplyingFilter(false);
    }
  };

  // Rotate 90 degrees
  const handleRotate = () => {
    const nextRotation = (filters.rotation + 90) % 360;
    handleUpdateFilters({ ...filters, rotation: nextRotation });
  };

  // Toggle Grayscale
  const handleToggleGrayscale = () => {
    handleUpdateFilters({ ...filters, grayscale: !filters.grayscale });
  };

  // Toggle High Contrast
  const handleToggleContrast = () => {
    handleUpdateFilters({ ...filters, highContrast: !filters.highContrast });
  };

  // Toggle Invert
  const handleToggleInvert = () => {
    handleUpdateFilters({ ...filters, invert: !filters.invert });
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setActivePreviewUrl(image.previewUrl);
    setFilteredFile(image.file);
  };

  const hasActiveFilters =
    filters.rotation !== 0 ||
    filters.grayscale ||
    filters.highContrast ||
    filters.invert;

  return (
    <div className="preview-card">
      <div className="preview-header">
        <div className="preview-title-wrap">
          <Eye size={18} className="text-primary" />
          <h3 className="preview-title">Yüklenen Görsel</h3>
        </div>

        <div className="preview-actions">
          {/* Toggle filter tools button */}
          <button
            type="button"
            onClick={() => setShowFiltersPanel((prev) => !prev)}
            disabled={isProcessing || disabled}
            className={`action-btn-secondary filter-toggle-btn ${showFiltersPanel ? 'active' : ''}`}
            title="Görsel İyileştirme Araçları (Döndür, Kontrast, Siyah-Beyaz)"
          >
            <SlidersHorizontal size={15} />
            <span>İyileştir</span>
          </button>

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

      {/* Filter toolbar panel */}
      {showFiltersPanel && (
        <div className="filter-tools-bar">
          <button
            type="button"
            onClick={handleRotate}
            disabled={isProcessing || isApplyingFilter}
            className="filter-tool-btn"
            title="90 Derece Sağa Döndür"
          >
            <RotateCw size={14} />
            <span>Döndür {filters.rotation > 0 ? `(${filters.rotation}°)` : ''}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleGrayscale}
            disabled={isProcessing || isApplyingFilter}
            className={`filter-tool-btn ${filters.grayscale ? 'active' : ''}`}
            title="Siyah-Beyaz / Gri Tonlama (Arka plan gürültüsünü temizler)"
          >
            <SunMedium size={14} />
            <span>Siyah-Beyaz</span>
          </button>

          <button
            type="button"
            onClick={handleToggleContrast}
            disabled={isProcessing || isApplyingFilter}
            className={`filter-tool-btn ${filters.highContrast ? 'active' : ''}`}
            title="Yüksek Kontrast (Soluk yazıları belirginleştirir)"
          >
            <Contrast size={14} />
            <span>Yüksek Kontrast</span>
          </button>

          <button
            type="button"
            onClick={handleToggleInvert}
            disabled={isProcessing || isApplyingFilter}
            className={`filter-tool-btn ${filters.invert ? 'active' : ''}`}
            title="Renkleri Tersine Çevir (Negatif)"
          >
            <span>Ters Çevir</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              disabled={isProcessing || isApplyingFilter}
              className="filter-tool-btn reset-btn"
              title="Filtreleri Sıfırla"
            >
              <Undo2 size={14} />
              <span>Sıfırla</span>
            </button>
          )}
        </div>
      )}

      <div className="preview-image-container">
        <img
          src={activePreviewUrl}
          alt={image.name}
          className="preview-img-element"
        />

        {isApplyingFilter && (
          <div className="filter-loading-overlay">
            <RefreshCw size={24} className="spinner-icon text-indigo" />
            <span>Filtre uygulanıyor...</span>
          </div>
        )}

        <div className="preview-overlay-info">
          <span className="info-chip">{image.name}</span>
          <span className="info-chip">{image.sizeFormatted}</span>
          {image.dimensions && (
            <span className="info-chip">
              {image.dimensions.width} × {image.dimensions.height} px
            </span>
          )}
          {hasActiveFilters && (
            <span className="info-chip active-filter-chip">Filtreli Görsel</span>
          )}
        </div>
      </div>

      <div className="preview-footer-toolbar">
        <button
          type="button"
          onClick={() => onRunOcr(filteredFile)}
          disabled={isProcessing || disabled || isApplyingFilter}
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
              <span>
                {hasActiveFilters
                  ? 'Filtreli Görselden Metni Çıkar (OCR)'
                  : 'Metni Çıkar (OCR Başlat)'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
