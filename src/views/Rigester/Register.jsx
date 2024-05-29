import React, { useEffect, useState, useContext } from 'react'
import { Container, Form, Button, Spinner, Card, Row, Col, Modal, InputGroup } from 'react-bootstrap'
import Clireg from '../../assets/cli-reg.png'
import Barbereg from '../../assets/barber-reg.png'
import { AuthContext } from '../../context/AuthContextProvider'
import { useNavigate } from 'react-router-dom'

export default function Register() {


    const navigate = useNavigate();
    const {admin,setAdmin} = useContext(AuthContext);
    const [validated, setValidated] = useState(false);
    const [validatedbar, setValidatedbar] = useState(false);
    const [loading, setLoading] = useState(false);

    // Variabili modale cliente
    const [modalCli, setModalCli] = useState(false);
    const handleShowCli = () => { setModalCli(true) };
    const handleCloseCli = () => { setModalCli(false) };

    // Variabili modale parrucchiere
    const [modalBar, setModalBar] = useState(false);
    const handleShowBar = () => { setModalBar(true) };
    const handleCloseBar = () => { setModalBar(false) };


    // Variabili dati di registrazione del cliente
    const [cliente, setCliente] = useState({});

    const handleFormClient = (el) => {
        let key = el.id;
        let value = el.value;

        setCliente({ ...cliente, [key]: value });
    }


    // Variabili dati di registrazione del parrucchiere
    const [barber, setBarber] = useState({});

    const handleFormBarber = (el) => {
        let key = el.id;
        let value = el.value;

        setBarber({ ...barber, [key]: value });
    }


    async function createClient() {

        try {

            setLoading(true);

            let res = await fetch(process.env.REACT_APP_URL_AUTH + 'signupClient', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(cliente)
            });

            if (res.ok) {
                setLoading(false);
                let json = await res.json();
                login({email: cliente.email, password: cliente.password});

            } else {
                setLoading(false);
                let json = await res.json();
                console.log(json);
            }

        } catch (error) {
            setLoading(false);
            console.log(error)
        }

    }

    async function createBarber() {
        try {
            setLoading(true);
            console.log(barber)
            let res = await fetch(process.env.REACT_APP_URL_AUTH + 'signupBarber', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(barber)
            });


            if (res.ok) {
                setLoading(false);
                let json = await res.json();
                console.log(json);
                login({email: barber.email, password: barber.password});

            } else {
                setLoading(false);
                let json = await res.json();
                console.log(json);
            }

        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }

    async function login(user){
        try {
            setLoading(true);
            console.log(user)
            let res = await fetch(process.env.REACT_APP_URL_AUTH+'login',{
                headers : {'Content-Type' : 'application/json'},
                method: 'POST',
                body : JSON.stringify(user)
            });
            if (res.ok) {
                setLoading(false);
                let json = await res.json();
                console.log(json);

                setAdmin(json.user);
                localStorage.setItem('token',json.token);
                navigate('/');
            }else{
                setLoading(false);
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }



    const handleSubmitCli = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);

        createClient();
    };


    const handleSubmitBar = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }

        setValidatedbar(true);
        
        createBarber();
    };


    useEffect(()=>{
        if (admin._id) {
            navigate('/');
        }
    },[admin])

    return (
        <>

            {/* Contenuto Pagina */}
            <Container className='p-5 justify-content-center'>
                <Row xs={1} md={2} className='g-3'>
                    <Col className='d-flex flex-column align-items-center'>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={Clireg} />
                            <Card.Body>
                                <Card.Title>Registrazione Cliente</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <Button variant="success" onClick={handleShowCli}>Registrati</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='d-flex flex-column align-items-center'>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={Barbereg} />
                            <Card.Body>
                                <Card.Title>Registrazione Parrucchiere</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <Button variant="dark" onClick={handleShowBar}>Registrati</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>



            {/* Modale Registrazione Cliente */}
            <Modal show={modalCli} onHide={handleCloseCli}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrazione Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated}>
                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type='text' required placeholder='insert name' id='name' className='inline-block' onChange={(el) => { handleFormClient(el.target) }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a name.
                            </Form.Control.Feedback>
                            <Form.Label>Cognome</Form.Label>
                            <Form.Control type='text' required placeholder='insert lastname' id='lastname' className='inline-block' onChange={(el) => { handleFormClient(el.target) }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a lastname.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' required placeholder='insert email' id='email' onChange={(el) => { handleFormClient(el.target) }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a email.
                            </Form.Control.Feedback>
                            <Form.Label>Telefono</Form.Label>
                            <Form.Control type='text' placeholder='insert phone' id='phone' onChange={(el) => { handleFormClient(el.target) }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a phone.
                            </Form.Control.Feedback>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' required placeholder='insert password' id='password' onChange={(el) => { handleFormClient(el.target) }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a password.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='my-2'>
                            <Button variant="secondary" onClick={handleCloseCli} className='mx-2'>
                                Annulla
                            </Button>
                            <Button variant="success" onClick={handleSubmitCli}>Ragistrati</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {loading && <Spinner animation='grow' variant='success' />}
                </Modal.Footer>
            </Modal>



            {/* Modale Registrazione Parrucchiere */}
            <Modal show={modalBar} onHide={handleCloseBar}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrazione Parrucchiere</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validatedbar} >
                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type='text' required placeholder='insert name' id='name' className='inline-block' onChange={(el) => { handleFormBarber(el.target) }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a name.
                            </Form.Control.Feedback>
                            <Form.Label>Cognome</Form.Label>
                            <Form.Control type='text' required placeholder='insert lastname' id='lastname' className='inline-block' onChange={(el) => { handleFormBarber(el.target) }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a lastname.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' required placeholder='insert email' id='email' onChange={(el) => { handleFormBarber(el.target) }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a email.
                            </Form.Control.Feedback>
                            <Form.Label>Telefono</Form.Label>
                            <Form.Control type='text' placeholder='insert phone' id='phone' onChange={(el) => { handleFormBarber(el.target) }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a phone.
                            </Form.Control.Feedback>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' required placeholder='insert password' id='password' onChange={(el) => { handleFormBarber(el.target) }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a password.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='my-2'>
                            <Button variant="secondary" onClick={handleCloseBar} className='mx-2'>
                                Annulla
                            </Button>
                            <Button variant="dark" onClick={handleSubmitBar}>Ragistrati</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {loading && <Spinner animation='grow' variant='success' />}
                </Modal.Footer>
            </Modal>

        </>
    )
}
