import { isValidMongoId } from '~/configs';
import { Product } from '~/models/product';

const controlGetProducts = async (req, res) => {
    try {
        const { id } = req.query;

        if (id && isValidMongoId(id)) {
            const data = await Product.findById(id).select('title price old_price times_used description');
            if (!data) {
                return res.status(404).json({
                    error: 'Sản phẩm cần tìm không tồn tại',
                });
            }

            return res.status(200).json({
                status: 200,
                data,
            });
        }

        const data = await Product.find({}).select('title price old_price times_used hacked status created_at').sort({ created_at: -1 });

        res.status(200).json({
            status: 200,
            data,
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlGetProducts;
