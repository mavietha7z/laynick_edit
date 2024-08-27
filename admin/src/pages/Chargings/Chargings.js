import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Button, Card, Col, Row, Table } from 'react-bootstrap';
import { faCheckCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import Modals from '~/components/Modals';
import PageTitle from '~/components/PageTitle';
import config, { convertCurrency } from '~/configs';
import CusPagination from '~/components/CusPagination';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { alertError, alertSuccess } from '~/configs/alert';
import { startLoading, stopLoading } from '~/redux/reducer/module';
import { requestGetStatChargings, requestDestroyCharging } from '~/services/charging';

const { login } = config.routes;

function Chargings() {
    const [pages, setPages] = useState(1);
    const [index, setIndex] = useState(null);
    const [charings, setChargings] = useState([]);
    const [charging, setCharging] = useState(null);
    const [showDelete, setShowDelete] = useState(false);

    const [value, setValue] = useState(0);
    const [amountVal, setAmountVal] = useState(0);
    const [declaredValue, setDeclaredValue] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();

    const page = searchParams.get('page');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Danh sách thẻ đã nạp - Quản trị website';

        const fetch = async () => {
            dispatch(startLoading());

            const result = await requestGetStatChargings(page || 1);

            dispatch(stopLoading());
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(login);
            } else if (result.status === 200) {
                setPages(result.pages);
                setChargings(result.data);

                setValue(result.value);
                setAmountVal(result.amount);
                setDeclaredValue(result.declared_value);
            } else {
                alertError(result.error);
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleShowDestroy = async (charging, index) => {
        setIndex(index);
        setShowDelete(true);
        setCharging(charging);
    };

    const handleConfirmDestroy = async () => {
        if (!charging._id) {
            return alertError('Dữ liệu thẻ cào này không tồn tại');
        }

        dispatch(startLoading());
        const result = await requestDestroyCharging(null, charging._id);

        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200) {
            setShowDelete(false);
            const clone = [...charings];
            clone.splice(index, 1);
            setChargings(clone);
            alertSuccess(result.message);
        } else {
            alertError(result.error);
        }
    };

    return (
        <div className="wrapper">
            <div className="header">
                <Row>
                    <PageTitle name="Thống kê đổi thẻ" />
                </Row>
            </div>
            <div className="content">
                <Row>
                    <Col md={12} className="px-0 px-md-2">
                        <Card>
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table striped bordered>
                                        <thead>
                                            <tr>
                                                <th>TT</th>
                                                <th>Thông tin thẻ</th>
                                                <th>Mạng</th>
                                                <th>NCC</th>
                                                <th>Khách hàng</th>
                                                <th>Khai báo</th>
                                                <th>Thực</th>
                                                <th>Nhận</th>
                                                <th>Gửi/Duyệt</th>
                                                <th>Yêu cầu</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {charings.length > 0 ? (
                                                charings.map((charing, index) => (
                                                    <tr key={charing._id}>
                                                        <td>
                                                            <Badge
                                                                bg={
                                                                    charing.status === 1
                                                                        ? 'success'
                                                                        : charing.status === 2
                                                                        ? 'info'
                                                                        : charing.status === 99
                                                                        ? 'warning'
                                                                        : 'danger'
                                                                }
                                                            >
                                                                {charing.message}
                                                                {charing.checked && (
                                                                    <FontAwesomeIcon className="ml-2" icon={faCheckCircle} />
                                                                )}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <span>M:{charing.code}</span>
                                                            <br />
                                                            <span>S:{charing.serial}</span>
                                                        </td>
                                                        <td>{charing.telco}</td>
                                                        <td>
                                                            {charing.partner ? (
                                                                <Fragment>{charing.partner.partner_name}</Fragment>
                                                            ) : (
                                                                <Fragment>Không</Fragment>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {charing.user ? (
                                                                <Fragment>{charing.user.full_name}</Fragment>
                                                            ) : (
                                                                <Fragment>Không</Fragment>
                                                            )}
                                                        </td>
                                                        <td>{convertCurrency(charing.declared_value)}</td>
                                                        <td>{convertCurrency(charing.value)}</td>
                                                        <td>{convertCurrency(charing.amount)}</td>
                                                        <td>
                                                            <span>{moment(charing.created_at).format('YYYY-MM-DD HH:mm:ss')}</span>
                                                            <br />
                                                            <span className="text-success">
                                                                {charing.approved_at
                                                                    ? moment(charing.approved_at).format('YYYY-MM-DD HH:mm:ss')
                                                                    : ''}
                                                            </span>
                                                        </td>

                                                        <td>{charing.request_id}</td>
                                                        <td>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                className="ml-2"
                                                                title="Xóa"
                                                                onClick={() => handleShowDestroy(charing, index)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrashCan} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={13}>Không có dữ liệu</td>
                                                </tr>
                                            )}
                                        </tbody>
                                        {(!page || page === '1') && (
                                            <tfoot>
                                                <tr>
                                                    <th colSpan={5} className="text-right">
                                                        Tổng số:
                                                    </th>
                                                    <th>{convertCurrency(declaredValue)}</th>
                                                    <th>{convertCurrency(value)}</th>
                                                    <th>{convertCurrency(amountVal)}</th>
                                                    <th colSpan={5} />
                                                </tr>
                                            </tfoot>
                                        )}
                                    </Table>
                                </div>
                            </Card.Body>

                            {pages > 1 && (
                                <Card.Footer>
                                    <Row>
                                        <Col xl={12}>
                                            <div className="float-right">
                                                <CusPagination page={page} pages={pages} setSearchParams={setSearchParams} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Footer>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>

            {showDelete && (
                <Modals show={showDelete} setShow={setShowDelete} name={`Mã thẻ: ${charging.code}`} onClick={handleConfirmDestroy} />
            )}
        </div>
    );
}

export default Chargings;
