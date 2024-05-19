import React, { useContext } from 'react'
import { Container, Navbar, NavDropdown, Nav } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContextProvider'

export default function MyNav() {

    const {admin, setAdmin} = useContext(AuthContext);
    const navigate = useNavigate();    
    function logOut(){
        localStorage.removeItem('token');
        setAdmin({});
        navigate('/login');
    }

    return (
        <>
            <Container fluid className='sticky-top bg-success'>
                <Navbar expand="lg" className="nav-dark sticky-top" data-bs-theme="dark">
                    <Container>
                        <Navbar.Brand>React-Bootstrap</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Link to="/" className='nav-link text-white'>Home</Link>
                                <Link to={admin.barber ? "/booking" : "/prenotazioni"} className='nav-link text-white'>Prenotazioni</Link>
                                {admin.barber && <Link to="/calendar" className='nav-link text-white'>Calendar</Link>}
                                <Link to="/profile" className='nav-link text-white'>Account</Link>
                                <NavDropdown title="Impostazioni" id="basic-nav-dropdown" className='bg-success'>
                                    <Link to="#action/3.1" className='nav-link text-white px-4'>Impostazioni</Link>
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
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

            </Container>
        </>
    )
}
