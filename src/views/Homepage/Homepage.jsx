import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import bgHero from '../../assets/bg-barberbooking.png'
import MyNav from '../../components/MyNav/MyNav'
import BarberList from '../../components/BarberList/BarberList'

export default function Homepage() {
  return (
    <>
      <Container fluid className='p-0 d-flex flex-column align-items-center'>
        <MyNav />

        {/* Hero Section */}
        <Container fluid className='p-5 d-flex flex-column align-items-center justify-content-center herohome' style={{ backgroundImage: '../../assets/bg-barberbooking.png' }}>
          <h3 className='text-center'>Benvenuto su </h3>
          <h1 className='text-center'>Barber Booking</h1>
          <h4 className='text-center my-4' style={{ maxWidth: '80%' }}>La tua piattaforma di fiducia per prenotare servizi presso parrucchieri e saloni di bellezza</h4>
        </Container>


        {/* Card Funzionalità di Barber Booking */}
        <Container style={{ marginTop: '-5%' }}>
          <Row xs={1} md={1} lg={3} className='g-3'>
            <Col>
              <Container className="p-5 shadow bg-info rounded" style={{ color: 'white', minHeight: '270px' }}>
                <h3>Ricerca Personalizzata</h3>
                <p>Usa la nostra funzione di ricerca avanzata per
                  trovare saloni e parrucchieri vicino a te.
                  Filtra per tipo di servizio, disponibilità, valutazioni. </p>
              </Container>
            </Col>
            <Col>
              <Container className="p-5 shadow bg-info rounded" style={{ color: 'white', minHeight: '270px' }}>
                <h3>Visualizzazione Disponibilità</h3>
                <p>Consulta la disponibilità in tempo reale
                  dei saloni registrati, scegliendo il momento
                  più adatto alle tue esigenze. </p>
              </Container>
            </Col>
            <Col>
              <Container className="p-5 shadow bg-info rounded" style={{ color: 'white', minHeight: '270px' }}>
                <h3>Prenotazioni</h3>
                <p>Prenota il tuo appuntamento in pochi clic e dimentica le attese al telefono. </p>
              </Container>
            </Col>
          </Row>
        </Container>


        <Container className='my-5'>
          <h2 className='text-center fs-1 fw-bolder success'>Cerca - Scegli - Prenota!</h2>
        </Container>

        <BarberList />
      </Container>
    </>
  )
}
