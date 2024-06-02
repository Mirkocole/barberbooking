import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Logo from '../../assets/logo.png'

export default function MyFooter() {
    return (
        <>
            <Container fluid className='bg-info p-1'>
                <Container className='w-md-50 my-2'>
                    <Row>
                        <Col className='d-flex flex-column align-items-end '>
                            <img alt='logo' src={Logo} style={{ maxWidth: '80px' }} />
                        </Col>
                        <Col xs={9} md={7} className='d-flex flex-column align-items-start justify-content-center '>
                            <span className='warning'>© Copyright 2024 - Created by Mirko Colella</span>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    )
}
