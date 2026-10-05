
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./connection/connectionDB'); 
const apiRoutes = require('./routes/api');


const app = express();
const PORT = process.env.PORT || 5000;


// Middleware 
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// Routes
app.use('/api', apiRoutes);

// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Now listening on http://localhost:${PORT}`)
  })
}

startServer();
