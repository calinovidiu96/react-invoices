import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Container, Row, Col, Table, Alert, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { PDFDownloadLink } from '@react-pdf/renderer'

import InvoicePDF from 'app/utils/InvoicePDF'
import { useApi } from 'api'
import { Invoice } from 'types'
import generateFileName from 'app/utils/generateFileName'

const DisplayField: React.FC<{
  label: string
  value: string | number | boolean
}> = ({ label, value }) => (
  <Row className="mb-3">
    <Col md={3}>
      <strong>{label}:</strong>
    </Col>
    <Col md={9}>
      <span>{value}</span>
    </Col>
  </Row>
)

const DisplayCustomerDetails: React.FC<{
  customer: Invoice['customer']
}> = ({ customer }) => (
  <>
    <h4>Customer Details</h4>
    <DisplayField label="First Name" value={customer?.first_name || ''} />
    <DisplayField label="Last Name" value={customer?.last_name || ''} />
    <DisplayField label="Address" value={customer?.address || ''} />
    <DisplayField label="Zip Code" value={customer?.zip_code || ''} />
    <DisplayField label="City" value={customer?.city || ''} />
    <DisplayField label="Country" value={customer?.country || ''} />
  </>
)

const DisplayInvoiceLines: React.FC<{ lines: Invoice['invoice_lines'] }> = ({
  lines,
}) => (
  <>
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
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => (
          <tr key={line.id}>
            <td>{line.product.label}</td>
            <td>{line.quantity}</td>
            <td>{line.product.unit}</td>
            <td>{line.product.unit_price_without_tax}</td>
            <td>{line.product.vat_rate}</td>
            <td>{line.product.unit_tax}</td>
            <td>{line.product.unit_price}</td>
            <td>{line.price}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
)

const InvoiceShow = () => {
  const { id } = useParams<{ id: string }>()
  const api = useApi()
  const navigate = useNavigate()

  const [invoiceData, setInvoiceData] = useState<Invoice | undefined>()

  const fileName = generateFileName(String(invoiceData?.id))

  useEffect(() => {
    api.getInvoice(id).then(({ data }) => {
      setInvoiceData(data)
    })
  }, [api, id])

  const handleEditInvoice = () => {
    navigate(`/edit-invoice/${id}`)
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">View Invoice with ID: {invoiceData?.id}</h2>

      {invoiceData && (
        <>
          <Row>
            <Col md={6}>
              <DisplayField
                label="Finalized"
                value={invoiceData.finalized ? 'Yes' : 'No'}
              />
              <DisplayField
                label="Paid"
                value={invoiceData.paid ? 'Yes' : 'No'}
              />
              <DisplayField label="Date" value={invoiceData.date || ''} />
              <DisplayField
                label="Deadline"
                value={invoiceData.deadline || ''}
              />
              <DisplayField label="Total" value={invoiceData.total || ''} />
              <DisplayField label="Tax" value={invoiceData.tax || ''} />
            </Col>
            <Col md={6}>
              <DisplayCustomerDetails customer={invoiceData.customer} />
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end">
              <PDFDownloadLink
                document={<InvoicePDF invoiceData={invoiceData} />}
                fileName={fileName}
              >
                {({ blob, url, loading, error }) => (
                  <Button variant="success" disabled={loading}>
                    {loading ? 'Loading document...' : 'Download PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <DisplayInvoiceLines lines={invoiceData.invoice_lines} />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              {invoiceData.finalized ? (
                <Alert variant="info" className="mb-3">
                  Invoice already finalized. You can't edit it.
                </Alert>
              ) : (
                <div>
                  <p>You can edit this invoice.</p>
                  <Button variant="primary" onClick={() => handleEditInvoice()}>
                    Edit Invoice
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default InvoiceShow
