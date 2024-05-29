import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { QronoCalendar } from 'booking_calendar'
import MyNav from '../../components/MyNav/MyNav';
import { Container, Modal, Form, Button, Spinner,Col } from 'react-bootstrap';
import { useState } from 'react';
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'moment-timezone'
import { luxonLocalizer } from 'react-big-calendar'
import { DateTime, Settings } from 'luxon'
import { AuthContext } from '../../context/AuthContextProvider';


const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 1 });


export default function MyCalendar() {

    const params = useParams();
    const views = Views;
    const [customViews, setCustomViews] = useState([views.MONTH, views.WEEK, views.DAY, views.AGENDA]);

    // variabili per il modale dei client
    const [modalClient, setModalClient] = useState(false);
    const hideModalClient = () => setModalClient(false);
    const showModalClient = () => setModalClient(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { admin } = useContext(AuthContext);

    const [barber, setBarber] = useState({});

    const [newBooking, setNewBooking] = useState({
        client: admin._id
    });


    const handleForm = (el) => {
        let idService = el.options[el.selectedIndex].value;
        let servi = barber.services.filter((se) => se._id == idService);
        
        let end = new Date(new Date(newBooking.start).getTime() + servi[0].duration * 60000);
        console.log(end)
        setNewBooking((prev) => {
            prev = { ...prev, services: [{ ...servi[0] }],end : end }
            return prev
        })
        console.log(newBooking)
    }

    const handleSelect = (e) => {
        
        if (admin.barber) {
            alert('Sei il Parruchiere');
        } else {
            
            if (e.start < new Date()) {
                alert('Devi selezionare un orario presente o futuro!')
            } else {
    
                setNewBooking((prev) => {
                    prev = { ...prev, start: e.start }
                    return prev
                })
                showModalClient();
    
            }
        }

    };

    async function createBooking() {
        try {

            
            setLoading(true);
            



            let res = await fetch(process.env.REACT_APP_URL_BOOKING, {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                method: 'POST',
                body: JSON.stringify(newBooking)
            });

            if (res.ok) {
                setLoading(false);
                let json = await res.json();
                let obg = { start: newBooking.data, end: newBooking.data, title: `${admin.name} ${admin.lastname} ${newBooking.services[0].nome}` }
                setBookings([...bookings, obg]);
                hideModalClient();
            } else {
                setLoading(false);
                console.log('Inserimento prenotazione non eseguita');
                setErrorMessage("C'è stato un errore nella prenotazione,riprova");
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000)
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            hideModalClient();
        }
    }


    const lang = {
        it: {
            week: 'Settimana',
            work_week: 'Settimana di Lavoro',
            day: 'Giorno',
            month: 'Mese',
            previous: 'Precedente',
            next: 'Successivo',
            today: 'Oggi',
            agenda: 'Agenda',

            noEventsInRange: 'Non ci sono prenotazioni in questo range.',
            showMore: (total) => `+${total} más`,
        }
    }

    const [bookings, setBookings] = useState([]);


    useEffect(() => {


        if (!admin.barber && params.id) {

            setCustomViews([views.DAY]);
            getBarber(params.id);

        } else {
            setBarber(admin);
            let listBookings = [];
            for (const boo of admin.bookings) {
                listBookings.push({ start: new Date(boo.start), end: new Date(boo.end), title: `${boo.client.name} ${boo.client.lastname}` })
            }
            setBookings([...listBookings]);
            console.log(bookings)
            
        }

    }, [])


    useEffect(() => {
        if (!admin.barber && params.id) {

            setCustomViews([views.DAY]);
            getBarber(params.id);

        } else {
            setBarber(admin);
            let listBookings = [];
            for (const boo of admin.bookings) {
                listBookings.push({ start: new Date(boo.start), end: new Date(boo.end), title: `${boo.client.name} ${boo.client.lastname}` })
            }
            setBookings([...listBookings]);
            console.log(bookings)
            
        }
    }, [bookings])



    async function getBarber(id_barber) {
        try {
            let res = await fetch(process.env.REACT_APP_URL_BARBER + id_barber, {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });

            if (res.ok) {
                let json = await res.json();
                setBarber(json);
                setNewBooking((prev) => {
                    prev = { ...prev, barber: json._id }
                    return prev
                });
                
                let listBookings = [];
                for (const boo of json.bookings) {
                    listBookings.push({ start: new Date(boo.start), end: new Date(boo.end), title: `${boo.client.name} ${boo.client.lastname}` })
                }
                setBookings([...listBookings]);
                

            } else {
                console.log('errore di ricezione dati')
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <Container fluid className='p-0 d-flex flex-column align-items-center'>
                <MyNav />




                <Container className='row m-3 p-0 d-flex flex-row align-items-center p-2 shadow rounded'>
                    <Col xs={12} md={2}>
                    <img alt='' src={barber.avatar} style={{width: '100px', height: '100px', objectFit:'cover'}} className='rounded-circle d-inline-block '/>
                    </Col>
                    <Col>
                    <h3 className='info'>{barber.salon}</h3>
                    <p className='info'>{barber.name} {barber.lastname}</p>
                    </Col>
                </Container>
                <Container className='mb-3'>

                    <Calendar
                        onSelectEvent={(e) => {
                            alert(e.title);
                        }}
                        onSelecting={() => { }}
                        localizer={localizer}
                        events={bookings}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '85vh', width: '100%' }}
                        onSelectSlot={handleSelect}
                        selectable={true}
                        max={new Date(0, 0, 1, 20, 0, 0)}
                        min={new Date(0, 0, 1, 7, 0, 0)}
                        culture='it-IT'
                        messages={lang.it}
                        defaultView={views.DAY}
                        views={[...customViews]}

                        step={30}
                    />

                </Container>

            </Container>




            {/* Modale Prenotazione Client */}
            <Modal show={modalClient} onHide={hideModalClient}>
                <Modal.Header>
                    <h4>Prenota il tuo servizio</h4>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>


                            <Form.Select aria-label="Default select example" onChange={(el) => handleForm(el.target)}>
                                <option> Seleziona il servizio</option>
                                {barber.services && barber.services.map((el, index) => {
                                    return <option key={index} value={el._id}>{el.name} {el.price}€</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className='d-flex my-2'>

                            <Button onClick={hideModalClient} className='me-2 bg-danger'>Annulla</Button>
                            <Button onClick={createBooking} className='bg-success'>Prenota</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {loading && <Spinner animation="grow" variant="danger" />}
                    {errorMessage !== '' && <p className='info'>{errorMessage}</p>}
                </Modal.Footer>
            </Modal>
        </>
    )
}
