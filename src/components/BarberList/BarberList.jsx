import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Form, FloatingLabel, Modal } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';

export default function BarberList() {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [barberlist, setBarberlist] = useState([]);
    const [modalBook, setModalBook] = useState(false);
    const [filter, setFilter] = useState('');
    const [searchFilter, setSearchFilter] = useState({});
    let [updateList,setUpdateList]= useState([]);

    const handleSearchFilter = (el) => {
        let value = el.options[el.selectedIndex].value;
        let id = el.id;

        setSearchFilter((prev) => {
            prev = { ...prev, [id]: value }
            return prev;
        });



    }

    let minDate = new Date().toISOString().split('T')[0];

    const [city, setCity] = useState([]);
    const [country, setCountry] = useState([]);

    const hideModal = () => setModalBook(false);
    const showModal = () => setModalBook(true);

    const handleFilter = (el) => {
        setFilter(el.value);
    }

    const imgPlaceholder = 'https://placehold.co/400';

    async function getBarber() {
        try {
            let res = await fetch(process.env.REACT_APP_URL_BARBER, {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            });

            if (res.ok) {
                let json = await res.json();

                for (const el of json) {

                    setCity((prev) => {
                        prev = [...prev, el.address.city];
                        return [...new Set(prev)];
                    });

                    setCountry((prev) => {
                        prev = [...prev, el.address.country];
                        return [...new Set(prev)];
                    });
                }
                setBarberlist((prev)=>json);
                
            }

        } catch (error) {

        }
    }


    useEffect(() => {

        getBarber().then(()=>{
            setUpdateList((prev => barberlist));
        });

        

    }, []);

    useEffect(() => {

        
        getBarber().then(()=>{
            console.log(barberlist);
            if (searchFilter.city || searchFilter.country) {
                console.log(searchFilter);
                let keys = Object.keys(searchFilter);
                let updateList = barberlist.filter((el) => el.address[keys[0]] === searchFilter[keys[0]]);
                // console.log(updateList);
    
                setUpdateList((prev) => {
                    prev = barberlist.filter((el) => searchFilter[keys[0]] !== 'Città' ? el.address[keys[0]] === searchFilter[keys[0]] : true);
                    return prev;
                });
            }
        });

    }, [searchFilter])


    return (
        <>


            <Container className='py-5'>
                <h3 className='primary'>Lista Parrucchieri</h3>

                <Form className='my-3' onSubmit={(e) => e.preventDefault()}>
                    <Row>
                        <Form.Group>
                            <FloatingLabel label='Cerca Parruchiere' >
                                <Form.Control type='text' id='searchText' placeholder='' onChange={(el) => handleFilter(el.target)} />
                            </FloatingLabel>
                        </Form.Group>
                    </Row>
                    <Row className='my-2'>
                        <Col>
                            <Form.Group>
                                <Form.Select aria-label="Default select example" id='city' onChange={(el) => { handleSearchFilter(el.target) }}>
                                    <option> Città</option>
                                    {city.map((el, index) => {
                                        return <option key={index} value={el}>{el}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>



                </Form>

                {/* Lista Parrucchieri */}
                <Row xs={1} md={3} className='g-2'>
                    {/* {console.log(barberlist)} */}
                    {updateList && updateList.filter((el) => el.name.toLowerCase().includes(filter.toLowerCase()) ||
                        el.lastname.toLowerCase().includes(filter.toLowerCase()) ||
                        el.email.toLowerCase().includes(filter.toLowerCase())
                    ).map((el, index) => {
                        return <Col key={index} className='cardBarber' onClick={() => navigate('/calendar/' + el._id)}>
                            <Container className='p-4 shadow rounded d-flex cardbarber'>
                                <img alt='' src={el.avatar ?? imgPlaceholder} style={{ width: '140px', height: '140px', objectFit: 'cover' }} className='rounded-circle border' />
                                <Col className='d-flex flex-column justify-content-center'>

                                    <span className='px-2 fs-5 success'><b>{el.salon}</b></span>
                                    <span className='px-2'><b>{el.name} {el.lastname}</b></span>
                                    <span className='px-2'>{el.email}</span>
                                </Col>
                            </Container>
                        </Col>
                    })}
                </Row>
            </Container>



            {/* Modal Booking */}
            <Modal show={modalBook} onHide={hideModal}>
                <Modal.Header>
                    <h3>Prenotati!</h3>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control type='date' min={minDate} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
