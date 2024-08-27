import { Setting } from '~/models/setting';

const controlCreateSettings = async () => {
    const setting = await new Setting().save();

    return setting;
};

export default controlCreateSettings;
