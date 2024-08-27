import routes from './routes';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { faGauge, faUsers, faCubes, faGears, faChartColumn } from '@fortawesome/free-solid-svg-icons';

const { home, users, partners, settings, chargings, products } = routes;

const sidebar = [
    {
        title: 'Bảng quản trị',
        path: home,
        icon: faGauge,
        sub: null,
    },
    {
        title: 'Sản phẩm',
        path: null,
        icon: faProductHunt,
        sub: [
            {
                title: 'Danh sách',
                path: products,
            },
        ],
    },
    {
        title: 'Thống kê',
        path: null,
        icon: faChartColumn,
        sub: [
            {
                title: 'Đổi thẻ',
                path: chargings,
            },
        ],
    },
    {
        title: 'Tài khoản',
        path: null,
        icon: faUsers,
        sub: [
            {
                title: 'Danh sách',
                path: users,
            },
        ],
    },
    {
        title: 'Đối tác',
        path: null,
        icon: faCubes,
        sub: [
            {
                title: 'Danh sách',
                path: partners,
            },
        ],
    },
    {
        title: 'Hệ thống',
        path: null,
        icon: faGears,
        sub: [
            {
                title: 'Cài đặt',
                path: settings,
            },
        ],
    },
];

export default sidebar;
