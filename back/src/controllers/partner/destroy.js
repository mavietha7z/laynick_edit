import { Partner } from '~/models/partner';
import { isValidMongoId } from '~/configs';

const controlDestroyPartner = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id || !isValidMongoId(id)) {
            return res.status(400).json({
                error: 'ID đối tác không hợp lệ',
            });
        }

        const partner = await Partner.findByIdAndDelete(id);
        if (!partner) {
            return res.status(404).json({
                error: 'Đối tác không tồn tại',
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Xoá đối tác thành công',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};
export default controlDestroyPartner;
