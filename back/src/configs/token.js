import jwt from 'jsonwebtoken';

// Tạo token user
export const generateAccessTokenUser = (user) => {
    return jwt.sign(
        {
            id: user._id,
            admin: user.admin,
            wallet: user.wallet,
            status: user.status,
            full_name: user.full_name,
            membership: user.membership,
        },
        'jwt-session_key-user',
        {
            expiresIn: '365d',
        },
    );
};
