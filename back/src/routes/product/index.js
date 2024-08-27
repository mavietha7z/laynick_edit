import express from 'express';
import middleware from '~/middleware';

import controlGetProducts from '~/controllers/product/get';
import controlUpdateProduct from '~/controllers/product/update';
import controlCreateProduct from '~/controllers/product/create';
import controlDestroyProduct from '~/controllers/product/destroy';
import controlRegisterProduct from '~/controllers/product/register';

const router = express.Router();

router.get('/', middleware.verifyAuth, controlGetProducts);

router.put('/update', middleware.verifyAuth, controlUpdateProduct);

router.post('/create', middleware.verifyAuth, controlCreateProduct);

router.delete('/destroy', middleware.verifyAuth, controlDestroyProduct);

router.post('/register', middleware.verifyLogin, controlRegisterProduct);

export default router;
