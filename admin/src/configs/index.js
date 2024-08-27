import routes from './routes';
import sidebar from './sidebar';

const config = {
    routes,
    sidebar,
};

export const convertCurrency = (number) => {
    let check = typeof number === 'number' ? true : false;

    return check ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ' : 'Null';
};

export default config;
