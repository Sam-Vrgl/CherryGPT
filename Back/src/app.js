import express from 'express';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { config } from './config/envConfig.js';
import testRoutes from './routes/testRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { initializeDB } from './config/dbConfig.js';
import cors from 'cors';


const app = express();
app.use(express.json());

app.use(cors());
// Flag to enable or disable logging.
const ENABLE_LOGGING = true;

if (ENABLE_LOGGING) {
  app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] Incoming ${req.method} ${req.url}`);
    console.log(`Request body: ${JSON.stringify(req.body)}`);

    // Capture the original send method.
    const originalSend = res.send.bind(res);

    res.send = (body) => {
      console.log(`[${new Date().toISOString()}] Response for ${req.method} ${req.url}: ${body}`);
      console.log(`Duration: ${Date.now() - start}ms`);
      return originalSend(body);
    };

    next();
  });
}

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
