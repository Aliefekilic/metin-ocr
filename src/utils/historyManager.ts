import type { ScanHistoryItem } from '../types';

const STORAGE_KEY = 'metin_scan_history_v1';
const MAX_HISTORY_ITEMS = 8;

export function getScanHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn('Geçmiş okunamadı:', err);
    return [];
  }
}

export function saveScanHistory(item: {
  fileName: string;
  text: string;
  charCount: number;
  wordCount: number;
  confidence: number | null;
  language: string;
}): ScanHistoryItem[] {
  if (!item.text.trim()) return getScanHistory();

  try {
    const current = getScanHistory();
    const newItem: ScanHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fileName: item.fileName || 'Adsız Belge',
      text: item.text,
      timestamp: Date.now(),
      charCount: item.charCount,
      wordCount: item.wordCount,
      confidence: item.confidence,
    };

    // Filter out duplicates with identical text
    const filtered = current.filter((h) => h.text.trim() !== item.text.trim());
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Geçmiş kaydedilemedi:', err);
    return getScanHistory();
  }
}

export function deleteScanHistoryItem(id: string): ScanHistoryItem[] {
  try {
    const current = getScanHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Geçmiş öğesi silinemedi:', err);
    return getScanHistory();
  }
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Geçmiş temizlenemedi:', err);
  }
}
