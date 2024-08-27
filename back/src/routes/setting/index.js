import express from 'express';
import middleware from '~/middleware';

import controlGetSettings from '~/controllers/setting/get';
import controlUpdateSetting from '~/controllers/setting/update';

const router = express.Router();

router.get('/', middleware.verifyAuth, controlGetSettings);

router.put('/update', middleware.verifyAuth, controlUpdateSetting);

export default router;
