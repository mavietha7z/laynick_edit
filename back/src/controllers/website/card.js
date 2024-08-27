import { User } from '~/models/user';
import { convertCurrency, formatMongoDate } from '~/configs';

function parseDate(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
}

const controlGetCardPage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('chargings')
            .populate({ path: 'chargings', select: 'telco declared_value code serial status message created_at' });

        const chargings = user.chargings
            .map((charging) => {
                const { telco, declared_value, code, serial, status, message, created_at } = charging;

                return {
                    telco,
                    amount: convertCurrency(declared_value),
                    code,
                    serial,
                    status,
                    message,
                    created_at: formatMongoDate(created_at),
                };
            })
            .sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at));

        res.render('card', { chargings });
    } catch (error) {
        res.redirect('/login');
    }
};

export default controlGetCardPage;
