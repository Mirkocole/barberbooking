import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import bgHero from '../../assets/barberBG2.jpeg'
import MyNav from '../../components/MyNav/MyNav'
import BarberList from '../../components/BarberList/BarberList'
import { CiSearch, CiCircleCheck, CiReceipt, CiCircleList } from "react-icons/ci";
import MyFooter from '../../components/MyFooter/MyFooter'
import { useNavigate } from 'react-router-dom'

export default function Homepage() {

  const navigation = useNavigate()

  return (
    <>
      <Container fluid className='p-0 d-flex flex-column align-items-center'>
        <MyNav />

        {/* Hero Section */}
        <Container fluid className='p-5 d-flex flex-column align-items-center justify-content-center herohome' style={{ backgroundImage: '../../assets/bg-barberbooking.png' }}>
          <h3 className='text-center'>Benvenuto su </h3>
          <h1 className='text-center'>Barber Booking</h1>
          <h4 className='text-center my-4' style={{ maxWidth: '80%' }}>La tua piattaforma di fiducia <br></br>per prenotare servizi presso parrucchieri e saloni di bellezza</h4>
          <Row className='p-3 border callToAction align-items-center'>
            <span className="text-center" onClick={()=> navigation('/ricerca')}>PRENOTA IL TUO PARRUCHIERE <CiCircleList style={{fontSize : '30px'}} /></span>
          </Row>
        </Container>


        {/* Card Funzionalità di Barber Booking */}
        <Container style={{ marginTop: '-5%', marginBottom : '5%' }}>
          <Row xs={1} md={1} lg={3} className='g-3'>
            <Col>
              <Container className="p-5 shadow bg-info warning" style={{  minHeight: '170px' }}>
                <h3> <CiSearch /> Ricerca</h3>
                <p>Usa la nostra funzione di ricerca per
                  trovare saloni e parrucchieri vicino a te. </p>
              </Container>
            </Col>
            <Col>
              <Container className="p-5 shadow bg-info warning" style={{  minHeight: '170px' }}>
                <h3> <CiCircleCheck /> Disponibilità</h3>
                <p>Consulta la disponibilità in tempo reale
                  dei saloni registrati. </p>
              </Container>
            </Col>
            <Col>
              <Container className="p-5 shadow bg-info warning" style={{  minHeight: '170px' }}>
                <h3> <CiReceipt /> Prenotazioni</h3>
                <p>Prenota il tuo appuntamento in pochi clic e dimentica le attese al telefono. </p>
              </Container>
            </Col>
          </Row>
        </Container>


        <Container className='my-5'>
          <h2 className='text-center fs-1 warning'>Perché Scegliere Barber Booking?</h2>
        </Container>

        <Container className="mb-5">
           <Row  className="align-items-start">
            <Col md={7} className=''>
            <h3 className="success">Facilità di Prenotazione</h3>
            <p>Prenota servizi di bellezza e parrucchiere con pochi clic,<br></br> risparmiando tempo e sforzo.</p>
            <p>Barber Booking è progettato per rendere il processo di prenotazione dei servizi di bellezza e parrucchiere semplice e veloce.</p>

            <h3 className="success">Accesso Immediato alle Disponibilità</h3>
            <p>Accedere immediatamente alla disponibilità dei migliori saloni di bellezza e parrucchieri non è mai stato così semplice.</p>
            <p>Grazie al calendario in tempo reale, vedi subito gli orari liberi e occupati, facilitando la scelta del momento migliore per il tuo appuntamento.</p>
            </Col>
            <Col   style={{objectFit : 'cover'}} className='justify-content-center'>
            <img alt='' src={bgHero} className='rounded' style={{maxWidth : '100%'}}/>
            </Col>
           </Row>
        </Container>
      </Container>

      <MyFooter />
      
    </>
  )
}
