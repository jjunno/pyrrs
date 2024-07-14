import express from 'express';
import { create } from './service.js';
const router = express.Router();

router.get('/create', create);

export default router;
