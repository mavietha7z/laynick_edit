import { isValidMongoId } from '~/configs';
import { Product } from '~/models/product';

const controlDestroyProduct = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id || !isValidMongoId(id)) {
            return res.status(400).json({
                error: 'ID sản phẩm không hợp lệ',
            });
        }

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                error: 'Không tìm thấy sản phẩm cần xoá',
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Xoá sản phẩm thành công',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlDestroyProduct;
