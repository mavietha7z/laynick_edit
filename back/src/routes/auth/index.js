import express from 'express';
import middleware from '~/middleware';

import controlGetCurrentAuth from '~/controllers/auth/get';
import controlLogoutAuth from '~/controllers/auth/logout';
import controlRegisterUser from '~/controllers/auth/register';
import controlChangePassword from '~/controllers/auth/change';
import controlGetLogoutPage from '~/controllers/website/logout';
import { controlLoginUser, controlLoginAuth } from '~/controllers/auth/login';
import controlPlayerLogin, { controlPlayerGetInfo } from '~/controllers/auth/player';

import validatorLoginUser from '~/validators/auth/login';
import validatorRegisterUser from '~/validators/auth/register';

const router = express.Router();
router.post('/dash/login', validatorLoginUser, controlLoginAuth);

router.post('/dash/logout', middleware.verifyAuth, controlLogoutAuth);

router.get('/dash/current-user', middleware.verifyAuth, controlGetCurrentAuth);

router.post('/login', validatorLoginUser, controlLoginUser);

router.get('/logout', middleware.verifyLogin, controlGetLogoutPage);

router.post('/register', validatorRegisterUser, controlRegisterUser);

router.post('/player_id_login', middleware.verifyPlayer, controlPlayerLogin);

router.post('/player_get_info', middleware.verifyPlayer, controlPlayerGetInfo);

router.post('/change-password', middleware.verifyLogin, controlChangePassword);

export default router;
