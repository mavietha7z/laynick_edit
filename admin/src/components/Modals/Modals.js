import { Button, Modal } from 'react-bootstrap';

function Modals({ show, setShow, name = '', onClick }) {
    return (
        <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>Xác nhận xóa</Modal.Title>
            </Modal.Header>
            <Modal.Body className="my-4">Delete: {name}</Modal.Body>
            <Modal.Footer>
                <Button size="sm" variant="secondary" onClick={() => setShow(false)}>
                    Đóng
                </Button>
                <Button size="sm" variant="danger" onClick={onClick}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Modals;
