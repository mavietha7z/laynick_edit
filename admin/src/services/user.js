import request from '~/utils';

export const requestGetUsers = async (page, type) => {
    try {
        const res = await request.get('/users', {
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

export const requestUpdateUser = async (type, id, data) => {
    try {
        const res = await request.put('/users/update', data, {
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

export const requestDestroyUser = async (id) => {
    try {
        const res = await request.delete('/users/destroy', {
            params: {
                id,
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
