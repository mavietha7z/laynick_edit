import { User } from '~/models/user';
import { formatMongoDate } from '~/configs';

const controlGetAccountPage = async (req, res) => {
    try {
        const result = await User.findById(req.user.id).select('-_id full_name username ip created_at');

        const user = {
            full_name: result.full_name,
            username: result.username,
            ip: result.ip,
            created_at: formatMongoDate(result.created_at),
        };

        res.render('account', { user });
    } catch (error) {
        res.redirect('/login');
    }
};

export default controlGetAccountPage;
