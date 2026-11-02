import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  FileCheck, 
  ChevronDown, 
  Lightbulb,
  HelpCircle,
  Keyboard
} from 'lucide-react';

export const FeaturesGuide: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: 'Görsellerim veya belgelerim herhangi bir sunucuya yükleniyor mu?',
      a: 'Kesinlikle hayır. Tüm metin tanıma (OCR) işlemi doğrudan bilgisayarınızın veya telefonunuzun işlem gücü kullanılarak, tarayıcınızın içindeki WebAssembly motoru ile yerel olarak gerçekleştirilir. Verileriniz hiçbir sunucuya iletilmez.',
    },
    {
      q: 'Türkçe karakterlerde (ç, ğ, ı, İ, ö, ş, ü) doğruluk nasıl sağlanıyor?',
      a: 'Uygulama, Türkçe dil morfolojisi ve özel harfleri için özel eğitilmiş veri setlerini (traineddata) kullanır. Türkçe + İngilizce seçeneği ise hem Türkçe özel karakterleri hem de İngilizce teknik terimleri kusursuz şekilde yakalar.',
    },
    {
      q: 'En iyi tarama sonucu almak için nelere dikkat etmeliyim?',
      a: 'Görselin gölgesiz ve iyi aydınlatılmış olması, yazının düz açıyla çekilmesi ve bulanık olmaması önemlidir. Yan duran fotoğrafları sol paneldeki "Döndür" aracıyla, soluk termal fişleri ise "Yüksek Kontrast" veya "Gri Ton" araçlarıyla iyileştirebilirsiniz.',
    },
    {
      q: 'El yazısı metinleri okuyabilir mi?',
      a: 'Basılı evrak, kitap, fatura, makale ve ekran görüntülerinde %95+ doğruluk elde edilir. Okunaklı ve temiz el yazıları da taranabilir; ancak karmaşık elyazılarında kontrastı artırmanız önerilir.',
    },
    {
      q: 'Hangi dosya türlerini ve boyutları kullanabilirim?',
      a: 'PNG, JPG, JPEG ve WEBP formatlarında, 15 MB boyutuna kadar tüm görselleri destekler. Dilerseniz ekran görüntüsü alıp doğrudan klavyeden Ctrl+V ile yapıştırabilirsiniz.',
    },
  ];

  return (
    <section className="features-guide-section">
      {/* 3 Pillar Cards */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-box bg-emerald-dim">
            <ShieldCheck className="text-emerald" size={22} />
          </div>
          <h4 className="feature-title">%100 İstemci Taraflı & Gizli</h4>
          <p className="feature-text">
            Belgeleriniz asla harici sunuculara gitmez. OCR hesaplaması cihazınızın donanımında, tarayıcınızda tamamlanır.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box bg-indigo-dim">
            <Cpu className="text-primary" size={22} />
          </div>
          <h4 className="feature-title">Yerel Tesseract Motoru</h4>
          <p className="feature-text">
            WebAssembly tabanlı açık kaynak OCR motoru. İlk kullanımda dil modeli yerel önbelleğe alınır, sonraki işlemler anında başlar.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box bg-cyan-dim">
            <FileCheck className="text-cyan" size={22} />
          </div>
          <h4 className="feature-title">Gelişmiş Türkçe Desteği</h4>
          <p className="feature-text">
            ç, ğ, ı, İ, ö, ş, ü gibi harfler ve Türkçe imla kuralları eksiksiz taranır. Fatura, fiş, ders notu ve ekran görüntüleri için optimize edilmiştir.
          </p>
        </div>
      </div>

      {/* Two columns: OCR Tips & Shortcuts */}
      <div className="info-dual-grid">
        {/* Column 1: Best Practices */}
        <div className="info-card">
          <div className="info-card-header">
            <Lightbulb size={18} className="text-amber" />
            <h4>Daha İyi Sonuçlar İçin İpuçları</h4>
          </div>
          <ul className="tips-list">
            <li>
              <strong>Düz Açı:</strong> Belgeyi çerçeveye paralel tutun. Yan çekilmiş fotoğraflarda <em>Döndür</em> butonunu kullanın.
            </li>
            <li>
              <strong>Işık & Gölge:</strong> Üzerine parmak veya telefon gölgesi düşen alanlarda harf atlamaları yaşanabilir; homojen aydınlatma tercih edin.
            </li>
            <li>
              <strong>Fiş ve Soluk Yazılar:</strong> Termal market fişleri veya soluk fotokopiler için <em>İyileştir &gt; Yüksek Kontrast</em> filtresini aktifleştirin.
            </li>
            <li>
              <strong>Metin Temizliği:</strong> OCR sonrasında kırık satırları tek hamlede düzeltmek için sağ paneldeki <em>Satırları Birleştir</em> aracını kullanın.
            </li>
          </ul>
        </div>

        {/* Column 2: Shortcuts */}
        <div className="info-card">
          <div className="info-card-header">
            <Keyboard size={18} className="text-primary" />
            <h4>Hızlı Klavye Kısayolları</h4>
          </div>
          <div className="shortcut-cards-wrap">
            <div className="shortcut-mini-row">
              <span className="sc-label">Panodan Anında Yapıştır</span>
              <div className="sc-keys">
                <kbd>Ctrl</kbd> + <kbd>V</kbd>
              </div>
            </div>
            <div className="shortcut-mini-row">
              <span className="sc-label">Taramayı (OCR) Başlat</span>
              <div className="sc-keys">
                <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
              </div>
            </div>
            <div className="shortcut-mini-row">
              <span className="sc-label">Bul & Değiştir Çubuğu</span>
              <div className="sc-keys">
                <kbd>Ctrl</kbd> + <kbd>F</kbd>
              </div>
            </div>
            <div className="shortcut-mini-row">
              <span className="sc-label">Açık Pencereleri Kapat</span>
              <div className="sc-keys">
                <kbd>Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="faq-container-box">
        <div className="faq-header-row">
          <div className="faq-title-wrap">
            <HelpCircle size={18} className="text-primary" />
            <h4>Sıkça Sorulan Sorular</h4>
          </div>
          <span className="faq-subtitle">Metin OCR hakkında merak edilenler</span>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
