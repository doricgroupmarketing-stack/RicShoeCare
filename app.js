// app.js - Production startup file for cPanel (HostAfrica) Node.js Selector
// Phusion Passenger will execute this file to start your application.

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Load the compiled Express server and Vite static file bundle
require('./dist/server.cjs');
