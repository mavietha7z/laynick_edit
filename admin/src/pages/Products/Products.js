import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Row, Card, Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlusCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import Modals from '~/components/Modals';
import PageTitle from '~/components/PageTitle';
import config, { convertCurrency } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { alertError, alertSuccess } from '~/configs/alert';
import { startLoading, stopLoading } from '~/redux/reducer/module';
import { requestDestroyProduct, requestGetProducts, requestUpdateProduct } from '~/services/product';

const { products: path, login, create } = config.routes;

function Products() {
    const [show, setShow] = useState(false);
    const [telco, setTelco] = useState(null);
    const [index, setIndex] = useState(null);

    const [products, setProducts] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Danh sách thẻ cào - Quản trị website';

        const fetch = async () => {
            dispatch(startLoading());
            const result = await requestGetProducts();
            dispatch(stopLoading());
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(login);
            } else if (result.status === 200) {
                setProducts(result.data);
            } else {
                alertError(result.error);
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggleStatus = async (type, id, index) => {
        if (!id) {
            return alertError('ID sản phẩm không tồn tại');
        }

        dispatch(startLoading());
        const result = await requestUpdateProduct({}, id, type);

        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200) {
            const clone = [...products];
            if (type === 'status') {
                clone[index].status = !clone[index].status;
            }
            if (type === 'hacked') {
                clone[index].hacked = !clone[index].hacked;
            }
            setProducts(clone);
        } else {
            alertError(result.error);
        }
    };

    const handleConfirm = async () => {
        if (!telco._id) {
            return alertError('Dữ liệu sản phẩm cần xóa không tồn tại');
        }
        dispatch(startLoading());
        const result = await requestDestroyProduct(telco._id);
        setShow(false);
        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200) {
            alertSuccess(result.message);
            const clone = [...products];
            clone.splice(index, 1);
            setProducts(clone);
        } else {
            alertError(result.error);
        }
    };

    const handleShowDestroy = async (telco, index) => {
        setShow(true);
        setTelco(telco);
        setIndex(index);
    };

    return (
        <div className="wrapper">
            <div className="header">
                <Row>
                    <PageTitle name="Danh sách sản phẩm" />

                    <Col xl={7}>
                        <div className="float-right">
                            <Link to={path + create}>
                                <Button variant="success" className="mt-xl-5 mt-3 mt-md-0">
                                    <FontAwesomeIcon icon={faPlusCircle} />
                                    <span> Thêm sản phẩm</span>
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
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table bordered>
                                        <thead>
                                            <tr>
                                                <th>Tên sản phẩm</th>
                                                <th>Giá hiện tại</th>
                                                <th>Giá cũ</th>
                                                <th>Lần dùng</th>
                                                <th>Được dùng</th>
                                                <th>Trạng thái</th>
                                                <th>Ngày tạo</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.length > 0 ? (
                                                products.map((product, index) => (
                                                    <tr key={product._id}>
                                                        <td>{product.title}</td>
                                                        <td>{convertCurrency(product.price)}</td>
                                                        <td>{convertCurrency(product.old_price)}</td>
                                                        <td>{product.times_used}</td>
                                                        <td>
                                                            <div
                                                                className={`switch round ${product.hacked ? 'on' : 'off'}`}
                                                                onClick={() => handleToggleStatus('hacked', product._id, index)}
                                                            >
                                                                <div className="toggle" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div
                                                                className={`switch round ${product.status ? 'on' : 'off'}`}
                                                                onClick={() => handleToggleStatus('status', product._id, index)}
                                                            >
                                                                <div className="toggle" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span>{moment(product.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                                                        </td>
                                                        <td>
                                                            <Link to={`${path}/edit/${product._id}`}>
                                                                <Button size="sm" className="mr-2" variant="info" title="Sửa">
                                                                    <FontAwesomeIcon icon={faPen} />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                title="Xóa"
                                                                onClick={() => handleShowDestroy(product, index)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrashCan} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6}>Không có dữ liệu</td>
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

            {show && <Modals show={show} setShow={setShow} name={telco.title} onClick={handleConfirm} />}
        </div>
    );
}

export default Products;
