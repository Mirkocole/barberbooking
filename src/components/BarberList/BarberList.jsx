import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Form, FloatingLabel } from 'react-bootstrap';

export default function BarberList() {

    const token = localStorage.getItem('token');
    const [barberlist, setBarberlist] = useState([]);

    async function getBarber() {
        try {
            let res = await fetch(process.env.REACT_APP_URL_BARBER, {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            });

            if (res.ok) {
                let json = await res.json();
                
                setBarberlist(json);
            }

        } catch (error) {

        }
    }


    useEffect(() => {
        getBarber();
    }, [])

    return (
        <>
            

                <Container className='my-5'>
                    <h3 className='primary'>Lista Parrucchieri</h3>
                    
                    <Form className='my-3'>
                        <Form.Group>
                            <FloatingLabel label='Cerca Parruchiere' >
                                <Form.Control type='text' id='searchText' placeholder='' />
                            </FloatingLabel>
                        </Form.Group>
                    </Form>
                    
                    {/* Lista Parrucchieri */}
                    <Row xs={1} md={3} className='g-2'>
                        {barberlist && barberlist.map((el, index) => {
                            return <Col key={index}>
                                <Container className='p-4 shadow rounded'>

                                    <span className='px-2'>{el.name} {el.lastname}</span>
                                    <span className='px-2'>{el.email}</span>
                                </Container>
                            </Col>
                        })}
                    </Row>
                </Container>
        </>
    )
}
