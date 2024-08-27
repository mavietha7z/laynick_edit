import { useDispatch } from 'react-redux';
import { closeSidebar } from '~/redux/reducer/module';

function Overlay() {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeSidebar());
        document.body.classList.remove('open');
    };

    return <div className="overlay" onClick={handleClose}></div>;
}

export default Overlay;
