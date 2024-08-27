import { User } from '~/models/user';

const controlDestroyUser = async (req, res) => {
    try {
        const { id } = req.query;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                error: 'Người dùng cần xoá không tồn tại',
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Xoá người dùng thành công',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlDestroyUser;
