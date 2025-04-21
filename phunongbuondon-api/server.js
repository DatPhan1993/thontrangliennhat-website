require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API đang hoạt động' });
});

// API endpoints
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Sản phẩm 1', price: 100000 },
    { id: 2, name: 'Sản phẩm 2', price: 200000 },
    { id: 3, name: 'Sản phẩm 3', price: 300000 }
  ]);
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
}); 