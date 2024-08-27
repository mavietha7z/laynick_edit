import request from '~/utils';

export const requestGetSettings = async () => {
    try {
        const res = await request.get('/settings', {
            params: {
                _v: Math.random(),
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUpdateSetting = async (data, type) => {
    try {
        const res = await request.put('/settings/update', data, {
            params: {
                type,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUploadImage = async (data) => {
    try {
        const res = await request.post('/images/upload', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
