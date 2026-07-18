import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';

import env from './config/env.js';
import authRouter from './routes/auth.routes.js';
import eventRouter from './routes/event.routes.js';
import userRouter from './routes/user.routes.js';
import organiserRouter from './routes/organiser.routes.js';
import adminRouter from './routes/admin.routes.js';
import uploadRouter from './routes/upload.routes.js';

import errorHandler from './middleware/error.middleware.js';
import ApiError from './utils/ApiError.js';

const app = express();

// Trust reverse proxy (e.g. Render, AWS ALB, Heroku) for rate limiting and secure cookies
app.set('trust proxy', 1);

// HTTP request logger
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Compress all response bodies
app.use(compression());

// Parse cookies
app.use(cookieParser());

// Set security HTTP headers
app.use(helmet());

// Sanitize MongoDB inputs against injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Enable CORS
const corsOptions = {
  origin: env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Set Rate Limiter: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Parse JSON request bodies with a size limit
app.use(express.json({ limit: '10mb' }));
// Parse urlencoded request bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve local uploads statically
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API Base Routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use('/api/users', userRouter);
app.use('/api/organisers', organiserRouter);
app.use('/api/admin', adminRouter);
app.use('/api/uploads', uploadRouter);

// Root route placeholder
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to EngiNow Events Platform API',
  });
});

// Fallback 404 handler for unmatched routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global central error handler middleware
app.use(errorHandler);

export default app;

