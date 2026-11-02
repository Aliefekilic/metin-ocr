import React, { useState } from 'react';
import type { UploadedImage } from '../types';
import { 
  Trash2, 
  RefreshCw, 
  Eye, 
  RotateCw, 
  SlidersHorizontal, 
  Contrast, 
  SunMedium, 
  Undo2,
  ZoomIn,
  ZoomOut,
  ScanText
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
  const [zoomLevel, setZoomLevel] = useState<number>(100);

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

  // Preset: Receipt / Invoice (High contrast + grayscale)
  const handlePresetReceipt = () => {
    handleUpdateFilters({
      ...filters,
      grayscale: true,
      highContrast: true,
      invert: false,
    });
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setActivePreviewUrl(image.previewUrl);
    setFilteredFile(image.file);
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 25, 250));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

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
          <h3 className="preview-title">Yüklenen Belge</h3>
        </div>

        <div className="preview-actions">
          {/* Zoom controls */}
          <div className="zoom-controls-group">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="ctrl-icon-btn"
              title="Görseli Uzaklaştır"
            >
              <ZoomOut size={14} />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="zoom-level-indicator"
              title="Varsayılan Boyuta Sıfırla"
            >
              %{zoomLevel}
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 250}
              className="ctrl-icon-btn"
              title="Görseli Yakınlaştır"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Toggle filter tools button */}
          <button
            type="button"
            onClick={() => setShowFiltersPanel((prev) => !prev)}
            disabled={isProcessing || disabled}
            className={`action-btn-secondary filter-toggle-btn ${showFiltersPanel ? 'active' : ''}`}
            title="Görsel İyileştirme Araçları (Döndür, Kontrast, Siyah-Beyaz)"
          >
            <SlidersHorizontal size={14} />
            <span>İyileştir</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={isProcessing || disabled}
            className="action-btn-danger"
            title="Görseli ve sonucu kaldır"
          >
            <Trash2 size={14} />
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
            <RotateCw size={13} />
            <span>Döndür {filters.rotation > 0 ? `(${filters.rotation}°)` : ''}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleGrayscale}
            disabled={isProcessing || isApplyingFilter}
            className={`filter-tool-btn ${filters.grayscale ? 'active' : ''}`}
            title="Siyah-Beyaz / Gri Tonlama (Arka plan lekelerini ve renk gürültüsünü temizler)"
          >
            <SunMedium size={13} />
            <span>Gri Ton</span>
          </button>

          <button
            type="button"
            onClick={handleToggleContrast}
            disabled={isProcessing || isApplyingFilter}
            className={`filter-tool-btn ${filters.highContrast ? 'active' : ''}`}
            title="Yüksek Kontrast (Soluk ve silik yazıları belirginleştirir)"
          >
            <Contrast size={13} />
            <span>Yüksek Kontrast</span>
          </button>

          <button
            type="button"
            onClick={handlePresetReceipt}
            disabled={isProcessing || isApplyingFilter}
            className="filter-tool-btn preset-btn"
            title="Fiş, fatura ve termal kağıtlar için otomatik iyileştirme"
          >
            <span>Evrak / Fiş Modu</span>
          </button>

          <button
            type="button"
            onClick={handleToggleInvert}
            disabled={isProcessing || isApplyingFilter}
            className={`filter-tool-btn ${filters.invert ? 'active' : ''}`}
            title="Renkleri Tersine Çevir (Negatif)"
          >
            <span>Negatif</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              disabled={isProcessing || isApplyingFilter}
              className="filter-tool-btn reset-btn"
              title="Filtreleri Sıfırla"
            >
              <Undo2 size={13} />
              <span>Sıfırla</span>
            </button>
          )}
        </div>
      )}

      <div className="preview-image-container">
        <div 
          className="preview-image-scrollable"
          style={{ overflow: zoomLevel > 100 ? 'auto' : 'hidden' }}
        >
          <img
            src={activePreviewUrl}
            alt={image.name}
            className="preview-img-element"
            style={{ 
              transform: `scale(${zoomLevel / 100})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
          />
        </div>

        {isApplyingFilter && (
          <div className="filter-loading-overlay">
            <RefreshCw size={24} className="spinner-icon text-primary" />
            <span>Görsel filtreleniyor...</span>
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
            <span className="info-chip active-filter-chip">İyileştirilmiş Görsel</span>
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
              <RefreshCw size={17} className="spinner-icon" />
              <span>Metin Taranıyor...</span>
            </>
          ) : (
            <>
              <ScanText size={17} />
              <span>
                {hasActiveFilters
                  ? 'Filtreli Belgeden Metni Çıkar (OCR)'
                  : 'Metni Çıkar (OCR Başlat)'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
