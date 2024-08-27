import { Setting } from '~/models/setting';
import controlCreateSettings from './create';

const controlUpdateSetting = async (req, res) => {
    try {
        const { type } = req.query;
        const { apikey_login, notify, banner_url, charging_rank } = req.body;

        let setting = await Setting.findOne({});

        if (!setting) {
            setting = await controlCreateSettings();
        }

        if (type === 'config') {
            setting.apikey_login = apikey_login;
            setting.notify = notify;
            setting.banner_url = banner_url;
        } else {
            setting.charging_rank = charging_rank;
        }

        await setting.save();

        res.status(200).json({
            status: 200,
            message: 'Cập nhật cấu hình thành công',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlUpdateSetting;
