#!/usr/bin/env bash
# ==============================================================================
#  SpectreWire (SWP/v2.4) Enterprise Tunnel & Web Panel - Linux Server Installer
# ==============================================================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
cat << 'BANNER_EOF'
   ███████╗██████╗ ███████╗ ██████╗████████╗██████╗ ███████╗
   ██╔════╝██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔══██╗██╔════╝
   ███████╗██████╔╝█████╗  ██║        ██║   ██████╔╝█████╗  
   ╚════██║██╔═══╝ ██╔══╝  ██║        ██║   ██╔══██╗██╔══╝  
   ███████║██║     ███████╗╚██████╗   ██║   ██║  ██║███████╗
   ╚══════╝╚═╝     ╚══════╝ ╚═════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
        SPECTREWIRE PROTOCOL v2.4 - GITHUB & LINUX VPS DEPLOYMENT
BANNER_EOF
echo -e "${NC}"

if [ "$(id -u)" != "0" ]; then
   echo -e "${RED}[!] این اسکریپت باید با دسترسی روت اجرا شود (لطفاً از sudo bash استفاده کنید)${NC}" 1>&2
   exit 1
fi

SWP_PORT="${PORT:-8443}"
SWP_OBFS="${OBFS:-TLS_1_3_CAMOUFLAGE}"
SWP_PASSWORD="${PASSWORD:-admin123}"
SWP_PSK="${PSK:-swp_sec_99a8b1c4e7f24095a123d4e8}"
ENABLE_BBR="${BBR:-true}"
INSTALL_DIR="/opt/spectrewire"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${YELLOW}[1/6] بروزرسانی پکیج‌های لینوکس و نصب ابزارهای پایه...${NC}"
if [ -f /etc/debian_version ]; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y >/dev/null 2>&1
    apt-get install -y curl wget tar ufw git procps python3 build-essential >/dev/null 2>&1
elif [ -f /etc/redhat-release ]; then
    yum install -y curl wget tar git procps python3 gcc-c++ make >/dev/null 2>&1
fi
echo -e "${GREEN}[+] ابزارهای پایه نصب شدند.${NC}"

if [ "$ENABLE_BBR" = "true" ]; then
    echo -e "${YELLOW}[2/6] فعال‌سازی شتاب‌دهنده TCP BBR در کرنل لینوکس...${NC}"
    modprobe tcp_bbr 2>/dev/null || true
    cat << 'SYSCTL_EOF' > /etc/sysctl.d/99-spectrewire.conf
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
net.ipv4.ip_forward = 1
net.ipv4.tcp_fastopen = 3
net.core.rmem_max = 67108864
net.core.wmem_max = 67108864
fs.file-max = 1000000
SYSCTL_EOF
    sysctl --system >/dev/null 2>&1 || true
    echo -e "${GREEN}[+] الگوریتم TCP BBR فعال شد.${NC}"
fi

echo -e "${YELLOW}[3/6] بررسی محیط اجرایی Node.js 20 LTS...${NC}"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d'.' -f1 | tr -d 'v')" -lt 18 ]; then
    echo -e "${CYAN}[*] در حال نصب خودکار Node.js 20 LTS...${NC}"
    if [ -f /etc/debian_version ]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null 2>&1
        apt-get install -y nodejs >/dev/null 2>&1
    elif [ -f /etc/redhat-release ]; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | bash - >/dev/null 2>&1
        yum install -y nodejs >/dev/null 2>&1
    fi
fi
NODE_PATH=$(command -v node)
echo -e "${GREEN}[+] Node.js ($($NODE_PATH -v)) آماده است.${NC}"

echo -e "${YELLOW}[4/6] استقرار فایل‌های پروژه در ${INSTALL_DIR} ...${NC}"
mkdir -p "$INSTALL_DIR"

