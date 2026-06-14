// PM2 Ecosystem File — `pm2 start ecosystem.config.js`
// Commands:
//   pm2 start ecosystem.config.js     — Start the app
//   pm2 save                          — Save process list for auto-restart
//   pm2 logs                          — View logs
//   pm2 status                        — Check status
//   pm2 stop gospel-piano             — Stop the app
//   pm2 restart gospel-piano          — Restart the app

module.exports = {
  apps: [
    {
      name: 'gospel-piano',
      script: 'server.js',
      cwd: __dirname,

      // Number of instances — keep 1 for SQLite (single-writer)
      instances: 1,
      exec_mode: 'fork',

      // Restart behavior
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 3000,
      kill_timeout: 5000,

      // Logging
      error_file: 'logs/error.log',
      out_file: 'logs/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_file: '.env',

      // Watch for file changes (disable in production once stable)
      watch: false,
    },
  ],
};
