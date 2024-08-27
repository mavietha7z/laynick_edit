import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';

import viewEngine from './configs/view';

import userRouter from './routes/user';
import authRouter from './routes/auth';
import imageRouter from './routes/image';
import settingRouter from './routes/setting';
import partnerRouter from './routes/partner';
import websiteRouter from './routes/website';
import productRouter from './routes/product';
import chargingRouter from './routes/charging';

const port = 4040;
const app = express();
const whitelist = ['http://localhost:4040', 'http://localhost:3000', 'http://localhost:3001'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (whitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Only secure connections (HTTPS) are allowed'));
            }
        },
        credentials: true,
    }),
);

app.use(
    helmet({
        crossOriginResourcePolicy: false,
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
            },
        },
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('common'));

viewEngine(app);

connect('mongodb://localhost:27017/laynick')
    .then(() => {
        console.log('Connecting to database successfully');
    })
    .catch((err) => {
        console.log('Connecting to database error: ' + err.message);
    });

app.use('/', websiteRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/images', imageRouter);
app.use('/api/settings', settingRouter);
app.use('/api/partners', partnerRouter);
app.use('/api/products', productRouter);
app.use('/api/chargings', chargingRouter);
app.use('/images', express.static('src/assets'));

app.use('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
