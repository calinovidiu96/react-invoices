import { useState, useEffect } from 'react'
import { Modal, Button, Form, Table } from 'react-bootstrap'
import { Customer, Product, Invoice } from 'types'
import { useApi } from 'api'

import CustomerAutocomplete from '../CustomerAutocomplete'
import ProductAutocomplete from '../ProductAutocomplete'

interface InvoiceLine {
  product_id: number
  quantity: number
  label: string
  unit: 'hour' | 'day' | 'piece'
  vat_rate: '0' | '5.5' | '10' | '20'
  price: string | number
  tax: string | number
}

interface InvoiceFormData {
  customer_id: number
  date: string
  deadline: string
  finalized: boolean
  paid: boolean
  invoice_lines_attributes: InvoiceLine[]
}

interface BaseInvoicePayload {
  customer_id: number
  date: string
  deadline: string
  finalized: boolean
  paid: boolean
  invoice_lines_attributes: InvoiceLine[]
}

interface CreateInvoicePayload {
  invoice: BaseInvoicePayload
}

interface UpdateInvoicePayload extends CreateInvoicePayload {
  invoice: BaseInvoicePayload & { id: number }
}

interface InvoiceFormModalProps {
  show: boolean
  handleClose: () => void
  onSuccess: () => void
  invoiceData: Invoice | null | undefined
}

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  show,
  handleClose,
  onSuccess,
  invoiceData,
}) => {
  const api = useApi()

  const [formData, setFormData] = useState<InvoiceFormData>({
    customer_id: 0,
    date: '',
    deadline: '',
    finalized: false,
    paid: false,
    invoice_lines_attributes: [],
  })
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)

  useEffect(() => {
    // If editing, populate the form data with the existing invoice data
    if (invoiceData) {
      setCustomer(invoiceData.customer || null)

      const dataToSet: InvoiceFormData = {
        customer_id: invoiceData.customer_id as number,
        date: invoiceData.date as string,
        deadline: invoiceData.deadline as string,
        finalized: invoiceData.finalized,
        paid: invoiceData.paid,
        invoice_lines_attributes: [...invoiceData.invoice_lines],
      }

      setFormData(dataToSet)
    }
  }, [invoiceData])

  useEffect(() => {
    // Update formData.customer_id when customer state changes
    if (customer) {
      setFormData((prevData) => ({
        ...prevData,
        customer_id: customer.id,
      }))
    }
  }, [customer])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevData: InvoiceFormData) => ({ ...prevData, [name]: value }))
  }

  const handleAddRow = () => {
    if (product) {
      setFormData((prevData: InvoiceFormData) => {
        const newInvoiceLines: InvoiceLine[] = [
          ...prevData.invoice_lines_attributes,
          {
            product_id: product.id,
            quantity: quantity,
            label: product.label,
            unit: product.unit,
            vat_rate: product.vat_rate,
            price: Number(product.unit_price),
            tax: Number(product.unit_tax),
          },
        ]

        return {
          ...prevData,
          invoice_lines_attributes: newInvoiceLines,
        }
      })

      // Reset the product state to null
      setProduct(null)
      setQuantity(1)
    }
  }

  const handleRemoveRow = (index: number) => {
    setFormData((prevData: InvoiceFormData) => {
      const newLines = [...prevData.invoice_lines_attributes]
      newLines.splice(index, 1)
      return { ...prevData, invoice_lines_attributes: newLines }
    })
  }

  const handleCreateOrUpdate = async () => {
    // Validate required fields
    if (
      !formData.customer_id ||
      !formData.date ||
      !formData.deadline ||
      formData.invoice_lines_attributes.length === 0
    ) {
      alert(
        'Please fill in all required fields (Customer, Date, Deadline, and at least one product).'
      )
      return
    }

    // Validate deadline is greater than or equal to date
    if (new Date(formData.deadline) < new Date(formData.date)) {
      alert('Deadline must be greater than or equal to the Date.')
      return
    }

    // Create the payload in the format expected by the API
    const basePayload: CreateInvoicePayload['invoice'] = {
      customer_id: formData.customer_id,
      date: formData.date,
      deadline: formData.deadline,
      finalized: formData.finalized,
      paid: formData.paid,
      invoice_lines_attributes: formData.invoice_lines_attributes.map(
        (product) => ({
          product_id: product.product_id,
          quantity: product.quantity,
          label: product.label,
          unit: product.unit,
          vat_rate: product.vat_rate,
          price: product.price,
          tax: product.tax,
        })
      ),
    }

    try {
      // Determine whether to create or update based on the presence of invoiceData
      let response

      if (invoiceData && invoiceData.id) {
        const payload: UpdateInvoicePayload = {
          invoice: {
            ...basePayload,
            id: invoiceData.id,
          },
        }

        response = await api.putInvoice(invoiceData.id, payload)
      } else {
        const payload: CreateInvoicePayload = {
          invoice: basePayload,
        }

        response = await api.postInvoices(null, payload)
      }

      if (response?.status === 200) {
        onSuccess()
      }

      // Clear the form data and close the modal
      setFormData({
        customer_id: 0,
        date: '',
        deadline: '',
        finalized: false,
        paid: false,
        invoice_lines_attributes: [],
      })

      setCustomer(null) // Reset the selected customer
      setProduct(null) // Reset the selected product
      handleClose()
    } catch (error) {
      console.error('Error creating/updating invoice:', error)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{invoiceData ? 'Edit' : 'Create'} Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="date" className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="deadline" className="mb-3">
            <Form.Label>Deadline</Form.Label>
            <Form.Control
              type="date"
              name="deadline"
              value={formData.deadline || ''}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="customer" className="mb-3">
            <Form.Label>Customer</Form.Label>
            <CustomerAutocomplete
              value={customer}
              onChange={(selectedCustomer) => setCustomer(selectedCustomer)}
            />
          </Form.Group>

          <Form.Group controlId="product" className="mb-3">
            <div className="d-flex align-items-center">
              <div className="me-2 col-9">
                <Form.Label className="me-2">Product</Form.Label>

                <ProductAutocomplete
                  value={product}
                  onChange={(selectedProduct) => setProduct(selectedProduct)}
                />
              </div>
              <div className="col-3">
                <Form.Label className="me-2">Quantity:</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  name="quantity"
                />
              </div>
            </div>
          </Form.Group>

          <div className="my-3">
            <Button variant="primary" onClick={handleAddRow}>
              Add Product
            </Button>
          </div>

          {formData.invoice_lines_attributes.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.invoice_lines_attributes.map(
                  (line: InvoiceLine, index: number) => (
                    <tr key={index}>
                      <td>{line.label}</td>
                      <td>{line.quantity}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleRemoveRow(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          )}

          <Button
            variant="primary"
            className="mt-3"
            onClick={handleCreateOrUpdate}
          >
            {invoiceData ? 'Update' : 'Create'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default InvoiceFormModal
