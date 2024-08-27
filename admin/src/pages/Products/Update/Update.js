import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import config from '~/configs';
import PageTitle from '~/components/PageTitle';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { alertError, alertSuccess } from '~/configs/alert';
import { startLoading, stopLoading } from '~/redux/reducer/module';
import { requestGetProducts, requestUpdateProduct } from '~/services/product';

const { products, login } = config.routes;

function Update() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [oldPrice, setOldPrice] = useState('');
    const [timesUsed, setTimesUsed] = useState('');
    const [descriptions, setDescriptions] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        document.title = 'Cập nhật đối tác - Quản trị website';

        if (id) {
            const fetch = async () => {
                dispatch(startLoading());
                const result = await requestGetProducts(id);

                dispatch(stopLoading());
                if (result.status === 401 || result.status === 403) {
                    dispatch(logoutUserSuccess());
                    navigate(login);
                } else if (result.status === 200) {
                    setTitle(result.data.title);
                    setPrice(result.data.price);
                    setOldPrice(result.data.old_price);
                    setTimesUsed(result.data.times_used);
                    setDescriptions(result.data.description);
                } else {
                    alertError(result.error);
                }
            };
            fetch();
        } else {
            navigate(products);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Hàm xử lý khi nhập dữ liệu
    const handleInputChange = (index, value) => {
        const newDescriptions = [...descriptions];
        newDescriptions[index] = { ...newDescriptions[index], value };
        setDescriptions(newDescriptions);
    };

    // Hàm thêm hàng mới
    const addRow = () => {
        if (descriptions.length > 9) {
            return alertError('Chỉ được thêm tối đa 10 mô tả');
        }
        setDescriptions([...descriptions, { value: '' }]);
    };

    const handleUpdateProduct = async () => {
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

        const result = await requestUpdateProduct(data, id);

        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200) {
            navigate(products);
            alertSuccess(result.message);
        } else {
            alertError(result.error);
        }
    };

    return (
        <div className="wrapper">
            <div className="header">
                <Row>
                    <PageTitle name="Cập nhật sản phẩm" />
                </Row>
            </div>
            <div className="content">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <Card.Title>Cập nhật sản phẩm</Card.Title>
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
                                    <div className="form-group">
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
                                <Button onClick={handleUpdateProduct}>Cập nhật</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Update;
