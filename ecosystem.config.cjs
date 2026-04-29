module.exports = {
  apps: [
    {
      name: 'bigbasscrash',
      script: './dist/server/entry.mjs',
      cwd: __dirname,
      env: {
        HOST: '127.0.0.1',
        PORT: 4321,
        NODE_ENV: 'production',
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '500M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
    },
  ],
};
