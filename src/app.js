require('dotenv').config();

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
app.use('/api/user', userRoutes); // Ensure user route is under /api/user

// Root route for API
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

// Handle other routes not found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Export the app for serverless deployment
module.exports = app;
