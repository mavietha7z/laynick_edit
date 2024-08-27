import md5 from 'md5';
import axios from 'axios';
import mongoose from 'mongoose';

export const isValidMongoId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

export const convertCurrency = (number) => {
    let check = typeof number === 'number' ? true : false;

    return check ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0đ';
};

export const addDaysToCurrentDate = (currentDate, days) => {
    currentDate.setDate(currentDate.getDate() + days);

    return currentDate.toISOString();
};

export const formatMongoDate = (date) => {
    if (!date) return '';

    const dateObj = new Date(date);

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
};

export const generateRequestId = () => {
    const number = Math.floor(Math.random() * 999999999) + 1;
    return number.toString();
};

export const postCard = async (telco, code, serial, amount, partner_id, partner_key, partner_url) => {
    const data = {
        telco,
        code,
        serial,
        amount,
        request_id: generateRequestId(),
        partner_id,
        sign: md5(partner_key + code + serial),
        command: 'charging',
    };

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: partner_url,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
    };

    const result = await axios(config);
    return result.data;
};

export const urlApiKeyLogin = 'https://thegioicode.vn/api/v2';
