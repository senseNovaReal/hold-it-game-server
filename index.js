import express from 'express';
import cors from 'cors';
import leaderBoardRoutes from './routes/leaderBoardRoutes.js';
import { startDailyScoreSave } from './scheduler.js';
import compression from 'compression';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '3kb' }));
app.use(compression({ threshold: 0 })); // gzip all responses


// Cache header for leaderboard
app.use('/leaderboard', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});

// Routes
app.use('/leaderboard', leaderBoardRoutes);

// Start daily cron job
startDailyScoreSave();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
