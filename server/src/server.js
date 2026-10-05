
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Connect to MongoDB
const connectDB = require('../connection/connectionDB');


const app = express();
const PORT = process.env.PORT || 5000;

// Call the connectDB function 
connectDB();

// Middleware 
app.use(cors());
app.use(express.json()); 

// Test route to check if the server is running
app.get('/api/trip', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Pathly API is running smooth!' });
});

// Run server
app.listen(PORT, () => {
  console.log(`Now listening on http://localhost:${PORT}`);
});