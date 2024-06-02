import React, { useContext } from 'react'
import { Container, Navbar, NavDropdown, Nav } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContextProvider'
import Logo from '../../assets/logo-white.png'

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
            <Container fluid className='sticky-top bg-warning'>
                <Navbar expand="lg" className="nav-dark sticky-top" data-bs-theme="dark">
                    <Container>
                        <Link to="/" className='me-4'><img alt='logo' src={Logo} style={{maxWidth: '100px'}}/></Link>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
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
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

            </Container>
        </>
    )
}
