const { spawn } = require('child_process');

console.log('Starting Cloudflare Tunnel...');
const tunnel = spawn('npx', ['cloudflared', 'tunnel', '--url', 'http://127.0.0.1:3000'], { shell: true });

tunnel.stdout.on('data', (data) => {
  console.log(`${data}`);
});

tunnel.stderr.on('data', (data) => {
  console.log(`${data}`);
});

tunnel.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
