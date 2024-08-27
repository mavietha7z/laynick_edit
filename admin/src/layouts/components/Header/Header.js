import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

import './Header.css';
import config from '~/configs';
import { requestLogoutUser } from '~/services/auth';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { closeSidebar, openSidebar, startLoading, stopLoading } from '~/redux/reducer/module';

const { home, chargings, login } = config.routes;

function Header() {
    const { sidebar } = useSelector((state) => state.module);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleToggleSidebar = () => {
        if (sidebar) {
            dispatch(closeSidebar());
            document.body.classList.remove('open');
        } else {
            dispatch(openSidebar());
            document.body.classList.add('open');
        }
    };

    const handleLogout = async () => {
        dispatch(startLoading());
        await requestLogoutUser();
        dispatch(stopLoading());
        dispatch(logoutUserSuccess());
        navigate(login);
        window.location.reload();
    };

    return (
        <div className="wrapper-header">
            <nav className="header-nav">
                <div className="header-left">
                    <div className="header-icon" onClick={handleToggleSidebar}>
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                    <div className="header-title">
                        <Link to={home}>Trang chủ</Link>
                    </div>
                    <div className="header-title">
                        <Link to={chargings}>Thanh toán</Link>
                    </div>
                </div>
                <div className="header-right">
                    <div className="notification" title="Thông báo">
                        <FontAwesomeIcon icon={faBell} />
                    </div>
                    <div className="header-logout" title="Đăng xuất" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightToBracket} />
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
