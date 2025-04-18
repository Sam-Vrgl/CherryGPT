import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3030,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_ASSISTANT_ID: process.env.OPENAI_ASSISTANT_ID,
  
};
