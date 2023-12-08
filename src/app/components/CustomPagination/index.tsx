import React from 'react'
import {
  Pagination as BootstrapPagination,
  ButtonGroup,
  Button,
  Container,
  Row,
  Col,
} from 'react-bootstrap'

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  visiblePages: number[]
  handlePageChange: (page: number) => void
  perPage: number
  setPerPage: (perPage: number) => void
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  visiblePages,
  handlePageChange,
  perPage,
  setPerPage,
}) => {
  return (
    <Container>
      <Row>
        {/* Pagination on the left */}
        <Col className="d-flex justify-content-center">
          <BootstrapPagination>
            <BootstrapPagination.First onClick={() => handlePageChange(1)} />
            <BootstrapPagination.Prev
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            />
            {visiblePages.map((page) => (
              <BootstrapPagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </BootstrapPagination.Item>
            ))}
            <BootstrapPagination.Next
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
            />
            <BootstrapPagination.Last
              onClick={() => handlePageChange(totalPages)}
            />
          </BootstrapPagination>
        </Col>

        {/* "Per page" buttons on the right */}
        <Col className="d-flex justify-content-center">
          <ButtonGroup className="mb-2">
            <Button
              onClick={() => setPerPage(10)}
              variant={perPage === 10 ? 'primary' : 'outline-primary'}
            >
              10
            </Button>
            <Button
              onClick={() => setPerPage(20)}
              variant={perPage === 20 ? 'primary' : 'outline-primary'}
            >
              20
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default CustomPagination
