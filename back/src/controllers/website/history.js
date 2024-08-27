import { User } from '~/models/user';
import { formatMongoDate } from '~/configs';

const controlGetHistoryPage = async (req, res) => {
    try {
        const { id, membership } = req.user;

        const { history_hacks } = await User.findById(id).select('history_hacks');

        let accounts = history_hacks.map((account) => {
            const { account_id, nickname, status, info, created_at } = account;

            return {
                account_id,
                nickname,
                status,
                info: membership === 'vip' && status === 'success' ? `${info.username}|${info.password}` : null,
                created_at: formatMongoDate(created_at),
            };
        });

        res.render('history.ejs', { accounts });
    } catch (error) {
        res.redirect('/login');
    }
};

export default controlGetHistoryPage;
