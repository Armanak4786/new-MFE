const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for module federation
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files for authentication (shell)
app.use('/', express.static(path.join(__dirname, 'dist/authentication')));

// Serve static files for dealer remote
app.use('/dealer', express.static(path.join(__dirname, 'dist/dealer')));

// Serve static files for commercial remote
app.use('/commercial', express.static(path.join(__dirname, 'dist/commercial')));

// Serve static files for admin remote
app.use('/admin', express.static(path.join(__dirname, 'dist/admin')));

// Handle Angular routes - serve index.html for all routes
app.get('*', (req, res) => {
  // Determine which app to serve based on the path
  if (req.path.startsWith('/dealer')) {
    res.sendFile(path.join(__dirname, 'dist/dealer/index.html'));
  } else if (req.path.startsWith('/commercial')) {
    res.sendFile(path.join(__dirname, 'dist/commercial/index.html'));
  } else if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, 'dist/admin/index.html'));
  } else {
    // Default to authentication (shell)
    res.sendFile(path.join(__dirname, 'dist/authentication/index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Serving applications:`);
  console.log(`   - Shell (Authentication): http://localhost:${PORT}/`);
  console.log(`   - Dealer: http://localhost:${PORT}/dealer/`);
  console.log(`   - Commercial: http://localhost:${PORT}/commercial/`);
  console.log(`   - Admin: http://localhost:${PORT}/admin/`);
});
