const validatorLoginUser = async (req, res, next) => {
    const { username, password } = req.body;

    const usernameRegex = /^[a-z][a-z0-9]{3,19}$/;
    const passwordRegex = /^.{6,20}$/;

    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            error: 'Username không đúng định dạng',
        });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: 'Password không đúng định dạng',
        });
    }

    next();
};

export default validatorLoginUser;
