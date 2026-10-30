import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  FileCheck, 
  HelpCircle, 
  CheckCircle, 
  Layers, 
  Info 
} from 'lucide-react';

export const FeaturesGuide: React.FC = () => {
  return (
    <section className="features-guide-section">
      <div className="features-grid">
        {/* Card 1: Privacy */}
        <div className="feature-card">
          <div className="feature-icon-box bg-emerald-dim">
            <ShieldCheck className="text-emerald" size={24} />
          </div>
          <h4 className="feature-title">%100 Tarayıcıda & Gizli</h4>
          <p className="feature-text">
            Görselleriniz hiçbir sunucuya yüklenmez veya saklanmaz. Tüm OCR işlemi cihazınızın kendi işlem gücüyle tarayıcınızda gerçekleştirilir.
          </p>
        </div>

        {/* Card 2: Engine */}
        <div className="feature-card">
          <div className="feature-icon-box bg-indigo-dim">
            <Cpu className="text-indigo" size={24} />
          </div>
          <h4 className="feature-title">Tesseract.js OCR Motoru</h4>
          <p className="feature-text">
            WebAssembly ile çalışan gelişmiş OCR altyapısı. İlk kullanımda gerekli dil paketi önbelleğe alınır, sonraki taramalarda hızlanır.
          </p>
        </div>

        {/* Card 3: TR Char Support */}
        <div className="feature-card">
          <div className="feature-icon-box bg-cyan-dim">
            <FileCheck className="text-cyan" size={24} />
          </div>
          <h4 className="feature-title">Türkçe Karakter Desteği</h4>
          <p className="feature-text">
            ç, ğ, ı, İ, ö, ş, ü gibi Türkçe özel harfler tam uyumlulukla algılanır. Ders notları, makaleler ve faturalar kolayca dijitalleşir.
          </p>
        </div>
      </div>

      {/* Accordion or info box for guidance and roadmap */}
      <div className="guide-roadmap-box">
        <div className="guide-header">
          <div className="guide-title-row">
            <Layers size={20} className="text-indigo" />
            <h4 className="guide-title">DeskPilot Ürün Bilgisi ve Sürüm Planı</h4>
          </div>
          <span className="current-version-tag">Aktif: v1.0 Kararlı</span>
        </div>

        <div className="guide-content-grid">
          <div className="guide-col">
            <div className="guide-col-title">
              <CheckCircle size={16} className="text-emerald" />
              <span>v1.0 Özellikleri (Tamamlanan)</span>
            </div>
            <ul className="guide-list">
              <li>PNG, JPG, WEBP formatları ve 15 MB dosya sınırı denetimi</li>
              <li>Türkçe + İngilizce, Yalnızca Türkçe veya İngilizce dil seçimi</li>
              <li>Yüklenen görselin önizlemesi ve anlık boyut bilgileri</li>
              <li>Canlı ilerleme durumu (% göstergesi ve aşama açıklamaları)</li>
              <li>Düzenlenebilir sonuç alanı, panoya kopyalama ve .TXT indirme</li>
              <li>Görsel ve sonuç temizleme, bellek optimizasyonu (URL.revokeObjectURL)</li>
            </ul>
          </div>

          <div className="guide-col">
            <div className="guide-col-title">
              <Info size={16} className="text-cyan" />
              <span>Gelecek Sürümler (Yol Haritası)</span>
            </div>
            <ul className="guide-list">
              <li><strong>v1.1:</strong> PDF dosya desteği ve sayfa bazlı metin ayrıştırma</li>
              <li><strong>v1.2:</strong> Birden fazla görseli sırayla kuyrukta işleme</li>
              <li><strong>v1.3:</strong> Aranabilir PDF ve DOCX olarak dışa aktarma</li>
              <li><strong>v2.0:</strong> İsteğe bağlı AI ile imla düzeltme ve özetleme</li>
            </ul>
          </div>
        </div>

        <div className="disclaimer-callout">
          <HelpCircle size={16} className="disclaimer-icon" />
          <p>
            <strong>Önemli Hatırlatma:</strong> OCR sonuçları görselin netliğine, ışığına ve yazı tipine bağlı olarak değişiklik gösterebilir.
            Lütfen kritik resmi veya finansal evraklardaki verileri dışa aktarmadan önce kontrol ediniz.
          </p>
        </div>
      </div>
    </section>
  );
};
