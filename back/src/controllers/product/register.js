import { User } from '~/models/user';
import { isValidMongoId } from '~/configs';
import { Product } from '~/models/product';

const controlRegisterProduct = async (req, res) => {
    try {
        const { product_id: id } = req.body;

        if (!id || !isValidMongoId(id)) {
            return res.status(400).json({
                error: 'ID sản phẩm không hợp lệ',
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                error: 'Sản phẩm không tồn tại',
            });
        }

        const user = await User.findById(req.user.id).select('carts wallet');
        if (user.wallet < product.price) {
            return res.status(200).json({
                status: 400,
                message: 'Số dư của bạn không đủ!',
            });
        }

        const carts = {
            product_id: product._id,
            used: product.times_used,
        };

        const wallet = user.wallet - product.price;

        await user.updateOne({ carts, wallet, membership: 'vip' });

        res.status(200).json({
            status: 200,
            message: 'Đăng ký sản phẩm thành công',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlRegisterProduct;
