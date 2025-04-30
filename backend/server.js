// server.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/dbConfig');

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/credits', require('./routes/creditRoutes'));
app.use('/api/feed', require('./routes/feedRoutes'));

const port = process.env.PORT;

const server = app.listen(
  port,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold)
);
