import { useApi } from 'api'
import { Customer } from 'types'
import { useEffect, useState } from 'react'
import { Table, Spinner } from 'react-bootstrap'

import { calculateVisiblePages } from 'app/utils/calculateVisiblePages'
import CustomPagination from '../CustomPagination'

const CustomersList = (): React.ReactElement => {
  const api = useApi()

  const [customersList, setCustomersList] = useState<Customer[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [visiblePages, setVisiblePages] = useState<number[]>([])
  const [perPage, setPerPage] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const { data } = await api.getSearchCustomers({
          query: '',
          per_page: perPage,
          page: currentPage,
        })

        setCustomersList(data.customers)
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

    fetchCustomers()
  }, [api, currentPage, perPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Zip Code</th>
                </tr>
              </thead>
              <tbody>
                {customersList.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.first_name}</td>
                    <td>{customer.last_name}</td>
                    <td>{customer.address}</td>
                    <td>{customer.city}</td>
                    <td>{customer.country}</td>
                    <td>{customer.zip_code}</td>
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
          </div>
        </>
      )}
    </>
  )
}

export default CustomersList
