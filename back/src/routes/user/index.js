import express from 'express';
import middleware from '~/middleware';

import controlGetUsers from '~/controllers/user/get';
import controlUpdateUser from '~/controllers/user/update';
import controlDestroyUser from '~/controllers/user/destroy';
import controlGetHistoryByProducts from '~/controllers/user/history';

import { validatorCheckPages, validatorMongoId } from '~/validators';

const router = express.Router();

router.get('/histories', controlGetHistoryByProducts);

router.get('/', middleware.verifyAuth, validatorCheckPages, controlGetUsers);

router.put('/update', middleware.verifyAuth, validatorMongoId, controlUpdateUser);

router.delete('/destroy', middleware.verifyAuth, validatorMongoId, controlDestroyUser);

export default router;
