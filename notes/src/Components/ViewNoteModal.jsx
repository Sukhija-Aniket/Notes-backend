import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ViewNoteModal(props) {
  // Destructure props for easier access to individual properties
  const { show, onHide, note } = props;
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {note?.title || 'Note Title'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{note?.content || 'Note content will appear here.'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewNoteModal;
