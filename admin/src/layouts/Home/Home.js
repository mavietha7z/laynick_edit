import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Card, Col, Collapse, Row } from 'react-bootstrap';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';
import { faChevronRight, faHandHoldingDollar, faMinus, faMoneyBill1Wave } from '@fortawesome/free-solid-svg-icons';

import './Home.css';
import { alertError } from '~/configs/alert';
import PageTitle from '~/components/PageTitle';
import { requestGetUsers } from '~/services/user';
import config, { convertCurrency } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { startLoading, stopLoading } from '~/redux/reducer/module';
import { requestGetStatChargings, requestGetTotalCharging } from '~/services/charging';

const { chargings: path, users: pathUser, login } = config.routes;

const color = ['primary', 'success', 'info'];
const iconFontAwesome = [faCreditCard, faMoneyBill1Wave, faHandHoldingDollar];

function Home() {
    const [collapseOne, setCollapseOne] = useState(true);
    const [collapseTow, setCollapseTow] = useState(true);
    const [collapseThree, setCollapseThree] = useState(true);

    const [totals, setTotals] = useState([]);

    const [users, setUsers] = useState([]);
    const [totalChargings, setTotalChargings] = useState([]);
    const [successChargings, setSuccessChargings] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Bảng quản trị - Quản trị website';

        const fetch = async () => {
            dispatch(startLoading());

            try {
                const [users, totals, chargings] = await Promise.all([
                    requestGetUsers(null, 'tab'),
                    requestGetTotalCharging('tab'),
                    requestGetStatChargings(null, 'tab'),
                ]);

                const hasAuthError = [users, totals, chargings].some((res) => res.status === 401 || res.status === 403);

                if (hasAuthError) {
                    dispatch(logoutUserSuccess());
                    navigate(login);
                    return;
                }

                if (totals.status === 200) {
                    const formattedTotals = totals.data.map((item, index) => ({
                        title: item.title,
                        value: item.value,
                        icon: iconFontAwesome[index % iconFontAwesome.length] || '',
                        color: color[index % color.length] || '',
                    }));
                    setTotals(formattedTotals);
                } else {
                    alertError(totals.error);
                }

                if (chargings.status === 200) {
                    setTotalChargings(chargings.data.total);
                    setSuccessChargings(chargings.data.success);
                } else {
                    alertError(chargings.error);
                }

                if (users.status === 200) {
                    setUsers(users.data);
                } else {
                    alertError(users.error);
                }
            } catch (error) {
                alertError('Lỗi tải dữ liệu vui lòng thử lại');
            } finally {
                dispatch(stopLoading());
            }
        };

        fetch();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="wrapper" id="home">
            <div className="header">
                <Row>
                    <PageTitle name="Bảng quản trị" />
                </Row>
            </div>
            <div className="content">
                <Row>
                    {totals.map((charging, index) => (
                        <Col xl={2} key={index}>
                            <div className="home-box">
                                <span className={`home-icon bg-${charging.color}`}>
                                    <FontAwesomeIcon icon={charging.icon} />
                                </span>
                                <div className="home-content">
                                    <span className="home-text">{charging.title}</span>
                                    <span className="home-number">{convertCurrency(charging.value)}</span>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>

                <Row>
                    <Col xl={4}>
                        <Card className="mb-4">
                            <Card.Header>
                                <Card.Title>Tổng thẻ</Card.Title>
                                <div>
                                    <button className="home-btn" onClick={() => setCollapseOne(!collapseOne)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                </div>
                            </Card.Header>
                            <Collapse in={collapseOne}>
                                <Card.Body>
                                    <ul className="transfer-list">
                                        {totalChargings.map((charging, index) => (
                                            <li className="transfer-item" key={index}>
                                                <FontAwesomeIcon icon={faChevronRight} className="transfer-icon" />
                                                <span className="text-dark">
                                                    <strong>
                                                        {charging.telco}: {charging.code}
                                                    </strong>
                                                    <strong> / {charging.serial}</strong>
                                                </span>
                                                <Badge
                                                    bg={
                                                        charging.status === 1
                                                            ? 'success'
                                                            : charging.status === 2
                                                            ? 'info'
                                                            : charging.status === 99
                                                            ? 'warning'
                                                            : 'danger'
                                                    }
                                                    className="float-right"
                                                >
                                                    {convertCurrency(charging.declared_value)}
                                                </Badge>
                                                <br />
                                                <small className="text-muted">
                                                    {moment(charging.created_at).format('YYYY-MM-DD HH:mm:ss')}
                                                </small>
                                                <small className="text-dark float-right">({charging.message})</small>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Collapse>
                            <Card.Footer className="text-center py-3">
                                <Link to={path} target="_blank">
                                    Xem tất cả
                                </Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={4}>
                        <Card className="mb-4">
                            <Card.Header>
                                <Card.Title>Thẻ đúng</Card.Title>
                                <div>
                                    <button className="home-btn" onClick={() => setCollapseTow(!collapseTow)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                </div>
                            </Card.Header>
                            <Collapse in={collapseTow}>
                                <Card.Body>
                                    <ul className="transfer-list">
                                        {successChargings.map((charging, index) => (
                                            <li className="transfer-item" key={index}>
                                                <FontAwesomeIcon icon={faChevronRight} className="transfer-icon" />
                                                <span className="text-dark">
                                                    <strong>
                                                        {charging.telco}: {charging.code}
                                                    </strong>
                                                    <strong> / {charging.serial}</strong>
                                                </span>
                                                <Badge bg="success" className="float-right">
                                                    {convertCurrency(charging.declared_value)}
                                                </Badge>
                                                <br />
                                                <small className="text-muted">
                                                    {moment(charging.created_at).format('YYYY-MM-DD HH:mm:ss')}
                                                </small>
                                                <small className="text-dark float-right">({charging.message})</small>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Collapse>
                            <Card.Footer className="text-center py-3">
                                <Link to={path} target="_blank">
                                    Xem tất cả
                                </Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col xl={4}>
                        <Card className="mb-4">
                            <Card.Header>
                                <Card.Title>Người dùng</Card.Title>
                                <div>
                                    <button className="home-btn" onClick={() => setCollapseThree(!collapseThree)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                </div>
                            </Card.Header>
                            <Collapse in={collapseThree}>
                                <Card.Body>
                                    <ul className="transfer-list">
                                        {users.map((user) => (
                                            <li className="transfer-item" key={user._id}>
                                                <FontAwesomeIcon icon={faChevronRight} className="transfer-icon" />
                                                <strong>{user.username}</strong>
                                                <span> ({user.membership === 'vip' ? 'VIP' : 'Mặc định'})</span>
                                                <br />
                                                <small className="text-muted">
                                                    {moment(user.created_at).format('YYYY-MM-DD HH:mm:ss')}
                                                </small>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Collapse>
                            <Card.Footer className="text-center py-3">
                                <Link to={pathUser} target="_blank">
                                    Xem tất cả
                                </Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Home;
