import config from '~/configs';
import Home from '~/layouts/Home';
import Users from '~/pages/Users';
import Settings from '~/pages/Settings';
import Partners from '~/pages/Partners';
import Products from '~/pages/Products';
import NotFound from '~/layouts/NotFound';
import Chargings from '~/pages/Chargings';
import Login from '~/layouts/components/Login';
import UpdatePartner from '~/pages/Partners/Update';
import CreatePartner from '~/pages/Partners/Create';
import CreateProduct from '~/pages/Products/Create';
import UpdateProduct from '~/pages/Products/Update';

const { home, users, login, partners, settings, chargings, create, products } = config.routes;

const privateRoutes = [
    { path: home, component: Home },
    { path: users, component: Users },
    { path: settings, component: Settings },
    { path: partners, component: Partners },
    { path: products, component: Products },
    { path: chargings, component: Chargings },
    { path: login, component: Login, layout: null },
    { path: '*', component: NotFound, layout: null },
    { path: partners + create, component: CreatePartner },
    { path: products + create, component: CreateProduct },
    { path: partners + '/edit/:id', component: UpdatePartner },
    { path: products + '/edit/:id', component: UpdateProduct },
];

export { privateRoutes };
