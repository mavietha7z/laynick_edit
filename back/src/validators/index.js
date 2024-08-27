import { isValidMongoId } from '~/configs';

const validatorMongoId = (req, res, next) => {
    const { id } = req.query;

    if (!isValidMongoId(id)) {
        return res.status(400).json({
            error: 'Tham số truy vấn không hợp lệ',
        });
    }

    next();
};

const isNaN = (x) => {
    x = Number(x);
    return x != x;
};

const validatorCheckPages = (req, res, next) => {
    const { page, type } = req.query;

    if (type === 'tab') {
        return next();
    }

    if (!page) {
        return res.status(400).json({
            error: 'Tham số truy vấn không hợp lệ',
        });
    }

    const numberPage = Number(page);
    if (numberPage < 1 || typeof numberPage !== 'number' || isNaN(numberPage)) {
        return res.status(400).json({
            error: 'Tham số truy vấn không hợp lệ',
        });
    }

    req.page = numberPage;
    next();
};

export { validatorMongoId, validatorCheckPages };
