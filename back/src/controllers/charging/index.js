import { User } from '~/models/user';
import { postCard } from '~/configs';
import controlWalletUser from './wallet';
import { Charging } from '~/models/charging';
import controlCheckStatus from '../../services/charging/status';

const controlChargingCard = async (req, res) => {
    try {
        const { id: user } = req.user;
        const { telco, code, serial, amount } = req.body;
        const { _id: partner, partner_id, partner_key, partner_url } = req.partner;

        const result = await postCard(telco, code, serial, amount, partner_id, partner_key, partner_url);

        if (!result || result.status === 102) {
            return res.status(400).json({
                error: 'Lỗi máy chủ đang bảo trì',
            });
        }
        if (result.message === 'charging.card_existed') {
            return res.status(400).json({
                error: 'Thẻ cào đã được sử dụng',
            });
        }
        if (result.status === 400) {
            return res.status(400).json({
                error: 'Bạn đã bị chặn do SPAM thẻ sai',
            });
        }

        if (result.status) {
            const { request_id, trans_id, value } = result;
            const { status, message, description, res_status, res_message } = controlCheckStatus(result.status, result.message);

            if (status === 1) {
                await controlWalletUser(user, amount);
            }
            if (status === 2) {
                await controlWalletUser(user, value);
            }

            const stats = new Charging({
                user,
                telco,
                partner,
                code,
                serial,
                declared_value: amount,
                value: 0,
                amount: 0,
                request_id,
                message,
                description,
                trans_id,
                status,
                created_at: new Date(),
            });
            const save = await stats.save();
            await User.findByIdAndUpdate(user, { $push: { chargings: save._id } });

            res.status(res_status).json({
                status: res_status,
                message: res_message,
            });
        } else {
            res.status(400).json({
                error: 'Lỗi nạp thẻ vui lòng thử lại sau',
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlChargingCard;
