const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes.js');
const invoiceRoutes = require('./routes/invoiceRoutes.js');
const automationRoutes = require('./routes/automationRoutes.js');

// Import database configuration
const dbConfig = require('./config/database.js');

// Import passport configuration
require('./config/passport.js');

// Import cron jobs
require('./utils/cron.js');

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  crossOriginEmbedderPolicy: false
}));

app.use(passport.initialize());



// Routes
app.use('/auth', authRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/automation', automationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;