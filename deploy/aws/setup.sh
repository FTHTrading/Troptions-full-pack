#!/bin/bash
# TROPTIONS AWS Deployment Script
# Run on EC2 instance: bash setup.sh

set -e

echo "========================================"
echo "TROPTIONS AWS DEPLOYMENT"
echo "========================================"
echo ""

# 1. Update system
echo "[1/10] Updating system..."
sudo apt update -y
sudo apt upgrade -y

# 2. Install Node.js 20
echo "[2/10] Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v

# 3. Install Python 3
echo "[3/10] Installing Python..."
sudo apt install -y python3 python3-pip python3-venv

# 4. Install PM2
echo "[4/10] Installing PM2..."
sudo npm install -g pm2
pm2 -v

# 5. Install Git
echo "[5/10] Installing Git..."
sudo apt install -y git

# 6. Clone repository
echo "[6/10] Cloning repository..."
if [ ! -d "troptions-system" ]; then
 git clone https://github.com/FTHTrading/Troptions-full-pack.git troptions-system
fi
cd troptions-system

# 7. Install dependencies
echo "[7/10] Installing dependencies..."
npm install

# Install Python deps for compliance engine
python3 -m venv venv
source venv/bin/activate
pip install -r fiat-rails/compliance-engine/requirements.txt
deactivate

# 8. Configure environment
echo "[8/10] Configuring environment..."
if [ ! -f ".env" ]; then
 cp config/multi-gateway.env.template .env
 echo "⚠️  Please edit .env with your credentials"
fi

# 9. Start services
echo "[9/10] Starting services..."
pm2 start fiat-rails/ecosystem.config.js
pm2 save

# 10. Setup auto-restart
echo "[10/10] Setting up auto-restart..."
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Create logs directory
mkdir -p logs

echo ""
echo "========================================"
echo "DEPLOYMENT COMPLETE!"
echo "========================================"
echo ""
echo "Services Status:"
pm2 status
echo ""
echo "Next steps:"
echo "  1. Edit .env with your credentials"
echo "  2. Run: ./scripts/activate-revenue.sh"
echo "  3. Open Telegram and type /revenue"
echo ""
echo "PM2 Dashboard: https://app.pm2.io"
