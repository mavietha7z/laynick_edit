import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Card, Col, Row, Tab, Tabs, Button, Table } from 'react-bootstrap';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import config from '~/configs';
import PageTitle from '~/components/PageTitle';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { alertError, alertSuccess } from '~/configs/alert';
import { startLoading, stopLoading } from '~/redux/reducer/module';
import { requestGetSettings, requestUpdateSetting, requestUploadImage } from '~/services/settings';

const { login } = config.routes;

const mdParser = new MarkdownIt({
    html: true,
    breaks: true,
});

function Settings() {
    const [users, setUsers] = useState([]);
    const [bannerUrl, setBannerUrl] = useState('');
    const [notifyHtml, setNotifyHtml] = useState('');
    const [notifyText, setNotifyText] = useState('');
    const [apikeyLogin, setApikeyLogin] = useState({ api_key: '', status: false, use: '', expired_at: '' });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const inputRef = useRef();

    useEffect(() => {
        document.title = 'Cài đạt website - Quản trị website';

        const fetch = async () => {
            dispatch(startLoading());
            const result = await requestGetSettings();

            dispatch(stopLoading());
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(login);
            } else if (result.status === 200) {
                const { charging_rank, banner_url, notify, apikey_login } = result.data;

                setUsers(charging_rank);
                setBannerUrl(banner_url);
                setNotifyHtml(notify.html);
                setNotifyText(notify.text);
                setApikeyLogin(apikey_login);
            } else {
                alertError(result.error);
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeApikey = useCallback((e) => {
        setApikeyLogin((prevState) => ({
            ...prevState,
            api_key: e.target.value,
        }));
    }, []);

    const handleInputChange = (index, field, value) => {
        const newUsers = [...users];
        newUsers[index] = { ...newUsers[index], [field]: value };
        setUsers(newUsers);
    };

    const addRow = () => {
        if (users.length > 9) {
            return alertError('Chỉ được thêm tối đa top 10');
        }
        setUsers([...users, { nickname: '', amount: '' }]);
    };

    const handleOnChangeEditor = ({ html, text }) => {
        setNotifyHtml(html);
        setNotifyText(text);
    };

    const handleUpdateSetting = async (type) => {
        dispatch(startLoading());

        let data = null;
        if (type === 'config') {
            data = {
                apikey_login: apikeyLogin.api_key,
                notify: {
                    html: notifyHtml,
                    text: notifyText,
                },
                banner_url: bannerUrl,
            };
        } else {
            const usersWithData = users.filter((user) => {
                const hasValidNickname = user.nickname && user.nickname.trim() !== '';

                let hasValidAmount = user.amount || user.amount === 0;
                if (typeof user.amount === 'string') {
                    hasValidAmount = user.amount.trim() !== '';
                }

                return hasValidNickname && hasValidAmount;
            });

            data = {
                charging_rank: usersWithData,
            };
        }

        const result = await requestUpdateSetting(data, type);

        dispatch(stopLoading());
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(login);
        } else if (result.status === 200) {
            alertSuccess(result.message);
        } else {
            alertError(result.error);
        }
    };

    const handleSelectImage = async (e) => {
        dispatch(startLoading());

        const formData = new FormData();
        formData.append('image', e.target.files[0]);

        const result = await requestUploadImage(formData);

        dispatch(stopLoading());
        if (result.status === 200) {
            setBannerUrl(result.data);
        } else {
            alertError(result.error);
        }
    };

    return (
        <div className="wrapper">
            <div className="header">
                <Row>
                    <PageTitle name="Cấu hình chung" />
                </Row>
            </div>
            <div className="content">
                <Row>
                    <Col xl={12}>
                        <Card style={{ borderTop: '3px solid #007bff' }}>
                            <Card.Header>
                                <Card.Title>
                                    <FontAwesomeIcon icon={faGears} />
                                    <span className="ml-3">Danh sách cấu hình</span>
                                </Card.Title>
                            </Card.Header>
                            <Card.Body style={{ padding: 20 }}>
                                <Tabs defaultActiveKey="info">
                                    <Tab eventKey="info" title="Thông tin">
                                        <Row className="mt-xl-5 align-items-center">
                                            <Col xl={6} className="px-0">
                                                <Table bordered>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <Button
                                                                    variant="info"
                                                                    className="mr-5"
                                                                    onClick={() => inputRef.current.click()}
                                                                >
                                                                    Chọn ảnh
                                                                </Button>
                                                                <input
                                                                    type="file"
                                                                    ref={inputRef}
                                                                    onChange={(e) => handleSelectImage(e)}
                                                                    hidden
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Link ảnh banner"
                                                                    value={bannerUrl}
                                                                    onChange={(e) => setBannerUrl(e.target.value)}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>API KEY LOGIN</td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Liên hệ https://t.me/x9cmx để lấy apikey"
                                                                    value={apikeyLogin.api_key}
                                                                    onChange={handleChangeApikey}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Trạng thái</td>
                                                            <td>
                                                                <select value={apikeyLogin.status} disabled className="form-control">
                                                                    <option value={true}>Hoạt động</option>
                                                                    <option value={false}>Không hoạt động</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Lượt dùng</td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={apikeyLogin.use}
                                                                    disabled
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Hết hạn</td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={apikeyLogin.expired_at}
                                                                    disabled
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Col>
                                            <Col xl={6}>
                                                <Table bordered>
                                                    <thead>
                                                        <tr>
                                                            <th>Thông báo</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <MdEditor
                                                                    style={{ height: '350px', width: '100%' }}
                                                                    renderHTML={(text) => mdParser.render(text)}
                                                                    view={{ html: false }}
                                                                    onChange={handleOnChangeEditor}
                                                                    value={notifyText}
                                                                    placeholder="Nhập nội dung thông báo tại đây"
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                        <Row className="mt-5">
                                            <Col xl={12}>
                                                <Button onClick={() => handleUpdateSetting('config')}>Lưu cài đặt</Button>
                                            </Col>
                                        </Row>
                                    </Tab>

                                    <Tab eventKey="rank" title="Top nạp">
                                        <Row className="mt-xl-5">
                                            <Col xl={6} className="px-0">
                                                <Table bordered>
                                                    <thead>
                                                        <tr>
                                                            <th>Nickname</th>
                                                            <th>Lượt dùng</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {users.map((user, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Nhập nickname"
                                                                        value={user.nickname || ''}
                                                                        onChange={(e) =>
                                                                            handleInputChange(index, 'nickname', e.target.value)
                                                                        }
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Nhập lượt dùng"
                                                                        value={user.amount || ''}
                                                                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                <Button
                                                    onClick={addRow}
                                                    size="sm"
                                                    title="Thêm"
                                                    className="mt-2 btn-success"
                                                    style={{ float: 'inline-end' }}
                                                >
                                                    <FontAwesomeIcon icon={faPlusCircle} />
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row className="mt-5">
                                            <Col xl={12}>
                                                <Button onClick={() => handleUpdateSetting('rank')}>Lưu top nạp</Button>
                                            </Col>
                                        </Row>
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Settings;
