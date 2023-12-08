import { useApi } from 'api'
import { Invoice } from 'types'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Spinner } from 'react-bootstrap'

import { calculateVisiblePages } from 'app/utils/calculateVisiblePages'
import CustomPagination from '../CustomPagination'
import Modal from '../modals/GeneralModal'
import CreateInvoiceModal from '../modals/CreateInvoiceModal'

const InvoicesList = (): React.ReactElement => {
  const api = useApi()
  const navigate = useNavigate()

  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [visiblePages, setVisiblePages] = useState<number[]>([])
  const [perPage, setPerPage] = useState<number>(10)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  )
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showFinalizeModal, setShowFinalizeModal] = useState<boolean>(false)
  const [showPayeModal, setShowPayeModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [createInvoiceTrigger, setCreateInvoiceTrigger] = useState(false)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const { data } = await api.getInvoices({
          per_page: perPage,
          page: currentPage,
        })

        setInvoicesList(data.invoices)
        setTotalPages(data.pagination.total_pages)

        const newVisiblePages = calculateVisiblePages(
          currentPage,
          data.pagination.total_pages
        )
        setVisiblePages(newVisiblePages)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [api, currentPage, perPage, createInvoiceTrigger])

  const handleRowClick = (invoiceId: number) => {
    navigate(`/invoice/${invoiceId}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEditClick = (
    invoiceId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation()

    navigate(`/edit-invoice/${invoiceId}`)
  }

  const handleDeleteClick = (
    invoiceId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation()
    setSelectedInvoiceId(invoiceId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    // Call the API to delete the selected invoice
    try {
      await api.deleteInvoice(selectedInvoiceId!)
      // Update the UI, remove the deleted invoice from the list
      setInvoicesList((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice.id !== selectedInvoiceId)
      )
      setShowDeleteModal(false)
      setSelectedInvoiceId(null)
    } catch (error) {
      console.error('Error deleting invoice:', error)
    }
  }

  const handleModalCancel = () => {
    setShowDeleteModal(false)
    setShowFinalizeModal(false)
    setSelectedInvoiceId(null)
    setShowPayeModal(false)
  }

  const handleFinalizeClick = (
    invoiceId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation()
    setSelectedInvoiceId(invoiceId)
    setShowFinalizeModal(true)
  }

  const handlePayClick = (
    invoiceId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation()
    setSelectedInvoiceId(invoiceId)
    setShowPayeModal(true)
  }

  const handleCreateClick = () => {
    setShowCreateModal(true)
  }

  const handleFinalizeConfirm = async () => {
    try {
      const payload = {
        id: selectedInvoiceId!,
        finalized: true,
      }

      // Make an API call to update the invoice as finalized
      await api.putInvoice(payload.id, { invoice: payload })

      // Update the UI to reflect the finalized status
      setInvoicesList((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === selectedInvoiceId
            ? { ...invoice, finalized: true }
            : invoice
        )
      )

      // Close the modal and reset selectedInvoiceId
      setShowFinalizeModal(false)
      setSelectedInvoiceId(null)
    } catch (error) {
      console.error('Error finalizing invoice:', error)
    }
  }

  const handlePayConfirm = async () => {
    try {
      if (!selectedInvoiceId) return

      const payload = {
        id: selectedInvoiceId,
        paid: true,
        finalized: true,
      }

      // Make an API call to update the invoice as paid
      await api.putInvoice(payload.id, { invoice: payload })

      // Update the UI to reflect the paid status
      setInvoicesList((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === selectedInvoiceId
            ? { ...invoice, paid: true, finalized: true }
            : invoice
        )
      )
      // Close the modal and reset selectedInvoiceId
      setShowPayeModal(false)
      setSelectedInvoiceId(null)
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
    }
  }

  return (
    <>
      {loading && (
        <div className="d-flex justify-content-center my-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {!loading && (
        <>
          <div className="col-2 offset-10 d-flex justify-content-between align-items-center my-3">
            <span className="fs-5">Create New Invoice: </span>
            <Button variant="primary" onClick={handleCreateClick}>
              Create
            </Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Total</th>
                <th>Tax</th>
                <th>Finalized</th>
                <th>Paid</th>
                <th>Date</th>
                <th>Deadline</th>
                <th>Actions</th>
                <th>Finalize</th>
                <th>Pay</th>
              </tr>
            </thead>
            <tbody>
              {invoicesList.map((invoice) => (
                <tr key={invoice.id} onClick={() => handleRowClick(invoice.id)}>
                  <td>{invoice.id}</td>
                  <td>
                    {invoice.customer?.first_name} {invoice.customer?.last_name}
                  </td>
                  <td>
                    {invoice.customer?.address}, {invoice.customer?.zip_code}{' '}
                    {invoice.customer?.city}
                  </td>
                  <td>{invoice.total}</td>
                  <td>{invoice.tax}</td>
                  <td>{invoice.finalized ? 'Yes' : 'No'}</td>
                  <td>{invoice.paid ? 'Yes' : 'No'}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.deadline}</td>
                  <td className="d-flex justify-content-between">
                    <Button
                      variant="info"
                      onClick={(event) => handleEditClick(invoice.id, event)}
                      disabled={invoice.finalized}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={(event) => handleDeleteClick(invoice.id, event)}
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    {invoice.finalized ? (
                      <div style={{ textAlign: 'center' }}>
                        <span className="fs-5" style={{ color: 'green' }}>
                          Finalized
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="success"
                        onClick={(event) =>
                          handleFinalizeClick(invoice.id, event)
                        }
                      >
                        Finalize
                      </Button>
                    )}
                  </td>
                  <td>
                    {invoice.paid ? (
                      <div style={{ textAlign: 'center' }}>
                        <span className="fs-5" style={{ color: 'green' }}>
                          Paid
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="success"
                        onClick={(event) => handlePayClick(invoice.id, event)}
                      >
                        Pay
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            visiblePages={visiblePages}
            handlePageChange={handlePageChange}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        </>
      )}

      {/* DELETE modal */}
      <Modal
        showGeneralModal={showDeleteModal}
        handleModalCancel={handleModalCancel}
        handleModalConfirm={handleDeleteConfirm}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice?."
        confirmButtonText="Delete"
      />

      {/* FINALIZE modal */}
      <Modal
        showGeneralModal={showFinalizeModal}
        handleModalCancel={handleModalCancel}
        handleModalConfirm={handleFinalizeConfirm}
        title="Finalize Invoice"
        message="Are you sure you want to Finalize this invoice?."
        confirmButtonText="Finalize"
      />

      {/* PAY modal */}
      <Modal
        showGeneralModal={showPayeModal}
        handleModalCancel={handleModalCancel}
        handleModalConfirm={handlePayConfirm}
        title="Pay Invoice"
        message="Are you sure you want to Pay this invoice?."
        confirmButtonText="Pay"
      />

      <CreateInvoiceModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onSuccess={() => setCreateInvoiceTrigger((prevState) => !prevState)}
      />
    </>
  )
}

export default InvoicesList
