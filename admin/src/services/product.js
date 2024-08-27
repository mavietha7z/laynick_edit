import request from '~/utils';

export const requestGetProducts = async (id = null) => {
    try {
        const res = await request.get('/products', {
            params: {
                id,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestCreateProduct = async (data) => {
    try {
        const res = await request.post('/products/create', data);

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestUpdateProduct = async (data, id, type = null) => {
    try {
        const res = await request.put('/products/update', data, {
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

export const requestDestroyProduct = async (id) => {
    try {
        const res = await request.delete('/products/destroy', {
            params: {
                id,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
