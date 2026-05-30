import express from 'express';
import cors from 'cors';
import apiRoutes from './src/routes/apiRoutes.js';
import { getIsConnected } from './src/config/db.js';
const app = express();
// Middleware setup
app.use(cors({
  origin: '*', // For demo workspace. Customize for production if needed.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// REST API routes
app.use('/api', apiRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: getIsConnected() ? 'connected' : 'fallback-memory',
    timestamp: new Date()
  });
});
// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
export default app;
