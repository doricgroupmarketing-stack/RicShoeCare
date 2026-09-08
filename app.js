// app.js - Production startup file for cPanel (HostAfrica) Node.js Selector
// Phusion Passenger will execute this file to start your application.

const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const serverBundle = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(serverBundle)) {
  // Load the compiled Express server and Vite static file bundle
  require(serverBundle);
} else {
  // Fallback diagnostic server if dist/ was not deployed
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>RIC Shoe Care - Setup in Progress</title></head>
      <body style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:60px auto;padding:24px;color:#1e293b;line-height:1.6;">
        <h2 style="color:#e11d48;margin-top:0;">Build Files Missing (dist/)</h2>
        <p>The production build folder <code>dist/</code> was not found in this deployment.</p>
        <p>Please ensure that:</p>
        <ol>
          <li>The <code>dist</code> folder is committed to your GitHub repository and deployed to this directory.</li>
          <li>Or run <code>npm run build</code> via cPanel Terminal / SSH.</li>
        </ol>
      </body>
      </html>
    `);
  });

  if (typeof global.PhusionPassenger !== 'undefined') {
    server.listen('passenger');
  } else {
    server.listen(process.env.PORT || 3000);
  }
}

