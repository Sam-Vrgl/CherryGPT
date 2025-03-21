import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3030,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
