# Deploying to the Lightsail Ubuntu server

Target server:
- Public IP: `52.77.234.193`
- User: `ubuntu`
- SSH key: `E:\AWS-Kiro\NUS-ISS-7-28Sep2026\SSH Key\LightsailDefaultKey-ap-southeast-1.pem`
- App port: `3000` (must be opened in the Lightsail firewall)

Run the PowerShell commands from your Windows machine, in the `whatsapp-sales` folder.
Run the "on the server" commands after you SSH in.

---

## Step 1 - Copy the app to the server

Copy the project **without** `node_modules`, `.env`, or the local `data/` store
(the server does its own clean install and seeds its own data).

From `E:\AWS-Kiro\NUS-ISS-7-28Sep2026\whatsapp-sales` in PowerShell:

```powershell
$key = "E:\AWS-Kiro\NUS-ISS-7-28Sep2026\SSH Key\LightsailDefaultKey-ap-southeast-1.pem"

# Create the target folder on the server
ssh -i "$key" ubuntu@52.77.234.193 "mkdir -p ~/whatsapp-sales"

# Copy source, package files, public pages, and deploy config (not node_modules/.env/data)
scp -i "$key" -r src public package.json package-lock.json ecosystem.config.js .env.production README.md ubuntu@52.77.234.193:~/whatsapp-sales/
```

> If `scp -r` on the folders is slow or errors on Windows, install `rsync` or
> zip the folder first (`Compress-Archive`) and `scp` the zip, then unzip on the server.

---

## Step 2 - Install Node.js on the server (first time only)

SSH in:

```powershell
ssh -i "E:\AWS-Kiro\NUS-ISS-7-28Sep2026\SSH Key\LightsailDefaultKey-ap-southeast-1.pem" ubuntu@52.77.234.193
```

Then, on the server, install Node.js 20 LTS and PM2:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v && npm -v
sudo npm install -g pm2
```

---

## Step 3 - Install dependencies and start the app (on the server)

```bash
cd ~/whatsapp-sales
cp .env.production .env          # create the server's .env
npm ci --omit=dev                # production install (no dev/test deps)
pm2 start ecosystem.config.js    # start under PM2
pm2 status                       # should show "whatsapp-sales" online
pm2 logs whatsapp-sales --lines 20   # check the startup banner, Ctrl+C to exit
```

Make it survive reboots:

```bash
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
# PM2 prints one `sudo env PATH=... pm2 startup ...` command - copy and run it.
```

---

## Step 4 - Open the firewall port in Lightsail

The app listens on port 3000, but Lightsail blocks it by default.

1. In the Lightsail console, open your instance -> **Networking** tab.
2. Under **IPv4 Firewall**, click **Add rule**.
3. Application: **Custom**, Protocol: **TCP**, Port: **3000**.
4. Save.

(Optional: restrict the source IP to your own address while testing.)

---

## Step 5 - Verify it's reachable (from your Windows machine)

```powershell
# Health check
Invoke-RestMethod -Uri "http://52.77.234.193:3000/health"

# Webhook (send UTF-8 so non-English works)
$body = [System.Text.Encoding]::UTF8.GetBytes('{"from":"deploy_test","text":"How much is the RTX 5070 TUF?"}')
Invoke-RestMethod -Uri "http://52.77.234.193:3000/webhook" -Method Post -ContentType "application/json; charset=utf-8" -Body $body
```

Then open in a browser:
- Customer chat:  `http://52.77.234.193:3000/chat.html`
- Rep dashboard:  `http://52.77.234.193:3000/dashboard.html`

---

## Updating the app later

```powershell
$key = "E:\AWS-Kiro\NUS-ISS-7-28Sep2026\SSH Key\LightsailDefaultKey-ap-southeast-1.pem"
scp -i "$key" -r src public package.json package-lock.json ubuntu@52.77.234.193:~/whatsapp-sales/
ssh -i "$key" ubuntu@52.77.234.193 "cd ~/whatsapp-sales && npm ci --omit=dev && pm2 restart whatsapp-sales"
```

## Useful server commands

```bash
pm2 status                 # is it running?
pm2 logs whatsapp-sales    # live logs
pm2 restart whatsapp-sales # restart after an update
pm2 stop whatsapp-sales    # stop
```

## Notes

- The app runs in `simulated` WhatsApp mode; no external API calls are made.
- The data store is JSON files under `~/whatsapp-sales/data/` on the server,
  seeded automatically on first run.
- To expose it on port 80 later, put Nginx in front as a reverse proxy, or
  change `PORT=80` in `.env` and open port 80 in the firewall (port 80 may need
  the app to run with elevated privileges; a reverse proxy is the cleaner option).
