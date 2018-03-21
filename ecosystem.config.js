module.exports = {
  apps: [
    {
      name: 'bot',
      script: './index.js',
      watch: true
    },
    {
      name: 'listener',
      script: './listener.js',
      watch: true
    }
  ]
};
