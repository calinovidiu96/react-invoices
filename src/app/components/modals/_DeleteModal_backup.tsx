import { Modal, Button } from 'react-bootstrap'

interface DeleteModalProps {
  showDeleteModal: boolean
  handleDeleteCancel: () => void
  handleDeleteConfirm: () => void
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  showDeleteModal,
  handleDeleteCancel,
  handleDeleteConfirm,
}: DeleteModalProps): React.ReactElement => {
  return (
    <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this invoice?</Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="secondary" onClick={handleDeleteCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteModal
