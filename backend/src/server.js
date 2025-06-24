require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const db = require('./models');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api', routes);

// Socket.io connection
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('join_band', (bandId) => {
    socket.join(`band_${bandId}`);
    logger.info(`User ${socket.id} joined band: ${bandId}`);
  });

  socket.on('leave_band', (bandId) => {
    socket.leave(`band_${bandId}`);
    logger.info(`User ${socket.id} left band: ${bandId}`);
  });

  socket.on('rehearsal_update', (data) => {
    io.to(`band_${data.bandId}`).emit('rehearsal_updated', data);
    logger.info(`Rehearsal update in band ${data.bandId}: ${JSON.stringify(data)}`);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Database connection error: ${error.message}`);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = { app, server };