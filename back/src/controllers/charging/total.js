import { Charging } from '~/models/charging';

const controlGetTotalChargings = async (req, res) => {
    try {
        const { type } = req.query;

        if (type !== 'tab') {
            return res.status(400).json({
                error: 'Tham số truy vấn không hợp lệ',
            });
        }

        const result = await Charging.find({}).select('declared_value value amount created_at');

        let value = 0;
        let amount = 0;
        let declaredValue = 0;

        let today_value = 0;
        let today_amount = 0;
        let today_declaredValue = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setHours(today.getHours() + 7);

        for (let i = 0; i < result.length; i++) {
            value += result[i].value;
            amount += result[i].amount;
            declaredValue += result[i].declared_value;

            const createdAt = new Date(result[i].created_at);
            createdAt.setHours(0, 0, 0, 0);
            createdAt.setHours(createdAt.getHours() + 7);
            if (today.toISOString() === createdAt.toISOString()) {
                today_value += result[i].value;
                today_amount += result[i].amount;
                today_declaredValue += result[i].declared_value;
            }
        }

        const data = [
            {
                title: 'Tổng thẻ nhận',
                value: declaredValue,
            },
            {
                title: 'Tổng thẻ đúng',
                value: value,
            },
            {
                title: 'Tổng tiền nhận',
                value: amount,
            },
            {
                title: 'Thẻ nhận hôm nay',
                value: today_declaredValue,
            },
            {
                title: 'Thẻ đúng hôm nay',
                value: today_value,
            },
            {
                title: 'Tiền nhận hôm nay',
                value: today_amount,
            },
        ];

        res.status(200).json({
            status: 200,
            data,
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlGetTotalChargings;
