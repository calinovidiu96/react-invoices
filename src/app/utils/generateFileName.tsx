const generateFileName = (invoiceId: string): string => {
  // Get the current date and time
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const hours = String(currentDate.getHours()).padStart(2, '0')
  const minutes = String(currentDate.getMinutes()).padStart(2, '0')
  const seconds = String(currentDate.getSeconds()).padStart(2, '0')

  // Combine the unique identifier, invoice ID, and current date for the fileName
  const fileName = `invoice_${invoiceId}_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.pdf`

  return fileName
}

export default generateFileName
