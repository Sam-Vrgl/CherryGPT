import express from 'express';
import { fetchWeather } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/weather', fetchWeather);

export default router;
