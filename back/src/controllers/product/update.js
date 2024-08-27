import { isValidMongoId } from '~/configs';
import { Product } from '~/models/product';

const controlUpdateProduct = async (req, res) => {
    try {
        const { id, type } = req.query;

        if (id && !isValidMongoId(id)) {
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

        if (type && id && type === 'status') {
            await product.updateOne({ status: !product.status });
        } else if (type && id && type === 'hacked') {
            await product.updateOne({ hacked: !product.hacked });
        } else {
            await product.updateOne(req.body);
        }

        res.status(200).json({
            status: 200,
            message: 'Cập nhật sản phẩm thành công',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlUpdateProduct;
