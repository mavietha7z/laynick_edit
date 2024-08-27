import bcrypt from 'bcrypt';
import { User } from '~/models/user';
import configGetIp from '~/configs/address';
import { generateAccessTokenUser } from '~/configs/token';

const controlRegisterUser = async (req, res) => {
    try {
        const { full_name, username, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const ip = configGetIp(req);

        const user = new User({
            full_name,
            username,
            ip,
            password: hashed,
        });
        const save = await user.save();
        const accessToken = generateAccessTokenUser(save);

        res.status(200)
            .cookie('session_key', accessToken, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'Strict',
            })
            .json({
                status: 200,
                message: 'Đăng nhập tài khoản thành công',
            });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlRegisterUser;
