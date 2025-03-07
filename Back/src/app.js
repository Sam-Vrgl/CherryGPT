import express from 'express';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { config } from './config/envConfig.js';
import testRoutes from './routes/testRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { initializeDB } from './config/dbConfig.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.use('/api', testRoutes);
app.use('/chat', chatRoutes);

app.use(errorHandler);

initializeDB()
  .then((db) => {
    app.locals.db = db;
    console.log('Database initialized successfully.');

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
    process.exit(1);
  });
