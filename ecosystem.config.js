module.exports = {
  apps: [
    {
      name: 'gallery-server',
      script: 'server/index.js',
    },
    {
      name: 'gallery-tunnel',
      script: 'server/tunnel.js', 
    }
  ]
};
