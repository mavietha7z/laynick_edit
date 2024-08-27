import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';

import config from '~/configs';
import PageTitle from '~/components/PageTitle';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { alertError, alertSuccess } from '~/configs/alert';
import { startLoading, stopLoading } from '~/redux/reducer/module';
import { requestGetPartners, requestUpdatePartner } from '~/services/partners';

const { partners, login } = config.routes;

function Update() {
    const [partnerID, setPartnerID] = useState('');
    const [partnerKey, setPartnerKey] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        document.title = 'Cập nhật đối tác - Quản trị website';

        if (id) {
            const fetch = async () => {
                dispatch(startLoading());
                const result = await requestGetPartners(id);

                dispatch(stopLoading());
                if (result.status === 401 || result.status === 403) {
                    dispatch(logoutUserSuccess());
                    navigate(login);
                } else if (result.status === 200) {
                    setPartnerID(result.data.partner_id);
                    setPartnerKey(result.data.partner_key);
                } else {
                    alertError(result.error);
                }
            };
            fetch();
        } else {
            navigate(partners);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handlePartners = async () => {
        if (!partnerID || !partnerKey) {
            return alertError('Vui lòng điền đủ thông tin');
        }

        dispatch(startLoading());
        const data = {
            partner_id: partnerID,
            partner_key: partnerKey,
        };

        const result = await requestUpdatePartner(data, id);

        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200) {
            navigate(partners);
            alertSuccess(result.message);
        } else {
            alertError(result.error);
        }
    };

    return (
        <div className="wrapper">
            <div className="header">
                <Row>
                    <PageTitle name="Cập nhật đối tác" />
                </Row>
            </div>
            <div className="content">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <Card.Title>Cập nhật đối tác</Card.Title>
                                <Link to={partners}>
                                    <Button variant="warning">
                                        <FontAwesomeIcon icon={faHouseChimney} />
                                        <span>Trang chính</span>
                                    </Button>
                                </Link>
                            </Card.Header>
                            <Card.Body>
                                <Col xl={6}>
                                    <div className="form-group mt-3">
                                        <label>Partner ID:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập ID đối tác"
                                            value={partnerID}
                                            onChange={(e) => setPartnerID(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Partner Key:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập Key đối tác"
                                            value={partnerKey}
                                            onChange={(e) => setPartnerKey(e.target.value)}
                                        />
                                    </div>
                                </Col>
                            </Card.Body>
                            <Card.Footer>
                                <Button onClick={handlePartners}>Cập nhật</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Update;
