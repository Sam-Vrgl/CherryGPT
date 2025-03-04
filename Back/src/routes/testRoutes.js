import express from 'express';

import { testAPI } from '../controllers/testController.js';
import { testPOST } from '../controllers/testController.js';

const router = express.Router();

router.get('/test', testAPI);
router.post('/test', testPOST);

export default router;