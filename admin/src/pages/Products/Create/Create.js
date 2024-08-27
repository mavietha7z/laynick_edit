import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import config from '~/configs';
import PageTitle from '~/components/PageTitle';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestCreateProduct } from '~/services/product';
import { alertError, alertSuccess } from '~/configs/alert';
import { startLoading, stopLoading } from '~/redux/reducer/module';

const { products, login } = config.routes;

function Create() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [timesUsed, setTimesUsed] = useState('');
    const [descriptions, setDescriptions] = useState([{ value: '' }]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Thêm sản phẩm - Quản trị website';
    }, []);

    const handleInputChange = (index, value) => {
        const newDescriptions = [...descriptions];
        newDescriptions[index] = { ...newDescriptions[index], value };
        setDescriptions(newDescriptions);
    };

    const addRow = () => {
        if (descriptions.length > 9) {
            return alertError('Chỉ được thêm tối đa 10 mô tả');
        }
        setDescriptions([...descriptions, { value: '' }]);
    };

    const handleCreateProduct = async () => {
        if (!title || !price || !oldPrice || descriptions.length < 1) {
            return alertError('Vui lòng điền đầy đủ thông tin');
        }

        dispatch(startLoading());
        const data = {
            title,
            price,
            old_price: oldPrice,
            times_used: timesUsed,
            description: descriptions,
        };

        const result = await requestCreateProduct(data);

        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200) {
            alertSuccess(result.message);
            setTitle('');
            setPrice('');
            setOldPrice('');
            setDescriptions([{ value: '' }]);
        } else {
            alertError(result.error);
        }
    };

    return (
        <div className="wrapper">
            <div className="header">
                <Row>
                    <PageTitle name="Thêm sản phẩm" />
                </Row>
            </div>
            <div className="content">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <Card.Title>Thêm sản phẩm</Card.Title>
                                <Link to={products}>
                                    <Button variant="warning">
                                        <FontAwesomeIcon icon={faHouseChimney} />
                                        <span>Trang chính</span>
                                    </Button>
                                </Link>
                            </Card.Header>
                            <Card.Body>
                                <Col xl={6}>
                                    <div className="form-group mt-3">
                                        <label>Tên sản phẩm:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tên sản phẩm"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>Giá hiện tại:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Giá hiện tại"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Giá cũ:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Giá cũ"
                                            value={oldPrice}
                                            onChange={(e) => setOldPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Lần dùng:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Lần dùng"
                                            value={timesUsed}
                                            onChange={(e) => setTimesUsed(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mô tả:</label>
                                        {descriptions.map((data, index) => (
                                            <div key={index} className="mt-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Mô tả"
                                                    value={data.value}
                                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={addRow}
                                        size="sm"
                                        title="Thêm"
                                        className="mt-2 mb-4 btn-success"
                                        style={{ float: 'inline-end' }}
                                    >
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                    </Button>
                                </Col>
                            </Card.Body>
                            <Card.Footer>
                                <Button onClick={handleCreateProduct}>Thêm mới</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Create;
