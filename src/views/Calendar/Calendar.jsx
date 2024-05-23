import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { QronoCalendar } from 'booking_calendar'
import MyNav from '../../components/MyNav/MyNav';
import { Container, Modal, Form, Button } from 'react-bootstrap';
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

    // variabili per il modale dei client
    const [modalClient, setModalClient] = useState(false);
    const hideModalClient = () => setModalClient(false);
    const showModalClient = () => setModalClient(true);

    const { admin } = useContext(AuthContext);

    const [barber, setBarber] = useState({});

    const [newBooking,setNewBooking] = useState({
        client: admin._id
    });


    const handleForm = (el) => {
        setNewBooking((prev)=>{
            prev = {...prev,services : [{nome: el.options[el.selectedIndex].text}]}
            return prev
        })
        console.log(el.options[el.selectedIndex].text);
    }

    const handleSelect = (e) => {
        setNewBooking((prev)=>{
            prev = {...prev,data : e.start}
            return prev
        })
        showModalClient();
        // let newBook = { start: e.start, end: e.end, title: 'Nuova prenotazione' };
        // console.log(e);
        // setBookings([...bookings, newBook]);

    };

    async function createBooking() {
        try {

            setNewBooking((prev)=>{
                prev = {...prev,barber : barber._id}
                return prev
            })
            
            console.log(newBooking);
            console.log(barber)
            
            let res = await fetch(process.env.REACT_APP_URL_BOOKING,{
                headers: {'Content-Type': 'application/json', 'Authorization' : 'Bearer '+localStorage.getItem('token')},
                method : 'POST',
                body: JSON.stringify(newBooking)
            });

            if (res.ok) {
                let json = await res.json();
                let obg = {start:newBooking.data, end:newBooking.data, title: `${admin.name} ${admin.lastname} ${newBooking.services[0].nome}`}
                setBookings([...bookings,obg]);
            } else {
                console.log('Inserimento prenotazione non eseguita')
            }
        } catch (error) {
            console.log(error);
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

            showMore: (total) => `+${total} más`,
        }
    }

    const [bookings, setBookings] = useState([]);


    useEffect(() => {

        
        if (!admin.barber && params.id) {
            
            getBarber(params.id);
        } else {
            setBarber(admin);
        }

    }, [])


    useEffect(() => {

    }, [bookings])



    async function getBarber(id_barber) {
        try {
            let res = await fetch(process.env.REACT_APP_URL_BARBER + id_barber, {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });

            if (res.ok) {
                let json = await res.json();
                setBarber(json);
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




                <Container>
                    <h3>Barber</h3>
                </Container>
                <Container>

                    <Calendar
                        onSelectEvent={(e) => {
                            alert(e.title);
                        }}
                        onSelecting={() => alert(312321)}
                        localizer={localizer}
                        events={bookings}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '85vh', width: '100%' }}
                        onSelectSlot={handleSelect}
                        selectable={true}
                        max={new Date(2024, 0, 1, 20, 0, 0)}
                        min={new Date(2024, 0, 1, 7, 0, 0)}
                        culture='it-IT'
                        messages={lang.it}
                        defaultView={Views.WEEK}
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

                            <Form.Label>Seleziona il servizio</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(el) => handleForm(el.target)}>
                                {barber.services && barber.services.map((el, index) => {
                                    return <option key={index} value={el.name}>{el.name}</option>
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

                </Modal.Footer>
            </Modal>
        </>
    )
}
