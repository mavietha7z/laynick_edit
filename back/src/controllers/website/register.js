const controlGetRegisterPage = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        res.redirect('/login');
    }
};

export default controlGetRegisterPage;
