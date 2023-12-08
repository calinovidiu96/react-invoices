import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { Invoice } from 'types'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
  },
  table: {
    flexDirection: 'column',
    width: 'auto',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  tableCol: {
    width: '25%',
    padding: 5,
  },
})

const DisplayCustomerDetails: React.FC<{
  customer: Invoice['customer']
}> = ({ customer }) => (
  <View style={styles.section}>
    <Text style={styles.subtitle}>Customer Details:</Text>
    <Text style={styles.text}>First Name: {customer?.first_name}</Text>
    <Text style={styles.text}>Last Name: {customer?.last_name}</Text>
    <Text style={styles.text}>Address: {customer?.address}</Text>
    <Text style={styles.text}>Zip Code: {customer?.zip_code}</Text>
    <Text style={styles.text}>City: {customer?.city}</Text>
    <Text style={styles.text}>Country: {customer?.country}</Text>
  </View>
)

const DisplayInvoiceDetails: React.FC<{
  invoiceData: Invoice
}> = ({ invoiceData }) => (
  <View style={styles.section}>
    <Text style={styles.subtitle}>Invoice Details:</Text>
    <Text style={styles.text}>Invoice ID: {invoiceData.id}</Text>
    <Text style={styles.text}>
      Finalized: {invoiceData.finalized ? 'Yes' : 'No'}
    </Text>
    <Text style={styles.text}>Paid: {invoiceData.paid ? 'Yes' : 'No'}</Text>
    <Text style={styles.text}>Date: {invoiceData.date}</Text>
    <Text style={styles.text}>Deadline: {invoiceData.deadline}</Text>
    <Text style={styles.text}>Total: {invoiceData.total}</Text>
    <Text style={styles.text}>Tax: {invoiceData.tax}</Text>
  </View>
)

const DisplayInvoiceLines: React.FC<{ lines: Invoice['invoice_lines'] }> = ({
  lines,
}) => (
  <View style={styles.section}>
    <Text style={styles.subtitle}>Products:</Text>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.text}>Product</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.text}>Quantity</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.text}>Unit</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.text}>Unit Price</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.text}>VAT Rate</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.text}>Unit Tax</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.text}>Unit Price</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.text}>Total</Text>
        </View>
      </View>
      {lines.map((line) => (
        <View key={line.id} style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.text}>{line.product.label}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>{line.quantity}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>{line.product.unit}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>
              {line.product.unit_price_without_tax}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>{line.product.vat_rate}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>{line.product.unit_tax}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>{line.product.unit_price}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.text}>{line.price}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
)

const InvoicePDF: React.FC<{ invoiceData: Invoice }> = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <DisplayInvoiceDetails invoiceData={invoiceData} />
          </View>
          <View style={{ flex: 1 }}>
            <DisplayCustomerDetails customer={invoiceData.customer} />
          </View>
        </View>
      </View>
      <DisplayInvoiceLines lines={invoiceData.invoice_lines} />
    </Page>
  </Document>
)

export default InvoicePDF
