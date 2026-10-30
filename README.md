# DeskPilot — Görselden Metin Çıkarma (OCR) Web Uygulaması

<p align="center">
  <img src="./public/favicon.svg" width="64" height="64" alt="DeskPilot Logo" />
  <br>
  <strong>Tarayıcıda Çalışan, Gizlilik Odaklı ve Türkçe Destekli Modern OCR Aracı</strong>
  <br>
  <em>React + TypeScript + Vite + Tesseract.js</em>
</p>

---

## 📌 Proje Hakkında

**DeskPilot**, PNG, JPG/JPEG ve WEBP formatındaki görsellerdeki basılı veya dijital yazıları tarayıcı üzerinde yerel olarak analiz edip düzenlenebilir dijital metne dönüştüren açık kaynaklı bir web uygulamasıdır.

Kullanıcılar görselleri sürükleyip bırakabilir, panodan (Ctrl+V) yapıştırabilir veya dosya seçiciyle yükleyebilir. İşlem tamamlandığında metin doğrudan düzenlenebilir, tek tıkla panoya kopyalanabilir veya `.txt` dosyası olarak indirilebilir.

### Hedef Kullanıcı Kitlesi
* **Öğrenciler:** Ders notlarını, slaytları ve kitap sayfalarını dijital ortama aktarmak isteyenler.
* **Ofis ve Ekran Kullanıcıları:** Ekran görüntülerindeki (screenshot) hata mesajlarını, kod parçalarını veya yazıları kopyalamak isteyenler.
* **Küçük İşletmeler:** Basılı fatura, fiş veya evraklardan metin çıkarması gereken profesyoneller.

---

## 🚀 Öne Çıkan Özellikler (v1.0)

- **Sürükle & Bırak ve Panodan Yapıştırma:** 
  - Görseli sürükleyip bırakma desteği
  - Dosya gezgini ile görsel seçimi
  - Pano üzerinden doğrudan yapıştırma (`Ctrl + V`) desteği
- **Çoklu Format & Boyut Doğrulama:**
  - PNG, JPG/JPEG ve WEBP format desteği
  - Maksimum 15 MB dosya boyutu kontrolü ve kullanıcı dostu hata bildirimleri
- **Akıllı Dil Seçimi:**
  - 🇹🇷 **Türkçe (tur):** Özel Türkçe karakterler (`ç, ğ, ı, İ, ö, ş, ü`) için optimize edilmiştir.
  - 🇬🇧 **İngilizce (eng):** Kod blokları, teknik dokümanlar ve global belgeler için.
  - 🇹🇷+🇬🇧 **Türkçe + İngilizce (tur+eng):** Hibrit ve çok dilli belgeler için en geniş kapsama (Varsayılan).
- **Yüklenen Görsel Önizleme & Bellek Yönetimi:**
  - Görselin anlık önizlemesi, dosya boyutu, çözünürlük bilgileri
  - Bellek sızıntılarını önlemek için otomatik `URL.revokeObjectURL` temizliği
- **Canlı OCR İlerleme Durumu:**
  - %0 - %100 canlı ilerleme çubuğu ve akıcı ışıldama animasyonu
  - Türkçe aşama bildirimleri (*Model indiriliyor*, *OCR motoru başlatılıyor*, *Metinler taranıyor*)
  - OCR işlemi sürerken yinelenen istekleri engelleme
- **Gelişmiş Düzenleme Alanı:**
  - Anlık karakter, kelime ve satır sayısı hesaplayıcı
  - Tesseract güven skoru (Confidence %) ve işlem süresi göstergesi
  - Yazı boyutu büyütme/küçültme kontrolleri (`A-` / `A+`)
  - Boş veya okunamayan görseller için açıklayıcı geri bildirim
- **Görsel Ön İşleme & İyileştirme Araçları:**
  - 🔄 **90° Sağa Döndürme:** Yan veya ters çekilmiş fotoğrafları düzelterek tanıma oranını maksimize eder.
  - 🌓 **Siyah-Beyaz / Gri Tonlama:** Arka plan gölgelerini ve kağıt gürültüsünü temizler.
  - ⚡ **Yüksek Kontrast:** Soluk, fotokopi veya termal fişlerdeki silik yazıları belirginleştirir.
  - 🔄 **Negatif / Ters Çevir:** Koyu tema ekran görüntüleri veya ters zeminler için.
- **Kamera ile Belge Tarama:**
  - Cihaz kamerasını (Webcam veya mobil arka kamera) açarak canlı önizleme ve kılavuz çerçeve ile doğrudan evrak fotoğrafı çekip tarama.
- **Bul ve Değiştir (Find & Replace):**
  - OCR sonrasında metindeki harf veya kelime hatalarını topluca bulup tek tıkla düzeltme.
- **Zengin Dışa Aktarma Seçenekleri:**
  - **Panoya Kopyala:** Animasyonlu kopyalandı onayı ile
  - **TXT İndir:** Düz metin dosyası
  - **Markdown (.md) İndir:** Başlık, kaynak ve tarih meta verileriyle
  - **JSON İndir:** Karakter/kelime sayısı, güven skoru ve süre meta verileriyle
