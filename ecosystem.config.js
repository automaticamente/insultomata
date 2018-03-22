module.exports = {
  apps: [
    {
      name: 'bot',
      script: './index.js',
      out_file: './logs/bot.combined.log',
      error_file: './logs/bot.combined.log',
      combine_logs: true
    },
    {
      name: 'listener',
      script: './listener.js',
      out_file: './logs/listener.combined.log',
      error_file: './logs/listener.combined.log',
      combine_logs: true
    }
  ]
};
