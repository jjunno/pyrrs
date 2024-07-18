import express from 'express';
import { getWords } from './service.js';
const router = express.Router();

router.get('/words', getWords);

export default router;
