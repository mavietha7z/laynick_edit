import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { faTrashCan, faWallet } from '@fortawesome/free-solid-svg-icons';

import Modals from '~/components/Modals';
import PageTitle from '~/components/PageTitle';
import config, { convertCurrency } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import CusPagination from '~/components/CusPagination';
import { alertError, alertSuccess } from '~/configs/alert';
import { startLoading, stopLoading } from '~/redux/reducer/module';
import { requestDestroyUser, requestGetUsers, requestUpdateUser } from '~/services/user';

const { login } = config.routes;

function Users() {
    const [pages, setPages] = useState(1);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [show, setShow] = useState(false);
    const [index, setIndex] = useState(null);
    const [amount, setAmount] = useState('');
    const [showWallet, setShowWallet] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = searchParams.get('page');
    const status = searchParams.get('status');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Danh sách người dùng -  Quản trị website';

        const fetch = async () => {
            dispatch(startLoading());

            const result = await requestGetUsers(page || 1);

            dispatch(stopLoading());
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(login);
            } else if (result.status === 200) {
                setUsers(result.data);
                setPages(result.pages);
            } else {
                alertError(result.error);
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, status]);

    const handleToggle = async (id, index) => {
        if (!id) {
            alertError('ID người dùng không tồn tại');
        }

        dispatch(startLoading());
        const result = await requestUpdateUser('status', id, {});

        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200) {
            const clone = [...users];
            clone[index].status = !clone[index].status;
            setUsers(clone);
        } else {
            alertError(result.error);
        }
    };

    const handleChangeWallet = async () => {
        if (!user) {
            return alertError('Người dùng không tồn tại');
        }
        if (!amount) {
            return alertError('Vui lòng nhập số tiền');
        }

        dispatch(startLoading());
        const result = await requestUpdateUser('wallet', user._id, { amount });

        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200) {
            const clone = [...users];
            clone[index].wallet = Number(amount);
            setUsers(clone);
            setShowWallet(false);
            setIndex(null);
            setUser(null);
        } else {
            alertError(result.error);
        }
    };

    const handleDestroy = async () => {
        if (!user) {
            return alertError('Người dùng không tồn tại');
        }

        dispatch(startLoading());
        const result = await requestDestroyUser(user._id);

        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200) {
            const clone = users.filter((item) => item._id !== user._id);
            setUsers(clone);
            setShow(false);
            alertSuccess(result.message);
        } else {
            alertError(result.error);
        }
    };
    return (
        <div className="wrapper">
            <div className="header">
                <Row>
                    <PageTitle name="Người dùng" />
                </Row>
            </div>
            <div className="content">
                <Row>
                    <Col md={12}>
                        <Card>
                            <Card.Body>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped dataTable">
                                        <thead>
                                            <tr>
                                                <th>Tên</th>
                                                <th>Username</th>
                                                <th>Quyền</th>
                                                <th>Số dư</th>
                                                <th>Loại tài khoản</th>
                                                <th>Trạng thái</th>
                                                <th>Ngày tạo</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length > 0 ? (
                                                users.map((user, index) => (
                                                    <tr key={user._id}>
                                                        <td>{user.full_name}</td>
                                                        <td>{user.username}</td>
                                                        <td>{user.admin ? 'ADMIN' : 'USER'}</td>
                                                        <td className="text-success">{convertCurrency(user.wallet)}</td>
                                                        <td>{user.membership === 'vip' ? 'VIP' : 'Mặc định'}</td>
                                                        <td>
                                                            <div
                                                                className={`switch round ${user.status ? 'on' : 'off'}`}
                                                                onClick={() => handleToggle(user._id, index)}
                                                            >
                                                                <div className="toggle" />
                                                            </div>
                                                        </td>
                                                        <td>{moment(user.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                                                        <td>
                                                            <Button
                                                                className="mr-2"
                                                                size="sm"
                                                                variant="success"
                                                                title="Chỉ số dư"
                                                                onClick={() => {
                                                                    setUser(user);
                                                                    setIndex(index);
                                                                    setShowWallet(true);
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faWallet} />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                title="Xóa"
                                                                onClick={() => {
                                                                    setUser(user);
                                                                    setShow(true);
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTrashCan} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7}>Không có dữ liệu</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card.Body>

                            {pages > 1 && (
                                <Card.Footer>
                                    <Row>
                                        <Col xl={12}>
                                            <div className="float-right">
                                                <CusPagination pages={pages} page={page} setSearchParams={setSearchParams} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Footer>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>

            {show && <Modals show={show} setShow={setShow} name={user.nickname} onClick={handleDestroy} />}

            {showWallet && user && (
                <Modal show={showWallet} onHide={() => setShowWallet(false)}>
                    <Modal.Header>
                        <Modal.Title>
                            Cập nhật số dư <b>{user.full_name}</b>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Nhập số dư</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Số dư phải là số"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowWallet(false)}>
                            Huỷ
                        </Button>
                        <Button variant="primary" onClick={handleChangeWallet}>
                            Cập nhật
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default Users;
