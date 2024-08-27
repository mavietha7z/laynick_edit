import moment from 'moment-timezone';
import generateUsers from '~/services/user/generate';

const controlGetHistoryByProducts = (req, res) => {
    try {
        let userList = generateUsers(10);
        userList.sort((a, b) => moment(a.created_at, 'HH:mm:ss').diff(moment(b.created_at, 'HH:mm:ss')));

        res.status(200).json({
            status: 200,
            message: 'Lấy lịch sử đăng nhập thành công',
            data: userList,
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlGetHistoryByProducts;
