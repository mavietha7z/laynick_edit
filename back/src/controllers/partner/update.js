import { Partner } from '~/models/partner';
import { isValidMongoId } from '~/configs';

const controlUpdatePartner = async (req, res) => {
    try {
        const { id, type } = req.query;
        const { partner_id, partner_key } = req.body;

        if (!id || !isValidMongoId(id)) {
            return res.status(400).json({
                error: 'ID đối tác không hợp lệ',
            });
        }

        const partner = await Partner.findById(id);
        if (!partner) {
            return res.status(404).json({
                error: 'Đối tác đổi thẻ không tồn tại',
            });
        }

        if (type && type === 'status') {
            const partners = await Partner.find({ status: true });

            if (!partner.status && partners.length > 0) {
                return res.status(400).json({
                    error: 'Đang có đối tác hoạt động vui lòng tắt để bật đối tác này',
                });
            }

            await partner.updateOne({ status: !partner.status });
        } else {
            await partner.updateOne({ partner_id, partner_key });
        }

        res.status(200).json({
            status: 200,
            message: 'Cập nhật đối tác thành công',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlUpdatePartner;
