import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlusCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import config from '~/configs';
import Modals from '~/components/Modals';
import PageTitle from '~/components/PageTitle';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { alertError, alertSuccess } from '~/configs/alert';
import { startLoading, stopLoading } from '~/redux/reducer/module';
import { requestDestroyPartner, requestGetPartners, requestUpdatePartner } from '~/services/partners';

const { partners: path, login, create } = config.routes;

function Partners() {
    const [show, setShow] = useState(false);
    const [index, setIndex] = useState(null);
    const [partner, setPartner] = useState(null);
    const [partners, setPartners] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Danh sách đối tác - Quản trị website';

        const fetch = async () => {
            dispatch(startLoading());
            const result = await requestGetPartners();

            dispatch(stopLoading());
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(login);
            } else if (result.status === 200) {
                setPartners(result.data);
            } else {
                alertError(result.error);
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggleStatus = async (id, index) => {
        if (!id) {
            alertError('ID không tồn tại');
        } else {
            dispatch(startLoading());
            const result = await requestUpdatePartner({}, id, 'status');

            dispatch(stopLoading());
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(login);
            } else if (result.status === 200) {
                const clone = [...partners];
                clone[index].status = !clone[index].status;
                setPartners(clone);
            } else {
                alertError(result.error);
            }
        }
    };

    const handleShowDelete = async (partner, index) => {
        setShow(true);
        setIndex(index);
        setPartner(partner);
    };

    const handleConfirm = async () => {
        if (!partner._id) {
            alertError('Đối tác không tồn tại');
        } else {
            dispatch(startLoading());
            const result = await requestDestroyPartner(partner._id);

            dispatch(stopLoading());
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(login);
            } else if (result.status === 200) {
                setShow(false);
                const clone = [...partners];
                clone.splice(index, 1);
                setPartners(clone);
                alertSuccess(result.message);
            } else {
                alertError(result.error);
            }
        }
    };

    return (
        <div className="wrapper">
            <div className="header">
                <Row>
                    <PageTitle name="Quản lý đối tác API" />

                    <Col xl={7}>
                        <div className="float-right">
                            <Link to={path + create}>
                                <Button variant="success" className="mt-xl-5 mt-3 mt-md-0">
                                    <FontAwesomeIcon icon={faPlusCircle} />
                                    <span> Thêm đối tác</span>
                                </Button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="content">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <Card.Header>
                                <Card.Title>Danh sách đối tác</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table striped bordered>
                                        <thead>
                                            <tr>
                                                <th>Tên hiển thị</th>
                                                <th>IP</th>
                                                <th>Trạng thái</th>
                                                <th>Ngày tao</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {partners.length > 0 ? (
                                                partners.map((partner, index) => (
                                                    <tr key={partner._id}>
                                                        <td>{partner.partner_name}</td>
                                                        <td></td>
                                                        <td>
                                                            <div
                                                                className={`switch round ${partner.status ? 'on' : 'off'}`}
                                                                onClick={() => handleToggleStatus(partner._id, index)}
                                                            >
                                                                <div className="toggle" />
                                                            </div>
                                                        </td>
                                                        <td>{moment(partner.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                                                        <td>
                                                            <Link to={`${path}/edit/${partner._id}`}>
                                                                <Button size="sm" variant="info" className="mr-2" title="Sửa">
                                                                    <FontAwesomeIcon icon={faPen} />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                title="Xoá"
                                                                onClick={() => handleShowDelete(partner, index)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrashCan} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5}>Không có dữ liệu</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {show && <Modals show={show} setShow={setShow} name={partner.partner_name} onClick={handleConfirm} />}
        </div>
    );
}

export default Partners;
