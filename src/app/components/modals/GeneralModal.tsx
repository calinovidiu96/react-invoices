import { Modal, Button } from 'react-bootstrap'

interface GeneralModalProps {
  showGeneralModal: boolean
  handleModalCancel: () => void
  handleModalConfirm: () => void
  title: string
  message: string
  confirmButtonText: string
}

const GeneralModal: React.FC<GeneralModalProps> = ({
  showGeneralModal,
  handleModalCancel,
  handleModalConfirm,
  title,
  message,
  confirmButtonText,
}: GeneralModalProps): React.ReactElement => {
  return (
    <Modal show={showGeneralModal} onHide={handleModalCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="secondary" onClick={handleModalCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleModalConfirm}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default GeneralModal
