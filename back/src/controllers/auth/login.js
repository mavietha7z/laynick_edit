import bcrypt from 'bcrypt';
import { User } from '~/models/user';
import configGetIp from '~/configs/address';
import { generateAccessTokenUser } from '~/configs/token';

const controlLoginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).select('full_name username password wallet membership admin status');
        if (!user) {
            return res.status(404).json({
                error: 'Tài khoản của bạn không tồn tại',
            });
        }
        if (!user.status) {
            return res.status(400).json({
                error: 'Tài khoản đã bị khoá',
            });
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({
                error: 'Mật khẩu của bạn không chính xác',
            });
        }

        const ip = configGetIp(req);
        await user.updateOne({ ip });
        const accessToken = generateAccessTokenUser(user);

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

const controlLoginAuth = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username, admin: true }).select('full_name username password wallet membership status admin');
        if (!user) {
            return res.status(404).json({
                error: 'Tài khoản của bạn không tồn tại',
            });
        }
        if (!user.status) {
            return res.status(400).json({
                error: 'Tài khoản của bạn không hoạt động',
            });
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({
                error: 'Mật khẩu của bạn không chính xác',
            });
        }

        const ip = configGetIp(req);
        await user.updateOne({ ip });
        const accessToken = generateAccessTokenUser(user);
        const { password: pass, status, _id, admin, wallet, membership, ...other } = user._doc;

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
                data: {
                    ...other,
                },
            });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export { controlLoginUser, controlLoginAuth };
