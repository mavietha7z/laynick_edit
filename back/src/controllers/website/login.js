const controlGetLoginPage = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        res.render('login');
    }
};

export default controlGetLoginPage;
