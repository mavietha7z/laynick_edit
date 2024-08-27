import controlWalletUser from './wallet';
import { Charging } from '~/models/charging';
import controlCheckStatus from '../../services/charging/status';

const controlCallbackCharging = async (req, res) => {
    try {
        const { value, amount, trans_id, code, serial } = req.body;

        const stat = await Charging.findOne({ code, serial, status: 99 }).select(
            'user code serial status value amount message trans_id description approved_at',
        );
        if (!stat) {
            return res.status(400).json({
                error: 'NOT_FOUND',
            });
        }

        const { status, message, description } = controlCheckStatus(req.body.status, req.body.message);

        if (status === 1 || status === 2) {
            await controlWalletUser(stat.user, value);
        }

        await stat.updateOne({
            status,
            value,
            amount,
            message,
            trans_id,
            description,
            approved_at: Date.now(),
        });

        res.status(200).json({
            status: 200,
            message: 'OK',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlCallbackCharging;
