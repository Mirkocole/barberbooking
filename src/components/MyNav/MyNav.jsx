import React, { useContext } from 'react'
import { Container, Navbar, NavDropdown, Nav, DropdownButton,Col,Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContextProvider'
import Logo from '../../assets/logo-white.png'
import { GoHome, GoSearch, GoStack, GoCalendar, GoPerson } from "react-icons/go";

export default function MyNav() {

    const { admin, setAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    function logOut() {
        localStorage.removeItem('token');
        setAdmin({});
        navigate('/login');
    }

    return (
        <>
            <Container fluid className='sticky-top bg-warning d-none d-lg-flex'>
                <Navbar expand="lg" className="nav-dark sticky-top" data-bs-theme="dark">
                    <Container>
                        <Link to="/" className='me-4'><img alt='logo' src={Logo} style={{ maxWidth: '100px' }} /></Link>

                        <Nav className="me-auto">
                            <Link to="/" className='nav-link text-white'>Home</Link>
                            {!admin.barber && <Link to="/ricerca" className='nav-link text-white'>Ricerca</Link>}
                            <Link to={admin.barber ? "/booking" : "/prenotazioni"} className='nav-link text-white'>Prenotazioni</Link>
                            {admin.barber && <Link to="/calendar" className='nav-link text-white'>Calendar</Link>}
                            <NavDropdown title="Account" id="basic-nav-dropdown" className='bg-warning'>
                                <Link to="/profile" className='nav-link text-white px-4'>Impostazioni</Link>
                                <Link to="#action/3.2" className='nav-link text-white px-4'>
                                    Privacy Policy
                                </Link>
                                <Link to="#action/3.3" className='nav-link text-white px-4'>Help</Link>
                                <NavDropdown.Divider />
                                <Link onClick={logOut} className='nav-link text-white px-4'>
                                    Log Out
                                </Link>
                            </NavDropdown>
                        </Nav>

                    </Container>
                </Navbar>

            </Container>

            <Container fluid className='position-fixed bottom-0 py-3 bg-primary z-3 d-lg-none m-0'>
                

                        <Row className='mx-0 justify-content-center' >
                            <Col className=''>
                                <Link to="/" className='nav-link text-white d-flex flex-column align-items-center justify-content-center align-items-center'><GoHome className='fs-2' /><p className='m-0 mobilemenu'>HOME</p></Link>
                            </Col>
                            {!admin.barber &&<Col className=''>
                                <Link to="/ricerca" className='nav-link text-white d-flex flex-column align-items-center justify-content-center align-items-center'><GoSearch className='fs-2' /><p className='m-0 mobilemenu'>RICERCA</p></Link>
                            </Col>}
                            <Col className=''>
                                <Link to={admin.barber ? "/booking" : "/prenotazioni"} className='nav-link text-white d-flex flex-column align-items-center justify-content-center align-items-center'><GoStack className='fs-2' /><p className='m-0 mobilemenu'>PRENOTAZIONI</p></Link>
                            </Col>
                            {admin.barber && <Col className=''>
                               <Link to="/calendar" className='nav-link text-white d-flex flex-column align-items-center justify-content-center align-items-center'><GoCalendar className='fs-2' /><p className='m-0 mobilemenu'>CALENDARIO</p></Link>
                            </Col>}
                            <Col className=''>
                                <Link to="/profile" className='nav-link text-white d-flex flex-column align-items-center justify-content-center align-items-center'><GoPerson className='fs-2' /><p className='m-0 mobilemenu'>ACCOUNT</p></Link>
                            </Col>

                        </Row>

                    


                

            </Container>
        </>
    )
}
