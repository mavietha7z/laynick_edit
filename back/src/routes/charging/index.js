import express from 'express';
import middleware from '~/middleware';

import controlGetChargings from '~/controllers/charging/get';
import controlDestroyCharging from '~/controllers/charging/destroy';
import controlGetTotalChargings from '~/controllers/charging/total';

import { validatorCheckPages } from '~/validators';

const router = express.Router();

router.get('/total', middleware.verifyAuth, controlGetTotalChargings);

router.delete('/destroy', middleware.verifyAuth, controlDestroyCharging);

router.get('/', middleware.verifyAuth, validatorCheckPages, controlGetChargings);

export default router;
