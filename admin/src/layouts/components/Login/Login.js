import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './style.css';
import config from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { alertError, alertSuccess } from '~/configs/alert';
import { startLoading, stopLoading } from '~/redux/reducer/module';
import { requestGetCurrentUser, requestLoginUser } from '~/services/auth';

const { home, forgot } = config.routes;

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Đăng nhập quản trị - Quản trị website';

        if (currentUser) {
            const fetch = async () => {
                dispatch(startLoading());
                const result = await requestGetCurrentUser();

                dispatch(stopLoading());
                if (result.status === 401 || result.status === 403) {
                    dispatch(logoutUserSuccess());
                } else if (result.status === 200) {
                    navigate(home);
                } else {
                    alertError(result.error);
                }
            };
            fetch();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const handleLogin = async () => {
        const usernameRegex = /^[a-z][a-z0-9]{4,19}$/;

        if (!username || !password) {
            return alertError('Vui lòng nhập đủ thông tin');
        }
        if (!usernameRegex.test(username)) {
            return alertError('Username không hợp lệ');
        }
        if (password.length < 6) {
            return alertError('Password không hợp lệ');
        }

        dispatch(startLoading());
        const user = {
            username,
            password,
        };

        const result = await requestLoginUser(user, dispatch);

        dispatch(stopLoading());
        if (result.status === 200) {
            navigate(home);
            alertSuccess(result.message);
        } else {
            alertError(result.error);
        }
    };

    return (
        <div className="login">
            <div className="login-content">
                <h2 className="login-title mb-4">Đăng nhập quản trị</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Link to={forgot} className="forgot-password">
                    Quên mật khẩu?
                </Link>
                <Form.Group className="mb-3">
                    <Button size="sm" className="btn-block" onClick={handleLogin}>
                        Đăng nhập
                    </Button>
                </Form.Group>
            </div>
        </div>
    );
}

export default Login;
