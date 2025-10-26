import express from 'express';
import {addScore, getAllScores} from '../controllers/leaderBoard-controller.js';

const router = express.Router();

router.post('/add-score', addScore);
router.get('/all-scores', getAllScores);

export default router;