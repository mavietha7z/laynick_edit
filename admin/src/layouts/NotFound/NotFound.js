import config from '~/configs';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    useEffect(() => {
        document.title = 'Trang không tồn tại - Quản trị website';
    }, []);

    return (
        <div className="not-found">
            <div className="found-content">
                <h2 className="error-4xx-code">&nbsp;</h2>
                <h1 className="error-4xx-title">Không tìm thấy nội dung 😓</h1>
                <ul>
                    <li className="suggestion">
                        <p>
                            URL của nội dung này đã <strong>bị thay đổi</strong> hoặc <strong>không còn tồn tại</strong>
                        </p>
                    </li>
                    <li className="suggestion">
                        <p>
                            Nếu bạn <strong>đang lưu URL này</strong>, hãy thử
                            <strong> truy cập lại từ trang chủ</strong> thay vì dùng URL đã lưu
                        </p>
                    </li>
                </ul>
                <p>
                    <Link className="back-home" to={config.routes.home}>
                        QUAY LẠI TRANG CHỦ
                    </Link>
                </p>
            </div>
            <div className="copyright">© 2010 - 2023 All rights reserved</div>
        </div>
    );
}

export default NotFound;
