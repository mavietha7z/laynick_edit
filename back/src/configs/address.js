const configGetIp = (req) => {
    const address = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;

    return address;
};

export default configGetIp;
