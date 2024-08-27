import { User } from '~/models/user';
import { convertCurrency } from '~/configs';

const controlGetMenuPage = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id).select('wallet membership');
        const data = {
            wallet: convertCurrency(user.wallet),
            membership: user.membership === 'vip' ? 'VIP' : 'Mặc định',
        };

        res.render('menu', { data });
    } catch (error) {
        res.redirect('/login');
    }
};

export default controlGetMenuPage;
