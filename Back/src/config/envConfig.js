import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  weatherApiKey: process.env.WEATHER_API_KEY,
  weatherApiUrl: process.env.WEATHER_API_URL
};
