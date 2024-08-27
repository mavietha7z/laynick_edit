import request from '~/utils';

export const requestGetStatChargings = async (page, type = null) => {
    try {
        const res = await request.get('/chargings', {
            params: {
                page,
                type,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestGetTotalCharging = async (type) => {
    try {
        const res = await request.get('/chargings/total', {
            params: {
                type,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestDestroyCharging = async (type, id) => {
    try {
        const res = await request.delete('/chargings/destroy', {
            params: {
                type,
                status: type ? '101' : null,
                id,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
