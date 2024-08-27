const controlCheckStatus = (data, desc) => {
    let message, status, description, res_status, res_message;

    switch (data) {
        case 1:
            status = 1;
            message = 'Thẻ đúng';
            description = desc;
            res_status = 200;
            res_message = 'Thẻ nạp đúng vui lòng chờ cộng tiền';
            break;
        case 2:
            status = 2;
            message = 'Sai mệnh giá';
            description = desc;
            res_status = 200;
            res_message = 'Thẻ nạp sai mệnh giá vui lòng nạp lại';
            break;
        case 3:
            status = 3;
            message = 'Thẻ lỗi';
            description = desc;
            res_status = 400;
            res_message = 'Thẻ nạp sai vui lòng nạp lại';
            break;
        case 4:
            status = 4;
            message = 'Bảo trì';
            description = desc;
            res_status = 400;
            res_message = 'Máy chủ bảo trì vui lòng nạp lại';
            break;
        case 99:
            status = 99;
            message = 'Thẻ chờ';
            description = desc;
            res_status = 200;
            res_message = 'Thẻ nạp đang chờ xử lý vui lòng chờ';
            break;
        case 102:
            status = 102;
            message = 'Lỗi API';
            description = 'Đối tác đổi thẻ không tồn tại hoặc đã bị tắt nên thẻ chưa được xử lý';
            res_status = 400;
            res_message = 'Máy chủ bảo trì vui lòng nạp lại';
            break;
        case 400:
            status = 400;
            message = 'SPAM';
            description = desc;
            res_status = 400;
            res_message = 'Bạn đã bị chặn do nạp thẻ sai';
            break;
        case 100:
            status = 100;
            message = 'Lỗi gửi thẻ';
            description = desc;
            res_status = 400;
            res_message = 'Lỗi gửi thẻ lên máy chủ vui lòng thử lại';
            break;
        default:
            status = 100;
            message = 'Lỗi gửi thẻ';
            description = 'Lỗi gửi thẻ do đối tác đã tắt hoặc chặn không cho xử lý thẻ';
            res_status = 400;
            res_message = 'Lỗi gửi thẻ lên máy chủ vui lòng thử lại';
    }

    return {
        status,
        message,
        description,
        res_status,
        res_message,
    };
};

export default controlCheckStatus;
