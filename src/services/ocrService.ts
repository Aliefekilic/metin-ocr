import Tesseract from 'tesseract.js';
import type { LanguageCode, OcrProgressState, OcrResultData } from '../types';
import { calculateTextStats, translateOcrStatus } from '../utils/formatters';

/**
 * Runs OCR processing on an image file or object URL using Tesseract.js
 */
export async function processImageOcr(
  imageSource: string | File,
  language: LanguageCode,
  onProgress?: (progress: OcrProgressState) => void
): Promise<OcrResultData> {
  const startTime = performance.now();

  // Initial progress notification
  if (onProgress) {
    onProgress({
      rawStatus: 'initializing',
      status: 'OCR motoru başlatılıyor...',
      progress: 5
    });
  }

  try {
    const result = await Tesseract.recognize(imageSource, language, {
      logger: (m) => {
        if (onProgress) {
          const rawStatus = m.status || '';
          const rawProgress = typeof m.progress === 'number' ? m.progress : 0;
          const percentage = Math.min(100, Math.max(0, Math.round(rawProgress * 100)));

          onProgress({
            rawStatus,
            status: translateOcrStatus(rawStatus, language),
            progress: percentage
          });
        }
      }
    });

    const elapsed = Math.round(performance.now() - startTime);
    const extractedText = result.data?.text ?? '';
    const confidence = typeof result.data?.confidence === 'number'
      ? Math.round(result.data.confidence)
      : null;

    const stats = calculateTextStats(extractedText);

    return {
      text: extractedText,
      confidence,
      charCount: stats.charCount,
      wordCount: stats.wordCount,
      lineCount: stats.lineCount,
      processedAt: new Date(),
      processingTimeMs: elapsed,
      languageUsed: language
    };
  } catch (error) {
    console.error('OCR processing error:', error);
    throw error;
  }
}
