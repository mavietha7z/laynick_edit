import { User } from '~/models/user';
import validatorLoginUser from './login';

const validatorRegisterUser = (req, res, next) => {
    const { full_name, username } = req.body;

    validatorLoginUser(req, res, async () => {
        if (full_name.length < 2) {
            return res.status(400).json({
                error: 'Tên của bạn không hợp lệ',
            });
        }

        const user = await User.findOne({ username }).select('username');
        if (user) {
            return res.status(404).json({
                error: 'Username đã tồn tại',
            });
        }

        next();
    });
};

export default validatorRegisterUser;
