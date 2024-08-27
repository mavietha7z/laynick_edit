import express from 'express';
import middleware from '~/middleware';

import controlGetPartners from '~/controllers/partner/get';
import controlCreatePartner from '~/controllers/partner/create';
import controlUpdatePartner from '~/controllers/partner/update';
import controlDestroyPartner from '~/controllers/partner/destroy';

const router = express.Router();

router.get('/', middleware.verifyAuth, controlGetPartners);

router.put('/update', middleware.verifyAuth, controlUpdatePartner);

router.post('/create', middleware.verifyAuth, controlCreatePartner);

router.delete('/destroy', middleware.verifyAuth, controlDestroyPartner);

export default router;
