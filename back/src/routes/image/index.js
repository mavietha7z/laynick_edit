import express from 'express';
import middleware from '~/middleware';
import controlUploadImage from '~/controllers/image/upload';

const router = express.Router();

router.post('/upload', middleware.verifyAuth, controlUploadImage);

export default router;
