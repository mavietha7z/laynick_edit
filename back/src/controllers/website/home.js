import jwt from 'jsonwebtoken';
import { Setting } from '~/models/setting';
import controlCreateSettings from '../setting/create';

const controlGetHomePage = async (req, res) => {
    try {
        const { session_key } = req.cookies;

        let isLogin = null;
        jwt.verify(session_key, 'jwt-session_key-user', async (error, user) => {
            if (user) {
                isLogin = user;
            }
        });

        let setting = await Setting.findOne({}).select('notify banner_url');
        if (!setting) {
            setting = await controlCreateSettings();
        }

        res.render('home.ejs', { setting, isLogin });
    } catch (error) {
        res.redirect('/login');
    }
};

export default controlGetHomePage;
