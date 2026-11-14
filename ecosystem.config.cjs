module.exports = {
  apps: [
    {
      name: 'rstechwerk-api',
      script: 'server/index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '500M',
      time: true,
      env_production: {
        NODE_ENV: 'production',
        API_PORT: '4000'
      }
    }
  ]
};
