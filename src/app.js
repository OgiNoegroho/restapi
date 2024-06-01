const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const dosenRoutes = require('./routes/dosenRoutes');
const pendaftaranRoutes = require('./routes/pendaftaranRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/', mahasiswaRoutes);
app.use('/api/', dosenRoutes);
app.use('/api/', pendaftaranRoutes);
app.use('/api/user', userRoutes); // Tambahkan rute user

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Remove app.listen()

module.exports = app; // Export the app for serverless deployment
