import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.js';

import dotenv from 'dotenv';
dotenv.config();

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.use('/innerapi', routes);

/**
 * Catch all route.
 */
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.listen(PORT, () => {
  console.info(`Inner NodeJS Express is running on port ${PORT}`);
});
