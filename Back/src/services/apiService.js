import axios from 'axios';
import { config } from '../config/envConfig.js';

export const getWeatherByCity = async (city) => {
  try {
    const response = await axios.get(config.weatherApiUrl, {
      params: {
        q: city,
        appid: config.weatherApiKey,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : 'Error fetching weather data'
    );
  }
};



