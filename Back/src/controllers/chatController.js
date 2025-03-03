import { getWeatherByCity } from '../services/weatherService.js';

export const fetchWeather = async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: 'City parameter is required' });
    }
    const weatherData = await getWeatherByCity(city);
    res.json({ message: `Hello, the weather in ${city} is:`, data: weatherData });
  } catch (error) {
    next(error);
  }
};
