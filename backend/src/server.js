import mongoose from 'mongoose';
import env from './config/env.js';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = env.PORT;
let server;

// Handle uncaught exceptions early in the execution lifecycle
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down application server...', err);
  process.exit(1);
});

// Connect to MongoDB Database and boot Express app
connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server is running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to start server due to DB connection error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down server gracefully...', err);
  if (server) {
    server.close(() => {
      mongoose.connection.close()
        .then(() => {
          console.log('MongoDB connection closed.');
          process.exit(1);
        })
        .catch(() => {
          process.exit(1);
        });
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown procedure
const gracefulShutdown = (signal) => {
  console.log(`\n♻️ Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      mongoose.connection.close()
        .then(() => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        })
        .catch((err) => {
          console.error('Error closing MongoDB connection:', err);
          process.exit(1);
        });
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

