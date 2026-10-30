import type { LanguageCode } from '../types';

/**
 * Format bytes to human readable format (KB, MB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Byte';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bayt', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Maps raw Tesseract.js status messages to user-friendly Turkish descriptions
 */
export function translateOcrStatus(rawStatus: string, language: LanguageCode): string {
  const normalized = (rawStatus || '').toLowerCase();

  const langNames: Record<LanguageCode, string> = {
    'tur+eng': 'Türkçe + İngilizce',
    'tur': 'Türkçe',
    'eng': 'İngilizce'
  };

  if (normalized.includes('loading tesseract core')) {
    return 'OCR çekirdek motoru belleğe alınıyor...';
  }
  if (normalized.includes('initializing tesseract')) {
    return 'OCR motoru başlatılıyor...';
  }
  if (normalized.includes('initialized tesseract')) {
    return 'OCR motoru hazırlandı.';
  }
  if (normalized.includes('loading language traineddata') || normalized.includes('loading api')) {
    return `${langNames[language]} dil paketi indiriliyor/yükleniyor...`;
  }
  if (normalized.includes('loaded language traineddata')) {
    return 'Dil paketi başarıyla yüklendi.';
  }
  if (normalized.includes('initializing api')) {
    return 'Metin tanıma servisi yapılandırılıyor...';
  }
  if (normalized.includes('initialized api')) {
    return 'Model çalışmaya hazır.';
  }
  if (normalized.includes('recognizing text')) {
    return 'Görsel taranıyor ve metinler tanınıyor...';
  }

  return 'İşleniyor, lütfen bekleyin...';
}

/**
 * Calculates text statistics: character count, word count, line count
 */
export function calculateTextStats(text: string) {
  const trimmed = text.trim();
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s+/g, '').length;
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const lineCount = text ? text.split(/\r\n|\r|\n/).length : 0;

  return {
    charCount,
    charCountNoSpaces,
    wordCount,
    lineCount
  };
}

/**
 * Generates a high quality test image on an in-memory Canvas with Turkish characters.
 * Perfect for quick verification or testing without uploading external files.
 */
export function generateSampleImage(): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 750;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context oluşturulamadı');
      }

      // Background - clean white document look
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add a subtle border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 10;
      ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

      // Header Banner
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 34px Arial, sans-serif';
      ctx.fillText('DeskPilot OCR Test Belgesi', 50, 80);

      // Subtitle
      ctx.fillStyle = '#475569';
      ctx.font = '20px Arial, sans-serif';
      ctx.fillText('Türkçe Karakter ve Sayısal Metin Doğrulama', 50, 115);

      // Divider line
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, 135);
      ctx.lineTo(950, 135);
      ctx.stroke();

      // Sample Turkish text with special characters: ç, ğ, ı, İ, ö, ş, ü
      ctx.fillStyle = '#0f172a';
      ctx.font = '22px Arial, sans-serif';
      
      const lines = [
        'Toplantı Tarihi: 30 Ekim 2026',
        'Katılımcılar: Çağlar, Şule, İpek, Özgür ve Gökçe',
        '',
        'Gündem Maddeleri ve Notlar:',
        '1. Şirket içi dijitalleşme ve görselden metin çıkarma çalışmaları tamamlandı.',
        '2. Türkçe özel karakterleri: ç, ğ, ı, İ, ö, ş, ü başarıyla test edildi.',
        '3. Tarayıcı tabanlı OCR mimarisi yüksek veri gizliliği sağlamaktadır.',
        '4. Alınan ekran görüntüleri ve ders notları anında kopyalanabilir.',
        '',
        'Örnek Kod & Fatura Bilgisi: INV-2026-9843 | Toplam Tutar: 4.850,50 TL',
        'Not: Belgelerdeki net ve yüksek çözünürlüklü yazılar en doğru sonucu verir.'
      ];

      let yPos = 180;
      for (const line of lines) {
        ctx.fillText(line, 50, yPos);
        yPos += 36;
      }

      // Footer note
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 16px Arial, sans-serif';
      ctx.fillText('DeskPilot v1.0 • Tarayıcı içi metin tanıma motoru', 50, 690);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas bloba dönüştürülemedi'));
          return;
        }
        const file = new File([blob], 'ornek-turkce-not.png', { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}
