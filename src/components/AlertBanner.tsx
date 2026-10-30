import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface AlertBannerProps {
  type: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  onClose?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type,
  title,
  message,
  onClose
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={20} className="alert-icon-svg" />;
      case 'warning':
        return <AlertTriangle size={20} className="alert-icon-svg" />;
      case 'success':
        return <CheckCircle2 size={20} className="alert-icon-svg" />;
      case 'info':
      default:
        return <Info size={20} className="alert-icon-svg" />;
    }
  };

  return (
    <div className={`alert-banner alert-${type}`} role="alert">
      <div className="alert-icon-wrap">
        {getIcon()}
      </div>
      <div className="alert-content">
        {title && <strong className="alert-title">{title}</strong>}
        <p className="alert-message">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="alert-close-btn"
          aria-label="Kapat"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