- **Tek Tıkla Demo Testi:**
  - Harici görsel aramaya gerek kalmadan uygulama içi Canvas ile üretilen Türkçe örnek notu tek tıkla yükleyip test etme imkânı.

---

## 🔒 Gizlilik, Güvenlik ve Mimari

1. **%100 İstemci Taraflı (Client-side):**
   - Görselleriniz asla uzak sunuculara yüklenmez veya saklanmaz.
   - Tüm OCR analizi cihazınızın kendi işlemcisi üzerinde, tarayıcınızın WebAssembly katmanında çalışır.
2. **Ağ Kullanımı Bilgilendirmesi:**
   - DeskPilot, Tesseract.js açık kaynak OCR motorunu kullanır.
   - İlk kullanımda Tesseract çekirdeği ve seçilen dil paketleri (~15-20 MB) Tesseract CDN'inden tarayıcı önbelleğine indirilir. Sonraki kullanımlarda önbellekten anında çalışır.
3. **Doğruluk Bildirimi:**
   - OCR doğruluğu görsel kalitesi, çözünürlük ve aydınlatmaya bağlıdır. Kritik belgelerdeki metinlerin kontrol edilmesi önerilir.

---

## 🛠️ Teknoloji Yığını

| Teknoloji | Kullanım Amacı |
| :--- | :--- |
| **React 19** | Bileşen tabanlı modern arayüz ve durum yönetimi |
| **TypeScript** | Statik tip güvenliği, hatasız kod yapısı ve veri modelleri |
| **Vite** | Yüksek performanslı derleme ve hızlı geliştirme sunucusu |
| **Tesseract.js** | Tarayıcıda yerel OCR / metin tanıma motoru |
| **Lucide React** | Modern ve tutarlı SVG ikon kütüphanesi |
| **Vanilla CSS** | Koyu tema (Dark theme), cam efekti (Glassmorphism), özel kaydırma çubukları ve mikro-animasyonlar |

---

## 💻 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları takip edin:

### 1. Depoyu Klonlayın veya Klasörü Açın
```bash
git clone https://github.com/kullaniciadi/deskpilot.git
cd deskpilot
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Uygulama tarayıcınızda açılacaktır: [http://localhost:5173](http://localhost:5173)

### 4. Üretim Derlemesini Alın (Production Build)
```bash
npm run build
npm run preview
```

---

## 📋 Test Planı ve Doğrulama

| Test Senaryosu | Beklenen Sonuç | Durum |
| :--- | :--- | :---: |
| **Net Türkçe basılı metin** | Metin ve Türkçe karakterler (`ç, ğ, ı, İ, ö, ş, ü`) doğru tanınır. | ✅ Başarılı |
| **İngilizce metin** | İngilizce karakterler ve teknik terimler doğru tanınır. | ✅ Başarılı |
| **Karışık dil (TR + EN)** | İki dilli modelle her iki dil de başarıyla ayrıştırılır. | ✅ Başarılı |
| **Yanlış dosya türü (.exe, .pdf vb.)** | OCR başlamadan önce açıklayıcı hata uyarısı verilir. | ✅ Başarılı |
| **15 MB üzeri büyük dosya** | Dosya boyutu sınırı bildirilerek reddedilir. | ✅ Başarılı |
| **Bulanık veya boş görsel** | Uygulama çökmez, okunabilir metin bulunamadı uyarısı gösterilir. | ✅ Başarılı |
| **Çoklu tıklama / Yinelenen işlem** | OCR sürerken butonlar kilitlenir, yinelenen işlem engellenir. | ✅ Başarılı |
| **Kopyalama & TXT indirme** | Panoya kopyalanır ve formatlı `.txt` dosyası indirilir. | ✅ Başarılı |
| **Mobil ve Masaüstü uyumu** | Responsive tasarım tüm ekran boyutlarında kusursuz çalışır. | ✅ Başarılı |

---

## 🗺️ Sürüm Yol Haritası (Roadmap)

- [x] **v1.0 (Mevcut):** Tek görsel OCR, Türkçe/İngilizce dil seçimi, düzenlenebilir alan, panoya kopyalama, TXT indirme, önizleme ve hata yönetimi.
- [ ] **v1.1:** Çok sayfalı PDF desteği ve sayfa bazlı metin çıkarma.
- [ ] **v1.2:** Birden fazla görseli sırayla kuyrukta işleme.
- [ ] **v1.3:** Aranabilir PDF ve DOCX olarak dışa aktarma.
- [ ] **v2.0:** İsteğe bağlı AI destekli imla düzeltme, özetleme ve tablo algılama.

---

## ⚠️ Bilinen Sınırlamalar
- Aşırı eğik, düşük çözünürlüklü veya düşük kontrastlı görsellerde tanıma başarımı düşebilir.
- El yazısı (Handwriting) desteği basılı metinlere göre daha düşüktür; en iyi sonuçlar bilgisayar yazı tiplerinde ve net basılı evraklarda elde edilir.
- Karmaşık hücre yapısına sahip tablolar düz metin olarak çıkarılır.

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak geliştirilmiştir.
Tesseract.js ve dil veri modelleri Apache 2.0 lisansına tabidir.
