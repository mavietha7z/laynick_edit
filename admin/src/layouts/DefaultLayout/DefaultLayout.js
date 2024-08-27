import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';

import config from '~/configs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { alertError } from '~/configs/alert';
import { requestGetCurrentUser } from '~/services/auth';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import { startLoading, stopLoading } from '~/redux/reducer/module';

const { login } = config.routes;

function DefaultLayout({ children }) {
    const { sidebar } = useSelector((state) => state.module);
    const { currentUser } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            const fetch = async () => {
                dispatch(startLoading());
                const result = await requestGetCurrentUser();
                dispatch(stopLoading());
                if (result.status === 401 || result.status === 403) {
                    dispatch(logoutUserSuccess());
                    navigate(login);
                } else if (result.status === 200) {
                    dispatch(loginUserSuccess(result.data));
                } else {
                    alertError(result.error);
                }
            };
            fetch();
        } else {
            dispatch(logoutUserSuccess());
            navigate(login);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            <Sidebar />
            <div className={`wrapper-container ${sidebar || !isMobile ? 'active' : ''}`}>
                <Header />
                <Fragment>{children}</Fragment>
                <Footer />
            </div>
        </Fragment>
    );
}

export default DefaultLayout;
