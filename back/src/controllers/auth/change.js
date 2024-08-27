import bcrypt from 'bcrypt';
import { User } from '~/models/user';

const controlChangePassword = async (req, res) => {
    try {
        const { password, new_password, renew_password } = req.body;

        const passwordRegex = /^.{6,20}$/;

        if (!password || !new_password || !renew_password) {
            return res.status(400).json({
                error: 'Vui lòng nhập đầy đủ thông tin',
            });
        }
        if (!passwordRegex.test(password) || !passwordRegex.test(new_password) || !passwordRegex.test(renew_password)) {
            return res.status(400).json({
                error: 'Mật khẩu không hợp lệ',
            });
        }
        if (password === new_password) {
            return res.status(400).json({
                error: 'Mật khẩu cũ và mới không được trùng lặp',
            });
        }
        if (renew_password !== new_password) {
            return res.status(400).json({
                error: 'Vui lòng nhập đúng mật khẩu mới',
            });
        }

        const user = await User.findById(req.user.id);

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({
                error: 'Mật khẩu hiện tại của bạn sai',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(new_password, salt);
        await user.updateOne({ password: hashed });

        res.status(200).json({
            status: 200,
            message: 'Đổi mật khẩu thành công',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlChangePassword;
