# ⚡ SpectreWire Protocol (SWP/v2.4)
### سامانه مدیریت تونل با پروتکل اختصاصی، استتار ضد DPI و پنل مدیریت ترافیک زنده
### Enterprise Proprietary Obfuscated Tunnel & Web Management Control Panel

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Protocol](https://img.shields.io/badge/Protocol-SWP%2Fv2.4-cyan.svg)](#پروتکل-اختصاصی-spectrewire-swpv24)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-green.svg)](https://nodejs.org)
[![Platform](https://img.shields.io/badge/Platform-Linux%20(Ubuntu%20%7C%20Debian%20%7C%20CentOS)-orange.svg)](#راهنمای-نصب-روی-سرور-لینوکس)

---

## 📖 فهرست مطالب / Table of Contents
- [ویژگی‌های کلیدی (Key Features)](#ویژگیهای-کلیدی)
- [روش ۱: نصب سریع تک‌خطی (1-Click Fast Install)](#روش-۱-نصب-سریع-تکخطی-پیشنهادی)
- [روش ۲: نصب از طریق گیت‌هاب (GitHub Clone & Build)](#روش-۲-نصب-از-طریق-گیت‌هاب-github)
- [روش ۳: اجرا با داکر (Docker & Docker Compose)](#روش-۳-اجرا-با-داکر-docker)
- [ورود به پنل و تنظیم رمز عبور (Authentication & Password)](#ورود-به-پنل-و-تنظیم-رمز-عبور)
- [ابزار مدیریت در خط فرمان لینوکس (spectrewire CLI)](#ابزار-مدیریت-در-خط-فرمان-لینوکس-spectrewire-cli)
- [هدایت و تست زنده ترافیک اینترنت (Live Traffic Routing)](#هدایت-و-تست-زنده-ترافیک-اینترنت)
- [مشخصات فنی پروتکل اختصاصی SWP](#مشخصات-فنی-پروتکل-اختصاصی-swp)
- [راه‌اندازی کلاینت سمت کاربر (Client Daemon)](#راهاندازی-کلاینت-سمت-کاربر)

---

## ✨ ویژگی‌های کلیدی

- **پروتکل اختصاصی SWP/v2.4**: فریم‌های باینری ۱۶ بایتی هدر با قابلیت مالتی‌پلکسینگ صدها نشست مجزا روی یک کانال واحد.
- **استتار پیشرفته ضد فیلترینگ (Anti-DPI)**:
  - **TLS 1.3 Camouflage**: شبیه‌سازی کامل SNI و هدرهای استاندارد ترافیک بانکی و کلادفلر.
  - **Dynamic Jitter Padding**: تزریق تصادفی ۳۲ تا ۱۲۸ بایت داده‌ی هرز پویا جهت برهم‌زدن تحلیل هیستوگرام طول بسته‌ها توسط هوش مصنوعی فایروال.
  - **Anti-Active Probe**: در صورت اسکن پورت توسط سامانه‌های فیلترینگ بدون کلید معتبر، صفحه خطای ساختگی سایت Decoy بازگردانده می‌شود.
- **عبور واقعی ترافیک اینترنت**: ارسال مستقیم درخواست‌های HTTP/HTTPS/SOCKS5 از طریق تونل و دریافت پاسخ به همراه ریزسنجی تاخیر (Latency) و کالبدشکافی هگزادسیمال بسته‌ها.
- **شتاب‌دهنده کرنل لینوکس (TCP BBR)**: فعال‌سازی خودکار الگوریتم BBR و FQ جهت غلبه بر Packet Loss شدید شبکه‌های محدودشده.
- **پنل مدیریت تحت وب دوزبانه (فارسی / انگلیسی)**: کنترل کامل سرورها، نودهای رله و پل داخلی، شنود بسته‌ها (Wire Inspector)، و صدور کلیدهای دسترسی.
- **سیستم احراز هویت امنیتی**: قابلیت تعریف و تغییر رمز عبور ورود به پنل به صورت گرافیکی از داخل وب یا از خط فرمان.

---

## 🚀 روش ۱: نصب سریع تک‌خطی (پیشنهادی)

برای استقرار خودکار روی سرور لینوکس (Ubuntu 20.04/22.04/24.04 یا Debian 11/12 یا CentOS/AlmaLinux)، کافیست از طریق SSH به سرور متصل شده و دستور زیر را اجرا کنید:

```bash
bash <(curl -fsSL https://ais-dev-tsl33obpunrakfgltwleu4-31993181694.europe-west1.run.app/install.sh)
```

> **نکته:** برای تغییر پورت یا رمز اولیه در هنگام نصب می‌توانید متغیرها را اضافه کنید:
> ```bash
> PORT=8443 PASSWORD=MySecretPass123 bash <(curl -fsSL https://ais-dev-tsl33obpunrakfgltwleu4-31993181694.europe-west1.run.app/install.sh)
> ```

---

## 🛠️ روش ۲: نصب از طریق گیت‌هاب (GitHub)

اگر می‌خواهید پروژه را مستقیماً از سورس گیت‌هاب دریافت و روی سرور اصلی کامپایل کنید:

### گام ۱: کلون کردن ریپازیتوری
```bash
git clone https://github.com/your-username/spectrewire.git
cd spectrewire
```

### گام ۲: اجرای اسکریپت نصب اختصاصی
```bash
sudo chmod +x install.sh
sudo ./install.sh
```

### گام ۳ (روش جایگزین): راه‌اندازی دستی بدون اسکریپت
اگر ترجیح می‌دهید به صورت دستی با Node.js پروژه را بالا بیاورید:
```bash
# ۱. نصب پیش‌نیازها
sudo apt-get update && sudo apt-get install -y curl nodejs npm

# ۲. نصب وابستگی‌های پکیج
npm install

# ۳. کامپایل و بیلد نسخه پروداکشن
npm run build

# ۴. اجرای سرور
PORT=8443 npm start
```

---

## 🐳 روش ۳: اجرا با داکر (Docker)

یک فایل `docker-compose.yml` ساده برای راه‌اندازی سریع در کانتینر ایزوله:

```yaml
version: '3.8'

services:
  spectrewire:
    image: node:20-alpine
    container_name: spectrewire-tunnel-server
    restart: unless-stopped
    ports:
      - "8443:8443"
    environment:
      - NODE_ENV=production
      - PORT=8443
    volumes:
      - ./config.json:/opt/spectrewire/config.json
    working_dir: /opt/spectrewire
    command: >
      sh -c "wget -qO- https://ais-dev-tsl33obpunrakfgltwleu4-31993181694.europe-west1.run.app/api/tunnel/release.tar.gz | tar -xz && node server.js"
```

اجرا با دستور:
```bash
docker compose up -d
```

---

## 🔐 ورود به پنل و تنظیم رمز عبور

1. در مرورگر آدرس سرور خود را وارد کنید:
   ```text
   http://YOUR_SERVER_IP:8443
   ```
2. **مشخصات پیش‌فرض اولیه:**
   - **نام کاربری:** `admin`
   - **رمز عبور اولیه:** `admin123`
3. **تغییر رمز عبور از داخل پنل:**
   - پس از ورود، در گوشه بالای صفحه روی دکمه **«رمز پنل»** (آیکون قفل 🔒) کلیک کنید.
   - رمز عبور جدید خود را وارد کرده و دکمه **«ثبت رمز عبور»** را بزنید.
   - از این پس برای هر بار ورود مجدد، این رمز لازم خواهد بود.

---

## 💻 ابزار مدیریت در خط فرمان لینوکس (`spectrewire` CLI)

پس از اجرای اسکریپت نصب، ابزار مدیریتی در مسیر `/usr/local/bin/spectrewire` نصب می‌شود. با تایپ دستور زیر در محیط SSH سرور:

```bash
spectrewire
```

منوی متنی زیر برای شما نمایش داده می‌شود:
```text
==========================================================
       SpectreWire (SWP/v2.4) مدیریت سرور تونل
==========================================================
1) بررسی وضعیت سرویس (Status)
2) ریستارت سرویس تونل (Restart)
3) مشاهده لاگ‌های زنده ترافیک و پکت‌ها (Live Logs)
4) تغییر رمز عبور پنل وب (Change Password)
5) تغییر پورت سرور (Change Port)
6) خروج
==========================================================
```

همچنین می‌توانید دستورات را به صورت مستقیم اجرا کنید:
```bash
spectrewire status                 # بررسی وضعیت کارکرد سرور
spectrewire restart                # ریستارت سریع هسته تونل
spectrewire logs                   # شنود و مشاهده لاگ زنده پکت‌ها
spectrewire password MyNewPass99   # تغییر فوری رمز پنل
```

---

## 🌐 هدایت و تست زنده ترافیک اینترنت

### ۱. از داخل پنل وب:
به تب **«تست عبور ترافیک»** بروید، آدرس سایت مورد نظر (مانند `https://cloudflare.com/cdn-cgi/trace` یا `https://api.ipify.org?format=json`) را وارد کرده و روی **«عبور دادن ترافیک از پروتکل اختصاصی»** کلیک کنید تا نتیجه زنده، تاخیر، و هدرهای باینری فریم را مشاهده فرمایید.

### ۲. از طریق cURL در خط فرمان:
سرور دارای اندپوینت پروکسی مستقیم است:
```bash
curl -s "http://YOUR_SERVER_IP:8443/api/tunnel/proxy?url=https://httpbin.org/ip"
```

---

## 🔬 مشخصات فنی پروتکل اختصاصی SWP

فریم باینری اختصاصی **SWP v2.4** در قالب ۱۶ بایت هدر شبکه منتقل می‌شود:

```text
+-----------------------+-----------------------+
|  0x53 0x57 0x50 (SWP) |   Version (0x02)      | (Bytes 0-3)
+-----------------------+-----------------------+
|  Flags Bitmask (8b)   |   Stream ID (32b)     | (Bytes 4-8)
+-----------------------+-----------------------+
|  Command Code (8b)    |   Payload Len (16b)   | (Bytes 9-11)
+-----------------------+-----------------------+
|  Padding Length (8b)  |   CRC32 Checksum (24b)| (Bytes 12-15)
+-----------------------+-----------------------+
|            Encrypted Payload Bytes            |
+-----------------------------------------------+
|       Dynamic Decoy Jitter Padding (0-255B)   |
+-----------------------------------------------+
```

---

## 📱 راه‌اندازی کلاینت سمت کاربر

در تب **«کلاینت و کلیدها»** پنل وب:
- اسکریپت آماده **Python 3** (بدون نیاز به نصب پکیج جانبی) قرار دارد که با اجرای آن، یک لوکال پروکسی SOCKS5 روی پورت `1080` و HTTP روی پورت `8080` در سیستم کاربر فعال می‌شود.
- لینک اتصال اختصاصی `swp://token@host:port` جهت اتصال مستقیم کلاینت‌های اندروید و دسکتاپ تولید می‌شود.

---

### 📄 لایسنس
توسعه‌داده‌شده تحت مجوز Apache 2.0.
