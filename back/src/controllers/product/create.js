import { Product } from '~/models/product';

const controlCreateProduct = async (req, res) => {
    try {
        const { title, price, old_price, times_used, description } = req.body;

        if (!title) {
            return res.status(400).json({
                error: 'Tên sản phẩm không hợp lệ',
            });
        }
        if (!price) {
            return res.status(400).json({
                error: 'Giá sản phẩm không hợp lệ',
            });
        }
        if (!old_price) {
            return res.status(400).json({
                error: 'Giá cũ sản phẩm không hợp lệ',
            });
        }
        if (!times_used) {
            return res.status(400).json({
                error: 'Số lần sử dụng không hợp lệ',
            });
        }
        if (description.length < 1) {
            return res.status(400).json({
                error: 'Mô tả sản phẩm không hợp lệ',
            });
        }

        await new Product({
            title,
            price,
            old_price,
            times_used,
            description,
        }).save();

        res.status(200).json({
            status: 200,
            message: 'Tạo sản mới phẩm thành công',
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlCreateProduct;