if [ -f "$SCRIPT_DIR/package.json" ]; then
    echo -e "${CYAN}[*] تشخیص فایل‌های محلی مخزن گیت‌هاب: استقرار پروژه...${NC}"
    if [ "$SCRIPT_DIR" != "$INSTALL_DIR" ]; then
        cp -a "$SCRIPT_DIR/." "$INSTALL_DIR/"
    fi
    cd "$INSTALL_DIR"
    echo -e "${CYAN}[*] نصب پکیج‌های وابستگی با npm...${NC}"
    npm install --no-audit
    echo -e "${CYAN}[*] کامپایل و ساخت بیلد نهایی پروژه...${NC}"
    npm run build
else
    echo -e "${CYAN}[*] دانلود سورس پروژه از مخزن گیت‌هاب...${NC}"
    DEFAULT_REPO="https://github.com/nhoseinm2/spectrewire.git"
    read -t 15 -p "آدرس مخزن گیت‌هاب شما [$DEFAULT_REPO]: " INPUT_REPO || true
    REPO_URL="${INPUT_REPO:-$DEFAULT_REPO}"
    
    rm -rf "$INSTALL_DIR"
    if ! git clone "$REPO_URL" "$INSTALL_DIR"; then
        echo -e "${RED}[!] خطا در دریافت مخزن گیت‌هاب. لطفاً ابتدا پروژه را کلون کنید:${NC}"
        echo -e "${BOLD}git clone $REPO_URL && cd spectrewire && sudo ./install.sh${NC}"
        exit 1
    fi
    cd "$INSTALL_DIR"
    npm install --no-audit
    npm run build
fi

cat << CONFIG_EOF > "$INSTALL_DIR/config.json"
{
  "port": $SWP_PORT,
  "obfuscationMode": "$SWP_OBFS",
  "psk": "$SWP_PSK",
  "adminPassword": "$SWP_PASSWORD",
  "passwordProtected": true
}
CONFIG_EOF

echo -e "${YELLOW}[5/6] پیکربندی سرویس دائمی Systemd لینوکس...${NC}"

# تشخیص مسیر فایل اجرایی سرور
SERVER_FILE="$INSTALL_DIR/dist/server.js"
if [ ! -f "$SERVER_FILE" ] && [ -f "$INSTALL_DIR/server.js" ]; then
    SERVER_FILE="$INSTALL_DIR/server.js"
fi

cat << SYSTEMD_EOF > /etc/systemd/system/spectrewire.service
[Unit]
Description=SpectreWire Proprietary Tunnel Engine & Web Management Panel
After=network.target network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=$INSTALL_DIR
Environment=NODE_ENV=production
Environment=PORT=$SWP_PORT
ExecStart=$NODE_PATH $SERVER_FILE
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
SYSTEMD_EOF

if command -v ufw >/dev/null 2>&1; then
    ufw allow $SWP_PORT/tcp >/dev/null 2>&1 || true
fi

systemctl daemon-reload
systemctl enable spectrewire.service >/dev/null 2>&1 || true
systemctl restart spectrewire.service

