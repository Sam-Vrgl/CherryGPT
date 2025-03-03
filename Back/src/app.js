import express from 'express';
import apiRoutes from './routes/apiRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { config } from './config/envConfig.js';

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Error handling middleware
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
