import React from 'react';
import type { OcrProgressState } from '../types';
import { Loader2, Cpu } from 'lucide-react';

interface ProgressBarProps {
  progressState: OcrProgressState;
  elapsedSeconds?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressState,
  elapsedSeconds = 0
}) => {
  const { status, progress } = progressState;

  return (
    <div className="ocr-progress-card" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-top-row">
        <div className="progress-status-block">
          <Loader2 size={18} className="spinner-icon text-cyan" />
          <span className="progress-status-text">{status}</span>
        </div>
        <div className="progress-meta-block">
          {elapsedSeconds > 0 && (
            <span className="elapsed-badge">{elapsedSeconds}s</span>
          )}
          <span className="progress-percentage-badge">%{progress}</span>
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${Math.max(5, progress)}%` }}
        >
          <div className="progress-shimmer"></div>
        </div>
      </div>

      <div className="progress-subnote">
        <Cpu size={14} className="subnote-icon" />
        <span>İşlem tarayıcınızın WebAssembly ve Tesseract.js motoruyla yerel olarak yürütülüyor.</span>
      </div>
    </div>
  );
};
