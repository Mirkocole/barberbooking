import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form, Spinner, Row, Col } from 'react-bootstrap'
import { AuthContext } from '../../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';

export default function Login() {



    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { admin, setAdmin } = useContext(AuthContext);

    const [user, setUser] = useState({
        email: '',
        password: ''
    });


    const [logged, setLogged] = useState(false);

    // Refresh pagina
    useEffect(() => {
        if (admin._id) {
            navigate('/');
        }
    }, [admin])

    const handleForm = (el) => {
        let id = el.id;
        let value = el.value;

        setUser({ ...user, [id]: value });
    }

    async function login() {
        try {
            setLoading(true);
            let res = await fetch(process.env.REACT_APP_URL_AUTH + 'login', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(user)
            });
            if (res.ok) {
                setLoading(false);
                let json = await res.json();
                console.log(json);

                setAdmin(json.user);
                localStorage.setItem('token', json.token);
                navigate('/');
            } else {
                setLoading(false);
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


    return (
        <>
            <Container fluid className='p-5'>



                <Col xs={12} md={8} lg={6} xl={5} xxl={4} className='mx-auto'>
                    <Form className='p-5 m-3 rounded shadow'>
                        <Row className='no-wrap'>

                            <h3>Login</h3>
                            <img alt='logo' src={Logo} style={{maxWidth : '100px'}}/>
                        </Row>
                        <Form.Group>
                            <Form.Label>
                                Email
                            </Form.Label>
                            <Form.Control type='text' placeholder={'insert your email'} id='email' onChange={(el) => handleForm(el.target)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Password
                            </Form.Label>
                            <Form.Control type='password' placeholder={'insert your password'} id='password' onChange={(el) => handleForm(el.target)} />
                        </Form.Group>
                        <Form.Group className='my-3 d-flex flex-row align-items-center'>
                            <span className='m-2 info nav-link link' onClick={() => { navigate('/register') }}>Registrati</span>
                            <Button className='m-2 bg-success' onClick={login}>Login</Button>
                        </Form.Group>
                        {loading && <Spinner animation='grow' variant='success' />}
                    </Form>
                </Col>


            </Container>
        </>
    )
}
