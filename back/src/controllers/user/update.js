import { User } from '~/models/user';

const controlUpdateUser = async (req, res) => {
    try {
        const { amount } = req.body;
        const { id, type } = req.query;

        if (!type || (type !== 'status' && type !== 'wallet')) {
            return res.status(400).json({
                error: 'Tham số không hợp lệ',
            });
        }
        if (type === 'wallet' && !amount) {
            return res.status(400).json({
                error: 'Vui lòng nhập số tiền',
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                error: 'Người dùng cập nhật không tồn tại',
            });
        }
        if (type === 'status' && user.admin) {
            return res.status(400).json({
                error: 'Không thể tắt trạng thái admin',
            });
        }

        if (type === 'status') {
            await user.updateOne({ status: !user.status });
        }

        await user.updateOne({ wallet: amount });

        res.status(200).json({
            status: 200,
            message: 'Cập nhật người dùng thành công',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlUpdateUser;
