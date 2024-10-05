const express = require('express');
const path = require('path');
const app = express();

// Menambahkan header Access-Control-Allow-Origin untuk mengizinkan CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Mengizinkan semua origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Menyajikan file statis dari folder 'Website'
app.use(express.static(path.join(__dirname, 'Website')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Website', 'index.html'));
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});
