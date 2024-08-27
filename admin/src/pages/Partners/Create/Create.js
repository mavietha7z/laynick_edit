import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';

import config from '~/configs';
import PageTitle from '~/components/PageTitle';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { alertError, alertSuccess } from '~/configs/alert';
import { requestCreatePartner } from '~/services/partners';
import { startLoading, stopLoading } from '~/redux/reducer/module';

const { partners, login } = config.routes;

function Create() {
    const [partnerID, setPartnerID] = useState('');
    const [partnerKey, setPartnerKey] = useState('');
    const [partnerUrl, setPartnerUrl] = useState('');
    const [partnerName, setPartnerName] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCreatePartner = async () => {
        if (!partnerName || !partnerUrl) {
            return alertError('Vui lòng điền tên và url đối tác');
        }

        dispatch(startLoading());
        const data = {
            partner_name: partnerName,
            partner_id: partnerID,
            partner_key: partnerKey,
            partner_url: partnerUrl,
        };

        const result = await requestCreatePartner(data);

        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200 || result.status === 400) {
            setPartnerID('');
            setPartnerKey('');
            setPartnerUrl('');
            setPartnerName('');
            alertSuccess(result.message);
        } else {
            alertError(result.error);
        }
    };

    return (
        <div className="wrapper">
            <div className="header">
                <Row>
                    <PageTitle name="Thêm đối tác" />
                </Row>
            </div>
            <div className="content">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <Card.Title>Thêm đối tác</Card.Title>
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
                                        <label>Partner Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập tên đối tác"
                                            value={partnerName}
                                            onChange={(e) => setPartnerName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>Partner ID:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập id đối tác"
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
                                    <div className="form-group">
                                        <label>Partner Url:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập url đối tác"
                                            value={partnerUrl}
                                            onChange={(e) => setPartnerUrl(e.target.value)}
                                        />
                                    </div>
                                </Col>
                            </Card.Body>
                            <Card.Footer>
                                <Button onClick={handleCreatePartner}>Thêm mới</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Create;
