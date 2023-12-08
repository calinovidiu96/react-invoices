import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap'

import { useApi } from 'api'
import { Invoice, Product, Customer } from 'types'
import CustomerAutocomplete from '../CustomerAutocomplete'
import ProductAutocomplete from '../ProductAutocomplete'
import ConfirmModal from '../modals/GeneralModal'

interface UpdateInvoiceLine {
  id?: number
  _destroy?: boolean
  product_id: number
  quantity: number
  label: string
  unit: 'hour' | 'day' | 'piece'
  vat_rate: '0' | '5.5' | '10' | '20'
  price: string | number
  tax: string | number
}

interface InvoiceUpdateRequest {
  id: number
  customer_id: number
  finalized: boolean
  paid: boolean
  date: string
  deadline: string
  invoice_lines_attributes: UpdateInvoiceLine[]
}

const InvoiceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const api = useApi()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [editedInvoice, setEditedInvoice] = useState<any>(null)
  const [newProducts, setNewProducts] = useState<UpdateInvoiceLine[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    api.getInvoice(id).then(({ data }) => {
      setEditedInvoice(data)
    })
  }, [api, id])

  useEffect(() => {
    if (editedInvoice?.customer) {
      setCustomer(editedInvoice.customer)
    }
  }, [editedInvoice])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target
    setEditedInvoice((prevInvoice: Invoice | undefined) => ({
      ...prevInvoice!,
      [name]: value,
    }))
  }

  const handleAddRow = () => {
    if (product) {
      const newProduct: UpdateInvoiceLine = {
        product_id: product.id,
        quantity: quantity,
        unit: product.unit,
        label: product.label,
        vat_rate: product.vat_rate,
        price: Number(product.unit_price),
        tax: Number(product.unit_tax),
      }

      // Append the new product to the invoice lines
      setNewProducts((prevProducts) => [...prevProducts, newProduct])

      // Reset the product state to null
      setProduct(null)
      setQuantity(1)
    }
  }

  const createInvoiceUpdatePayload = () => {
    // Validate required fields
    if (
      !editedInvoice ||
      !editedInvoice.customer_id ||
      !editedInvoice.date ||
      !editedInvoice.deadline
    ) {
      alert(
        'Please fill in all required fields (Customer, Date, and Deadline).'
      )
      return null
    }

    // Create an array for invoice lines from both old and new products
    const invoiceLines = [
      ...(editedInvoice.invoice_lines || []),
      ...newProducts.map((newProduct) => ({
        id: newProduct.id || undefined,
        _destroy: newProduct._destroy || false,
        product_id: newProduct.product_id,
        quantity: newProduct.quantity,
        label: newProduct.label,
        unit: newProduct.unit,
        vat_rate: newProduct.vat_rate,
        price: newProduct.price,
        tax: newProduct.tax,
      })),
    ]

    // Create the payload
    const payload: InvoiceUpdateRequest = {
      id: editedInvoice.id,
      customer_id: editedInvoice.customer_id,
      finalized: editedInvoice.finalized || false,
      paid: editedInvoice.paid || false,
      date: editedInvoice.date,
      deadline: editedInvoice.deadline,
      invoice_lines_attributes: invoiceLines,
    }

    return payload
  }

  const handleSaveChanges = async () => {
    const payload = createInvoiceUpdatePayload()

    if (payload) {
      try {
        const response = await api.putInvoice(payload.id, { invoice: payload })

        if (response.status === 200) {
          // Update the editedInvoice state with the received data
          setEditedInvoice(response.data)
          setNewProducts([])
          navigate(`/invoice/${editedInvoice.id}`)
        } else {
          console.error('Failed to update invoice:', response)
        }
      } catch (error) {
        console.error('Error creating invoice:', error)
      }
    }
  }

  const handleRemoveOldRow = (index: number) => {
    setEditedInvoice((prevInvoice: any) => {
      if (prevInvoice && prevInvoice.invoice_lines) {
        const updatedInvoiceLines = prevInvoice.invoice_lines.map(
          (line: any, i: any) => {
            if (i === index) {
              // Toggle _destroy between true and false
              return { ...line, _destroy: !line._destroy }
            }
            return line
          }
        )

        return {
          ...prevInvoice,
          invoice_lines: updatedInvoiceLines,
        }
      }

      return prevInvoice
    })
  }

  const setCustomerHandler = (selectedCustomer: Customer | null) => {
    setCustomer(selectedCustomer)

    // Update customer and customer_id in editedInvoice
    setEditedInvoice((prevInvoice: Invoice) => {
      if (!prevInvoice) {
        return prevInvoice
      }

      return {
        ...prevInvoice,
        customer: selectedCustomer || undefined,
        customer_id: selectedCustomer?.id ?? null,
      }
    })
  }

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleModalCancel = () => {
    setShowModal(false)
  }

  const handleModalConfirm = () => {
    handleSaveChanges()
    setShowModal(false)
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Edit Invoice with ID: {id}</h2>

      {editedInvoice && (
        <>
          <Row className="d-flex justify-content-between">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={editedInvoice.date || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="date"
                  name="deadline"
                  value={editedInvoice.deadline || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="customer" className="mb-3">
                <Form.Label>Customer</Form.Label>
                <CustomerAutocomplete
                  value={customer}
                  onChange={setCustomerHandler}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <h4>Products</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Unit Price (Without Tax)</th>
                    <th>VAT Rate</th>
                    <th>Unit Tax</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {editedInvoice.invoice_lines &&
                    editedInvoice.invoice_lines.map((line: any, index: any) => (
                      <tr key={index}>
                        <td className={line._destroy ? 'bg-danger' : ''}>
                          {line.label}
                        </td>
                        <td className={line._destroy ? 'bg-danger' : ''}>
                          {line.quantity}
                        </td>
                        <td className={line._destroy ? 'bg-danger' : ''}>
                          {line.unit}
                        </td>
                        <td className={line._destroy ? 'bg-danger' : ''}>
                          {line.price}
                        </td>
                        <td className={line._destroy ? 'bg-danger' : ''}>
                          {line.vat_rate}
                        </td>
                        <td className={line._destroy ? 'bg-danger' : ''}>
                          {line.tax}
                        </td>
                        <td className={line._destroy ? 'bg-danger' : ''}>
                          {line.price}
                        </td>
                        <td className={line._destroy ? 'bg-danger' : ''}>
                          {line.price}
                        </td>
                        <td className={line._destroy ? 'bg-danger' : ''}>
                          <Button
                            variant={line._destroy ? 'primary' : 'danger'}
                            size="sm"
                            onClick={() => {
                              handleRemoveOldRow(index)
                            }}
                          >
                            {line._destroy ? 'Undo' : 'Delete'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          <Row>
            <Col>
              <h4 className="mt-4">Add new products</h4>
              <Form.Group controlId="product" className="mb-3">
                <div className="d-flex align-items-center">
                  <div className="me-2 col-7">
                    <Form.Label className="me-2">Product</Form.Label>
                    <ProductAutocomplete
                      value={product}
                      onChange={(selectedProduct) =>
                        setProduct(selectedProduct)
                      }
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
                  <div className="col-2 ms-3 mt-4 pt-2 d-flex justify-content-center">
                    <Button variant="primary" onClick={handleAddRow}>
                      Add Product
                    </Button>
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>

          {newProducts.length > 0 ? (
            <Row className="mt-4">
              <Col>
                <h4>New Products</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Unit Price (Without Tax)</th>
                      <th>VAT Rate</th>
                      <th>Unit Tax</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newProducts.map((line, index) => (
                      <tr key={index}>
                        <td style={{ backgroundColor: '#9AFFB5' }}>
                          {line.label}
                        </td>
                        <td style={{ backgroundColor: '#9AFFB5' }}>
                          {line.quantity}
                        </td>
                        <td style={{ backgroundColor: '#9AFFB5' }}>
                          {line.unit}
                        </td>
                        <td style={{ backgroundColor: '#9AFFB5' }}>
                          {line.price}
                        </td>
                        <td style={{ backgroundColor: '#9AFFB5' }}>
                          {line.vat_rate}
                        </td>
                        <td style={{ backgroundColor: '#9AFFB5' }}>
                          {line.tax}
                        </td>
                        <td style={{ backgroundColor: '#9AFFB5' }}>
                          {line.price}
                        </td>
                        <td style={{ backgroundColor: '#9AFFB5' }}>
                          {line.price}
                        </td>
                        <td style={{ backgroundColor: '#9AFFB5' }}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setNewProducts((prevProducts) =>
                                prevProducts.filter((_, i) => i !== index)
                              )
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          ) : null}

          <Row className="mt-4">
            <Col>
              <Button variant="primary" onClick={handleShowModal}>
                Save Changes
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => navigate(`/invoice/${id}`)}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </>
      )}

      <ConfirmModal
        showGeneralModal={showModal}
        handleModalCancel={handleModalCancel}
        handleModalConfirm={handleModalConfirm}
        title="Confirm changes"
        message="Are you sure you want to edit the invoice?"
        confirmButtonText="Confirm"
      />
    </Container>
  )
}

export default InvoiceEdit
