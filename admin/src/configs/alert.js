import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const alertSuccess = (message) => {
    MySwal.fire('THÔNG BÁO', message, 'success');
};

export const alertError = (error) => {
    MySwal.fire('THÔNG BÁO', error || 'Lỗi hệ thống vui lòng thử lại', 'error');
};
