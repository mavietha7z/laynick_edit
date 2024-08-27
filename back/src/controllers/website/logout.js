const controlGetLogoutPage = (req, res) => {
    try {
        res.clearCookie('session_key').redirect('/login');
    } catch (error) {
        res.redirect('/login');
    }
};
export default controlGetLogoutPage;
