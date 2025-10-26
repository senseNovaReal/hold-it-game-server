import express from 'express';
import cors from 'cors';
// import compression from 'compression';
import leaderBoardRoutes from './routes/leaderBoardRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '3kb' }));
// app.use(compression({ threshold: 0 })); // gzip all responses

// Cache header for leaderboard
app.use('/leaderboard', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600'); // 1 hour
  next();
});

// Routes
app.use('/leaderboard', leaderBoardRoutes);

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
