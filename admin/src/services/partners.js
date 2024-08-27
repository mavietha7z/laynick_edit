import request from '~/utils';

export const requestGetPartners = async (id = null) => {
    try {
        const res = await request.get('/partners', {
            params: {
                _v: id ? null : Math.random(),
                id,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestCreatePartner = async (data, id) => {
    try {
        const res = await request.post('/partners/create', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUpdatePartner = async (data, id, type = null) => {
    try {
        const res = await request.put('/partners/update', data, {
            params: {
                type,
                id,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestDestroyPartner = async (id) => {
    try {
        const res = await request.delete('/partners/destroy', {
            params: {
                id,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
