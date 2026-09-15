// PM2 process configuration for the Lightsail server.
// Start with:  pm2 start ecosystem.config.js
// PM2 keeps the app running, restarts it on crash, and can auto-start on boot.
module.exports = {
  apps: [
    {
      name: 'whatsapp-sales',
      script: 'src/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
