import path from 'path';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationFolder = path.join(process.cwd(), '/src/assets');

        if (!existsSync(destinationFolder)) {
            mkdirSync(destinationFolder, { recursive: true });
        }
        cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname);

        cb(null, fileName);
    },
});

const upload = multer({ storage });

const controlUploadImage = (req, res) => {
    try {
        upload.single('image')(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    error: 'Lỗi lưu ảnh khi lấy đường dẫn',
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    error: 'Vui lòng gửi ảnh cần lấy đường dẫn lên',
                });
            }
            const data = `http://${req.headers.host}/images/${req.file.filename}`;

            res.status(200).json({
                status: 200,
                data,
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống vui lòng thử lại sau' });
    }
};

export default controlUploadImage;
