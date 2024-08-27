import { Charging } from '~/models/charging';
import { Partner } from '~/models/partner';

const validatorKeyPostCard = async (req, res, next) => {
    const { telco, amount, code, serial } = req.body;

    if (!telco || !amount || !code || !serial) {
        return res.status(400).json({
            error: 'Vui lòng điền đầy đủ thông tin',
        });
    }
    if (!telco) {
        return res.status(400).json({
            error: 'Vui lòng chọn loại thẻ',
        });
    }
    if (!amount) {
        return res.status(400).json({
            error: 'Vui lòng chọn mệnh giá',
        });
    }
    if (!code) {
        return res.status(400).json({
            error: 'Vui lòng nhập mã thẻ',
        });
    }
    if (!serial) {
        return res.status(400).json({
            error: 'Vui lòng nhập serial thẻ',
        });
    }

    const isCode = await Charging.findOne({ code }).select('code');
    const isSerial = await Charging.findOne({ serial }).select('serial');
    if (isCode || isSerial) {
        return res.status(404).json({
            error: 'Thẻ cào đã tồn tại trong hệ thống',
        });
    }

    const partner = await Partner.findOne({ status: true }).select('partner_id partner_key partner_url');
    if (!partner || !partner.partner_id || !partner.partner_key || !partner.partner_url) {
        return res.status(404).json({
            error: 'Đối tác không tồn tại hoặc bị tắt',
        });
    }

    req.partner = partner;
    next();
};

export default validatorKeyPostCard;
