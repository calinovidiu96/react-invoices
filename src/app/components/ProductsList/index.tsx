import { useApi } from 'api'
import { Product } from 'types'
import { useEffect, useState } from 'react'
import { Table, Spinner } from 'react-bootstrap'

import { calculateVisiblePages } from 'app/utils/calculateVisiblePages'
import CustomPagination from '../CustomPagination'

const ProductsList = (): React.ReactElement => {
  const api = useApi()

  const [productsList, setProductsList] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [visiblePages, setVisiblePages] = useState<number[]>([])
  const [perPage, setPerPage] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const { data } = await api.getSearchProducts({
          query: '',
          per_page: perPage,
          page: currentPage,
        })

        setProductsList(data.products)
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

    fetchProducts()
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
                  <th>Label</th>
                  <th>VAT Rate</th>
                  <th>Unit</th>
                  <th>Unit Price</th>
                  <th>Unit Price Without Tax</th>
                  <th>Unit Tax</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.label}</td>
                    <td>{product.vat_rate}</td>
                    <td>{product.unit}</td>
                    <td>{product.unit_price}</td>
                    <td>{product.unit_price_without_tax}</td>
                    <td>{product.unit_tax}</td>
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

export default ProductsList
