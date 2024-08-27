import express from 'express';
import middleware from '~/middleware';

import controlChargingCard from '~/controllers/charging';
import controlGetHomePage from '~/controllers/website/home';
import controlGetCardPage from '~/controllers/website/card';
import controlGetMenuPage from '~/controllers/website/menu';
import controlGetLoginPage from '~/controllers/website/login';
import controlGetUpgradePage from '~/controllers/website/upgrade';
import controlGetAccountPage from '~/controllers/website/account';
import controlGetHistoryPage from '~/controllers/website/history';
import controlGetEvaluatePage from '~/controllers/website/evaluate';
import controlGetRegisterPage from '~/controllers/website/register';
import controlCallbackCharging from '~/controllers/charging/callback';

import validatorKeyPostCard from '~/validators/charging/charging';

const router = express.Router();

router.get('/', controlGetHomePage);

router.get('/login', controlGetLoginPage);

router.get('/evaluate', controlGetEvaluatePage);

router.get('/register', controlGetRegisterPage);

router.get('/card', middleware.verifyLogin, controlGetCardPage);

router.get('/menu', middleware.verifyLogin, controlGetMenuPage);

router.get('/history', middleware.verifyLogin, controlGetHistoryPage);

router.get('/upgrade', middleware.verifyLogin, controlGetUpgradePage);

router.get('/accounts', middleware.verifyLogin, controlGetAccountPage);

// Card
router.post('/charge/callback', controlCallbackCharging);

router.post('/api/chargingws/v2', middleware.verifyLogin, validatorKeyPostCard, controlChargingCard);

export default router;