echo -e "${YELLOW}[6/6] ایجاد ابزار مدیریت ترمینال: spectrewire ...${NC}"
cat << 'CLI_EOF' > /usr/local/bin/spectrewire
#!/usr/bin/env bash
# SpectreWire Management CLI
case "$1" in
  status)
    systemctl status spectrewire.service
    ;;
  restart)
    systemctl restart spectrewire.service
    echo "[+] سرویس SpectreWire ریستارت شد."
    ;;
  stop)
    systemctl stop spectrewire.service
    echo "[!] سرویس SpectreWire متوقف شد."
    ;;
  start)
    systemctl start spectrewire.service
    echo "[+] سرویس SpectreWire راه‌اندازی شد."
    ;;
  logs|log)
    journalctl -u spectrewire.service -f
    ;;
  password)
    if [ -z "$2" ]; then
      echo "نحوه استفاده: spectrewire password <NEW_PASSWORD>"
      exit 1
    fi
    python3 -c "import json; p='/opt/spectrewire/config.json'; d=json.load(open(p)); d['adminPassword']='$2'; json.dump(d, open(p,'w'), indent=2)"
    systemctl restart spectrewire.service
    echo "[+] رمز عبور با موفقیت به $2 تغییر یافت."
    ;;
  *)
    echo "=========================================================="
    echo "       SpectreWire (SWP/v2.4) مدیریت سرور تونل"
    echo "=========================================================="
    echo "1) بررسی وضعیت سرویس (Status)"
    echo "2) ریستارت سرویس تونل (Restart)"
    echo "3) مشاهده لاگ‌های زنده ترافیک و پکت‌ها (Live Logs)"
    echo "4) تغییر رمز عبور پنل وب (Change Password)"
    echo "5) تغییر پورت سرور (Change Port)"
    echo "6) خروج"
    echo "=========================================================="
    read -p "لطفاً یک شماره انتخاب کنید [1-6]: " choice
    case "$choice" in
      1) systemctl status spectrewire.service ;;
      2) systemctl restart spectrewire.service && echo "[+] سرویس ریستارت شد." ;;
      3) journalctl -u spectrewire.service -f ;;
      4)
        read -p "رمز عبور جدید پنل را وارد کنید: " np
        python3 -c "import json; p='/opt/spectrewire/config.json'; d=json.load(open(p)); d['adminPassword']='\$np'; json.dump(d, open(p,'w'), indent=2)"
        systemctl restart spectrewire.service
        echo "[+] رمز عبور جدید ذخیره شد."
        ;;
      5)
        read -p "پورت جدید را وارد کنید: " nport
        python3 -c "import json; p='/opt/spectrewire/config.json'; d=json.load(open(p)); d['port']=int('\$nport'); json.dump(d, open(p,'w'), indent=2)"
        sed -i "s/Environment=PORT=.*/Environment=PORT=\$nport/" /etc/systemd/system/spectrewire.service
        if command -v ufw >/dev/null 2>&1; then ufw allow \$nport/tcp >/dev/null 2>&1; fi
        systemctl daemon-reload && systemctl restart spectrewire.service
        echo "[+] پورت سرور به \$nport تغییر یافت."
        ;;
      6) exit 0 ;;
      *) echo "گزینه نامعتبر" ;;
    esac
    ;;
esac
CLI_EOF
chmod +x /usr/local/bin/spectrewire

SERVER_IP=$(curl -s -4 ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo -e "${GREEN}${BOLD}======================================================================${NC}"
echo -e "${GREEN}${BOLD}   نصب سرور و پنل مدیریت تونل SPECTREWIRE با موفقیت به پایان رسید!    ${NC}"
echo -e "${GREEN}${BOLD}======================================================================${NC}"
echo -e "${CYAN}آدرس پنل مدیریت تحت وب: ${BOLD}http://${SERVER_IP}:${SWP_PORT}${NC}"
echo -e "${CYAN}نام کاربری پنل:          ${BOLD}admin${NC}"
echo -e "${CYAN}رمز عبور اولیه:           ${BOLD}${SWP_PASSWORD}${NC}"
echo -e "${CYAN}پروتکل اختصاصی فعال:      ${BOLD}SWP/v2.4 (${SWP_OBFS})${NC}"
echo -e "${CYAN}پورت تونل و وب:          ${BOLD}${SWP_PORT}${NC}"
echo ""
echo -e "${YELLOW}>> برای مدیریت سرور در هر زمان، کافیست در خط فرمان سرور تایپ کنید: spectrewire${NC}"
echo -e "${YELLOW}>> از داخل پنل وب نیز در بخش 'رمز پنل' می‌توانید رمز عبور را به دلخواه تغییر دهید.${NC}"
echo -e "${GREEN}======================================================================${NC}"
