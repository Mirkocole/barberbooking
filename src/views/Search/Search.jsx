import React from 'react'
import BarberList from '../../components/BarberList/BarberList'
import MyNav from '../../components/MyNav/MyNav'
import { Container } from 'react-bootstrap'
import MyFooter from '../../components/MyFooter/MyFooter'


export default function Search() {
    return (
        <>
            <Container fluid className='m-0 p-0' style={{ minHeight: '90vh' }}>

                <MyNav />
                <BarberList />




            </Container>
            <MyFooter />
        </>
    )
}
