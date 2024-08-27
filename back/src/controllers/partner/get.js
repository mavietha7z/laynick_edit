import { isValidMongoId } from '~/configs';
import { Partner } from '~/models/partner';

const controlGetPartners = async (req, res) => {
    try {
        const { id } = req.query;

        if (id && isValidMongoId(id)) {
            const data = await Partner.findById(id).select('-_id partner_id partner_key');

            return res.status(200).json({
                status: 200,
                data,
            });
        }

        const data = await Partner.find({}).select('partner_name ip status created_at').sort({ created_at: -1 });

        res.status(200).json({
            status: 200,
            data,
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlGetPartners;
