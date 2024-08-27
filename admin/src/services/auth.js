import request from '~/utils';
import { loginUserSuccess } from '~/redux/reducer/auth';

export const requestGetCurrentUser = async () => {
    try {
        const res = await request.get('/auth/dash/current-user', {
            params: {
                _v: Math.random(),
            },
        });

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const requestLoginUser = async (user, dispatch) => {
    try {
        const res = await request.post('/auth/dash/login', user);

        const { data, ...other } = res.data;
        dispatch(loginUserSuccess(data));

        return { ...other };
    } catch (error) {
        return error.response?.data;
    }
};

export const requestLogoutUser = async () => {
    try {
        const res = await request.post(
            '/auth/logout',
            {},
            {
                params: {
                    _v: Math.random(),
                },
            },
        );

        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};
