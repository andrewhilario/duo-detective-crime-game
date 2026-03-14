# Deployment — Ubuntu Home Server with Cloudflare Tunnel

> **Requirements before you start:**
> - A domain name added to Cloudflare (free plan is fine). You can register a cheap domain on Namecheap, Porkbun, etc. and then add it to Cloudflare.
> - SSH access to your Ubuntu server.
> - The project pushed to a GitHub repository.

---

## Table of Contents

1. [Step 1 — SSH into your server](#step-1--ssh-into-your-server)
2. [Step 2 — Install Node.js 20](#step-2--install-nodejs-20)
3. [Step 3 — Copy the project to the server](#step-3--copy-the-project-to-the-server)
4. [Step 4 — Set up Cloudflare Tunnel](#step-4--set-up-cloudflare-tunnel)
5. [Step 5 — Install PM2](#step-5--install-pm2)
6. [Step 6 — Install dependencies and build](#step-6--install-dependencies-and-build)
7. [Step 7 — Start the app](#step-7--start-the-app)
8. [Step 8 — Test it](#step-8--test-it)
9. [Updating after code changes](#updating-after-code-changes)
10. [Useful commands](#useful-commands)

---

## Step 1 — SSH into your server

On your Windows/Mac machine open a terminal and connect:

```bash
ssh your_username@your_server_ip
```

All the following commands are run **on the server** inside this SSH session.

---

## Step 2 — Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify it installed correctly:

```bash
node -v
```

You should see something like `v20.x.x`.

---

## Step 3 — Copy the project to the server

Clone your GitHub repository:

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git game
cd game
```

> Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

---

## Step 4 — Set up Cloudflare Tunnel

Cloudflare Tunnel creates a secure HTTPS connection from your domain to your home server **without opening any ports on your router** and without exposing your home IP address.

### 4a — Install cloudflared

```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb
```

Verify:

```bash
cloudflared --version
```

### 4b — Log in to Cloudflare

```bash
cloudflared tunnel login
```

This prints a URL. Open that URL in any browser, log into your Cloudflare account, and click the domain you want to use. Come back to the terminal when done — it will say `You have successfully logged in`.

### 4c — Create the tunnel

```bash
cloudflared tunnel create duo-detective
```

This prints a **Tunnel ID** that looks like `abc12345-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Copy it — you'll need it in the next step.

### 4d — Create the config file

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Paste the following, replacing all three placeholder values:

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/YOUR_UBUNTU_USERNAME/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: game.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

- `YOUR_TUNNEL_ID` — the ID from step 4c (appears **twice**)
- `YOUR_UBUNTU_USERNAME` — your Linux username (run `whoami` if unsure)
- `game.yourdomain.com` — the subdomain you want the game on

Save and exit: `Ctrl+X`, then `Y`, then `Enter`.

### 4e — Create the DNS record

```bash
cloudflared tunnel route dns duo-detective game.yourdomain.com
```

> Replace `game.yourdomain.com` with your actual subdomain.

### 4f — Install and start the tunnel as a system service

> **Note:** The `service install` command must point to the config file explicitly, otherwise it fails because `sudo` resolves `~` as `/root`.

```bash
sudo cloudflared --config /home/$(whoami)/.cloudflared/config.yml service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

The tunnel is now running and will start automatically on every reboot.

---

## Step 5 — Install PM2

PM2 is a process manager. It keeps the app running after you close the SSH session and automatically restarts it if it crashes or if the server reboots.

```bash
sudo npm install -g pm2
```

---

## Step 6 — Install dependencies and build

> **Important:** `NEXT_PUBLIC_SOCKET_URL` must be set to your public domain at build time because Next.js bakes it into the client bundle. Use the same hostname you configured in step 4d.

```bash
cd ~/game
npm install
NEXT_PUBLIC_SOCKET_URL=https://game.yourdomain.com npm run build
```

> Replace `game.yourdomain.com` with your actual domain. This must be the full `https://` URL.

---

## Step 7 — Start the app

```bash
cd ~/game
NODE_ENV=production pm2 start server.mjs --name duo-detective
pm2 save
```

Then make PM2 start on boot:

```bash
pm2 startup
```

It will print a `sudo env PATH=...` command. Copy and paste that exact command into your terminal and run it.

---

## Step 8 — Test it

Open `https://game.yourdomain.com` in your browser.

- The game should load over HTTPS.
- Open it in a second browser tab, create a room in one tab and join it in the other — the WebSocket connection should work.

---

## Updating after code changes

Whenever you push new code to GitHub and want to deploy it:

```bash
cd ~/game
git pull
npm install
NEXT_PUBLIC_SOCKET_URL=https://game.yourdomain.com npm run build
pm2 restart duo-detective
```

---

## Useful commands

### PM2

| Command | What it does |
|---|---|
| `pm2 status` | Show if the app is running |
| `pm2 logs duo-detective` | See live logs and errors |
| `pm2 restart duo-detective` | Restart the app |
| `pm2 stop duo-detective` | Stop the app |

### cloudflared

| Command | What it does |
|---|---|
| `sudo systemctl status cloudflared` | Check if the tunnel is running |
| `sudo systemctl restart cloudflared` | Restart the tunnel |
| `cloudflared tunnel list` | List all your tunnels |
