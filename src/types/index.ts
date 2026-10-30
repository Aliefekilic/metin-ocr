export type LanguageCode = 'tur+eng' | 'tur' | 'eng';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
  description: string;
}

export interface UploadedImage {
  file: File;
  name: string;
  sizeBytes: number;
  sizeFormatted: string;
  previewUrl: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface OcrProgressState {
  status: string;
  rawStatus: string;
  progress: number; // 0 to 100
}

export interface OcrResultData {
  text: string;
  confidence: number | null;
  charCount: number;
  wordCount: number;
  lineCount: number;
  processedAt: Date;
  processingTimeMs: number;
  languageUsed: LanguageCode;
}

export interface StatusToast {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}
