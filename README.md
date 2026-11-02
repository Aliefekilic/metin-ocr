# Metin — Görselden Metin Dönüştürücü (Yerel Web OCR)

<p align="center">
  <img src="./public/favicon.svg" width="60" height="60" alt="Metin Logo" />
  <br>
  <strong>Tarayıcıda %100 Yerel Çalışan, Gizlilik Odaklı ve Türkçe Destekli Modern OCR Aracı</strong>
  <br>
  <em>React 19 + TypeScript + Vite + Tesseract.js WebAssembly</em>
</p>

---

## 📌 Proje Hakkında

**Metin**, taranmış evraklar, makaleler, ders notları, faturalar veya ekran görüntülerindeki basılı ve dijital yazıları tarayıcınızın donanım ivmesiyle **hiçbir harici sunucuya göndermeden** doğrudan dijital metne dönüştüren açık kaynaklı bir web uygulamasıdır.

Kullanıcılar görselleri sürükleyip bırakabilir, panodan (`Ctrl + V`) anında yapıştırabilir, dosya seçebilir veya cihaz kamerasıyla çekebilir. Çıkarılan metin üzerinde kopuk satırları birleştirme, fazla boşlukları ayıklama, büyük/küçük harf dönüştürme gibi akıllı düzenlemeler yapılabilir; ardından tek tıkla panoya kopyalanabilir veya TXT, Markdown, JSON ya da yazıcı/PDF olarak dışa aktarılabilir.

---

## 🚀 Öne Çıkan Özellikler

### 1. Görünüm & Tema Desteği
- ☀️ **Açık (Beyaz) Tema (Varsayılan):** Yüksek kontrastlı, göz yormayan, modern ve minimalist beyaz tasarım.
- 🌙 **Karanlık Tema:** Gece çalışmaları için tek tıkla geçiş yapılabilir zarif koyu tema.
- 💾 **Tercih Hafızası:** Seçilen tema tercihi `localStorage` üzerinde hatırlanır.

### 2. Görsel Giriş Seçenekleri
- 🖱️ **Sürükle & Bırak:** Görseli doğrudan çalışma alanına bırakma.
- 📋 **Panodan Yapıştırma (`Ctrl + V`):** Herhangi bir ekrandan alınan ekran görüntüsünü anında yükleme.
- 📸 **Kamera ile Çekim:** Canlı kamera önizlemesi ve kılavuz çerçeve ile doğrudan evrak tarama.
- ⚡ **Örnek Belge:** Test etmek için tek tıkla üretilen Türkçe test evrakını yükleme.

### 3. Görsel İyileştirme (Ön İşleme)
- 🔍 **Yakınlaştırma & İnceleme:** Yüklenen evrakın küçük yazılarını kontrol etmek için %50 - %250 yakınlaştırma.
- 🔄 **90° Döndürme:** Yan veya ters çekilmiş fotoğrafları düzeltme.
- 🌓 **Gri Ton / Siyah-Beyaz:** Arka plan gölgelerini ve kağıt lekelerini temizleme.
- ⚡ **Yüksek Kontrast & Evrak/Fiş Modu:** Soluk market fişleri ve termal kağıtlardaki silik yazıları belirginleştirme.
- 🔄 **Negatif / Ters Çevir:** Siyah zemin üzerine beyaz yazılı ekran görüntüleri için.

### 4. Dil ve Karakter Desteği
- 🇹🇷 **Türkçe (tur):** `ç, ğ, ı, İ, ö, ş, ü` harfleri ve Türkçe imla yapısı için optimize.
- 🇬🇧 **İngilizce (eng):** Kod blokları ve global teknik dokümanlar.
- 🇹🇷+🇬🇧 **Türkçe + İngilizce (tur+eng):** Hibrit ve çift dilli belgeler için en geniş kapsama (Varsayılan).

### 5. Akıllı Metin Düzenleme & Temizleme
- ⚡ **Satırları Birleştir (Paragraf Yap):** OCR'ın satır sonlarında böldüğü cümleleri akıcı paragraflara dönüştürür.
- 🧹 **Fazla Boşlukları Temizle:** Çift boşlukları ve gereksiz satır aralıklarını ayıklar.
- 🔤 **Büyük/Küçük Harf Dönüştürücü:** TÜMÜ BÜYÜK, tümü küçük veya Baş Harfleri Büyük seçenekleri.
- 🔍 **Bul ve Değiştir (`Ctrl + F`):** OCR harf hatalarını topluca tespit edip düzeltme.
- 🔎 **Yazı Boyutu Ayarı:** Düzenleyici yazı boyutunu büyütme / küçültme (`12px` - `24px`).

### 6. Zengin Dışa Aktarma & Geçmiş
- 📋 **Panoya Kopyala:** Animasyonlu kopyalama bildirimi.
- 📄 **Düz Metin (TXT):** Sade `.txt` dosyası.
- 📝 **Markdown (MD):** Başlık ve kaynak meta verileriyle zengin `.md` çıktısı.
- 📊 **JSON Çıktısı:** Karakter sayısı, kelime sayısı, güven skoru ve süre meta verileriyle.
- 🖨️ **Yazdır / PDF:** `@media print` stil şablonuyla temiz sayfa düzeni.
- 🕒 **Yerel Son Taramalar (Geçmiş):** Son 8 tarama sadece tarayıcı hafızasında saklanır; geçmişten tek tıkla geri yüklenebilir.

---

## 🔒 Gizlilik Güvencesi

1. **%100 İstemci Taraflı (Client-side):**
   - Belgeleriniz ve çıkarılan metinler hiçbir harici sunucuya iletilmez, kaydedilmez veya analiz edilmez.
   - Tüm işlem cihazınızın işlemcisi ve tarayıcınızın WebAssembly katmanında yürütülür.
2. **Ağ Kullanımı:**
   - Açık kaynaklı Tesseract.js motoru ilk kullanımda gerekli dil modelini tarayıcı önbelleğine alır; sonraki kullanımlar çevrimdışı hızında çalışır.

---

## ⌨️ Klavye Kısayolları

| Kısayol | İşlev |
| :--- | :--- |
| `Ctrl + V` / `⌘ + V` | Panodan görsel yapıştır |
| `Ctrl + Enter` / `⌘ + Enter` | OCR taramasını başlat |
| `Ctrl + F` / `⌘ + F` | Bul & Değiştir çubuğunu aç |
| `Esc` | Açık modal pencerelerini kapat |

---

## 💻 Kurulum ve Çalıştırma

Projeyi yerel geliştirme ortamınızda çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim derlemesi (Production build)
npm run build
```

---

## 🛠️ Teknoloji Mimarisi

* **React 19** & **TypeScript**
* **Vite** Derleme Altyapısı
* **Tesseract.js** (WebAssembly OCR)
* **Lucide React** Modern SVG İkonları
* **Vanilla CSS Modern Design Tokens** (Aydınlık & Karanlık Mod)
