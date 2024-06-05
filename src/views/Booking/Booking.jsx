import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Table } from 'react-bootstrap'
import MyNav from '../../components/MyNav/MyNav'
import { AuthContext } from '../../context/AuthContextProvider'
import MyFooter from '../../components/MyFooter/MyFooter';

export default function Booking() {

    const { admin, getProfile } = useContext(AuthContext);
    const [refresh, setRefresh] = useState(false);


    async function deleteBooking(el) {
        try {

            
            let res = await fetch(process.env.REACT_APP_URL_BOOKING + el._id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                method: 'DELETE',
                body: JSON.stringify(el)
            });

            if (res.ok) {
                let json = await res.json();
                setRefresh(!refresh);
            } else {

            }
        } catch (error) {

        }
    }



    useEffect(() => {
        getProfile();
    }, [refresh])

    return (
        <div className='responsive'>
            <Container fluid className="p-0 py-0" style={{ minHeight: '90vh' }}>

                <MyNav />

                <Container fluid className=' p-5 shadow'>
                    <h2 className='primary'>Prenotazioni</h2>
                </Container>

                <Container className='mt-5'>
                    {admin.bookings.length <= 0 && <h5>Non ci sono appuntamenti prenotati</h5>}



                    {admin.bookings.length > 0 ? <Table striped bordered hover size="sm">
                        <thead>
                            <tr>

                                <th>Data</th>
                                <th>Orario</th>
                                <th>Servizio richiesto</th>
                                <th>Barber</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admin.bookings.sort(function (a, b) { return new Date(b.start) - new Date(a.start) }).map((el, index) => {
                                return <tr key={index}>
                                    <td>{new Date(el.start).toLocaleDateString()}</td>
                                    <td>{new Date(el.start).getHours()}:{new Date(el.start).getMinutes().toLocaleString() === 0 ? '00' : new Date(el.start).getMinutes()} -
                                        {new Date(el.end).getHours()}:{new Date(el.end).getMinutes().toLocaleString() === 0 ? '00' : new Date(el.end).getMinutes()}</td>
                                    <td>{el.services[0]?.name ?? el.title + ' (Barber)'} </td>
                                    <td>{el.barber?.salon} </td>
                                    <td><span className='success link' onClick={() => deleteBooking(el)}>Elimina</span> </td>
                                </tr>
                            })}

                        </tbody>
                    </Table> : ''}


                </Container>

            </Container>
            <Container fluid className='d-none d-lg-flex p-0'>

                <MyFooter />
            </Container>
        </div>
    )
}
