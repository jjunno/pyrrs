import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.js';

import dotenv from 'dotenv';
dotenv.config();

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.use('/api', routes);

/**
 * Catch all route.
 */
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.listen(PORT, () => {
  console.info(`Public NodeJS Express is running on port ${PORT}`);
});
