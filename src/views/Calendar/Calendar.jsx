import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { QronoCalendar } from 'booking_calendar'
import MyNav from '../../components/MyNav/MyNav';
import { Container, Modal, Form, Button, Spinner, Col, InputGroup, Row } from 'react-bootstrap';
import { useState } from 'react';
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'moment-timezone'
import { luxonLocalizer } from 'react-big-calendar'
import { DateTime, Settings } from 'luxon'
import { AuthContext } from '../../context/AuthContextProvider';
import MyFooter from '../../components/MyFooter/MyFooter';
import { IoMdSend,IoIosSend } from "react-icons/io";


const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 1 });


export default function MyCalendar() {

    const params = useParams();
    const views = Views;
    const [customViews, setCustomViews] = useState([views.MONTH, views.WEEK, views.DAY, views.AGENDA]);
    const showModalBarber = () => setModalBarber(true);

    const { admin } = useContext(AuthContext);

    const [barber, setBarber] = useState({});
    const [newBooking, setNewBooking] = useState({
        client: !admin.barber ? admin._id : null,
        barber: admin.barber ? admin._id : barber._id
    });

    // variabili per il modale dei client
    const [modalClient, setModalClient] = useState(false);
    const hideModalClient = () => setModalClient(false);
    const showModalClient = () => setModalClient(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newFeed, setNewFeed] = useState({});

    const handleFeed = (el) =>{
        setNewFeed((prev) => {
            prev = {...prev,[el.id]: el.value};
            return prev;
        })
    }

    // variabili modale barber
    const [mediaFeed,setMediaFeed] = useState(0);
    const [modalBarber, setModalBarber] = useState(false);
    const hideModalBarber = () => setModalBarber(false);
    const [formBarber, setFormBarber] = useState({
        barber: admin._id
    });
    const [dateSelected, setDateSelected] = useState(new Date());

    const handleFormBarber = (el) => {
        let id = el.id;
        let value = el.value;

        if (id === 'start' || id === 'end') {
            value = new Date(new Date(dateSelected).setHours(...el.value.split(':')));
        }

        setFormBarber((prev) => prev = { ...prev, [id]: value });

        console.log(formBarber);
        setNewBooking(formBarber);

    }




    const handleForm = (el) => {
        let idService = el.options[el.selectedIndex].value;
        let servi = barber.services.filter((se) => se._id == idService);

        let end = new Date(new Date(newBooking.start).getTime() + servi[0].duration * 60000);

        setNewBooking((prev) => {
            prev = { ...prev, services: [{ ...servi[0] }], end: end }
            return prev;
        })

    }

    const handleSelect = (e) => {

        let controlBooking = bookings.filter((el) => new Date(el.start).toDateString() === new Date(e.start).toDateString() && new Date(el.start).getHours() <= new Date(e.start).getHours() && new Date(el.end).getTime() >= new Date(e.start).getTime());

        if (controlBooking.length > 0) {

        } else {
            if (admin.barber) {
                setDateSelected(new Date(e.start).toDateString());
                showModalBarber();
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
        }

    };

    async function createBooking() {
        try {


            setLoading(true);


            

            let res = await fetch(process.env.REACT_APP_URL_BOOKING, {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                method: 'POST',
                body: JSON.stringify({...newBooking,barber:admin.barber ? admin._id : barber._id})
            });

            if (res.ok) {
                setLoading(false);
                let json = await res.json();
                let obg;
                if (admin.barber) {
                    obg = { start: newBooking.start, end: newBooking.end, title: `${newBooking.title}` };
                    setModalBarber(false);
                    setFormBarber({ barber: admin._id });
                } else {

                    obg = { start: newBooking.start, end: newBooking.end, title: `${admin.name} ${admin.lastname} ${newBooking.services[0].nome}` }
                }

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
            

            // setMediaFeed((prev)=>{
            //     prev = barber.feedback.reduce((accumulator, currentValue) => accumulator + currentValue,0) / barber.feedback.length;
            //     return prev;
            // })

            // console.log(mediaFeed)
        } else {
            setBarber(admin);
            let listBookings = [];
            for (const boo of admin.bookings) {
                listBookings.push({ start: new Date(boo.start), end: new Date(boo.end), title: boo.client ? `${boo?.client.name} ${boo?.client.lastname}` : `Non Disponibile` })
            }
            setBookings([...listBookings]);


        }

    }, [])


    useEffect(() => {
        if (!admin.barber && params.id) {

            setCustomViews([views.DAY]);
            getBarber(params.id);
            // setMediaFeed((prev)=>{
            //     prev = barber.feedback.reduce((accumulator, currentValue) => accumulator + currentValue,0) / barber.feedback.length;
            //     return prev;
            // });

            // console.log(mediaFeed)

        } else {
            setBarber(admin);
            let listBookings = [];
            for (const boo of admin.bookings) {
                listBookings.push({ start: new Date(boo.start), end: new Date(boo.end), title: boo.client ? `${boo?.client.name} ${boo?.client.lastname}` : `${boo.title}` })
            }
            setBookings([...listBookings]);



        }
    }, [newBooking])



    async function getBarber(id_barber) {
        try {
            let res = await fetch(process.env.REACT_APP_URL_BARBER + id_barber, {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });

            if (res.ok) {
                let json = await res.json();
                setBarber(json);
                // setNewBooking((prev) => {
                //     prev = { ...prev, barber: json._id }
                //     return prev
                // });

                console.log(json)
                // setMediaFeed((prev)=> count / json.feedback.length);

                let listBookings = [];
                for (const boo of json.bookings) {
                    listBookings.push({ start: new Date(boo.start), end: new Date(boo.end), title: boo.client ? `${boo?.client.name} ${boo?.client.lastname}` : `Non Disponibile` })
                }
                setBookings([...listBookings]);


            } else {
                console.log('errore di ricezione dati')
            }
        } catch (error) {
            console.log(error);
        }
    }


    async function createFeed(){
        try {
            setLoading(true);
            console.log(newFeed);

            let res = await fetch(process.env.REACT_APP_URL_FEED,{
                headers: {'Content-Type' : 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('token')},
                method: 'POST',
                body: JSON.stringify(newFeed)
            });
            if (res.ok) {
                let json = await res.json();
            } else {
                 console.log("C'è stato un erroe nella risposta della richiesta");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='responsive'>
            <Container fluid className='p-0 d-flex flex-column align-items-center'>
                <MyNav />




                <Container className='row m-3 p-0 d-flex flex-row align-items-center p-2 shadow rounded'>


                    <Col xs={12} md={2}>
                        <img alt='' src={barber.avatar} style={{ width: '100px', height: '100px', objectFit: 'cover' }} className='rounded-circle d-inline-block ' />
                    </Col>
                    <Col>
                        <h3 className='success'>{barber.salon}</h3>
                        <p className='warning'>{barber.name} {barber.lastname}</p>
                        <p></p>
                    </Col>
                    {!admin.barber && <Col>
                        <Form>
                            <Form.Group>
                                <Form.Label>Valutazione {newFeed.value}</Form.Label>
                                <Form.Range defaultValue={newFeed.value ?? 0} min={0} max={5} id='value' onChange={(el) => handleFeed(el.target)}/>
                                <Form.Control type='text' style={{border: 'none', borderBottom: '1px solid brown', borderRadius : '0px'}} placeholder='Testo del feedback' id='message' onChange={(el) => handleFeed(el.target)} />
                                <Button className='link light bg-success my-2 d-flex flex-row align-items-center gap-2' onClick={createFeed}>Invia <IoIosSend /></Button>
                            </Form.Group>
                        </Form>
                    </Col>}

                </Container>
                <Container className='mb-3' style={{marginBottom : '200px'}}>

                    <Calendar
                    
                        onSelectEvent={(e) => {
                            alert(e.title);
                        }}
                        onSelecting={() => { }}
                        localizer={localizer}
                        events={bookings}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '85vh', width: '100%', marginBottom : '50px' }}
                        onSelectSlot={handleSelect}
                        selectable={true}
                        max={new Date(0, 0, 1, 21, 0, 0)}
                        min={new Date(0, 0, 1, 8, 0, 0)}
                        culture='it-IT'
                        messages={lang.it}
                        defaultView={views.DAY}
                        views={[...customViews]}

                        step={30}
                    />

                </Container>

            </Container>


            <Container fluid className='d-none d-lg-flex p-0'>

                <MyFooter />
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


            {/* Modale Disponibilità Barber */}
            <Modal show={modalBarber} onHide={hideModalBarber}>
                <Modal.Header>
                    <h4>Gestione Disponibilità</h4>
                </Modal.Header>
                <Modal.Body>
                    <p>Seleziona la fascia oraria da bloccare per oggi!</p>
                    <Form>

                        <InputGroup className="mb-3 w-auto">
                            <InputGroup.Text>Dalle ore</InputGroup.Text>
                            <Form.Control type='time' id='start' onChange={(el) => handleFormBarber(el.target)} />
                            <InputGroup.Text>Alle ore</InputGroup.Text>
                            <Form.Control type='time' id='end' onChange={(el) => handleFormBarber(el.target)} />
                        </InputGroup>
                        <Form.Group>
                            <Form.Label>Titolo</Form.Label>
                            <Form.Control type='text' placeholder='Es. Non disponibile, Ferie,...' id='title' onChange={(el) => handleFormBarber(el.target)} />
                        </Form.Group>
                        <Form.Group className='d-flex my-2'>

                            <Button onClick={hideModalBarber} className='me-2 bg-warning'>Annulla</Button>
                            <Button onClick={createBooking} className='bg-success'>Aggiorna</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {loading && <Spinner animation="grow" variant="danger" />}
                    {errorMessage !== '' && <p className='info'>{errorMessage}</p>}
                    {<span>{formBarber.title}</span>}
                </Modal.Footer>
            </Modal>

        </div>
    )
}
