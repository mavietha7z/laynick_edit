import { User } from '~/models/user';

const controlWalletUser = async (id, amount) => {
    const user = await User.findById(id);

    const wallet = user.wallet + Number(amount);

    await user.updateOne({ wallet });
};

export default controlWalletUser;
