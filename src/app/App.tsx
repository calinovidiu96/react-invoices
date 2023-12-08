import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

import InvoicesList from './components/InvoicesList'
import InvoiceShow from './components/InvoiceShow'
import InvoiceEdit from './components/InvoiceEdit'
import CustomersList from './components/CustomersList'
import ProductsList from './components/ProductsList'

const AppNavbar = () => {
  return (
    <Navbar bg="light" expand="lg" className="mb-5">
      <Navbar.Brand as={Link} to="/">
        My App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Nav.Link as={Link} to="/">
            Invoices
          </Nav.Link>
          <Nav.Link as={Link} to="/customers">
            Customers
          </Nav.Link>
          <Nav.Link as={Link} to="/products">
            Products
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

function App() {
  return (
    <div className="px-5">
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/" Component={InvoicesList} />
          <Route path="/invoice/:id" Component={InvoiceShow} />
          <Route path="/edit-invoice/:id" Component={InvoiceEdit} />
          <Route path="/customers" Component={CustomersList} />
          <Route path="/products" Component={ProductsList} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
