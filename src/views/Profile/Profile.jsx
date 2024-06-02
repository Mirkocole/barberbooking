import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row, Modal, Button, Form, Spinner } from 'react-bootstrap'
import MyNav from '../../components/MyNav/MyNav'
import { AuthContext } from '../../context/AuthContextProvider'
import MyFooter from '../../components/MyFooter/MyFooter';

export default function Profile() {

    const { admin, getProfile } = useContext(AuthContext);

    const [refresh, setRefresh] = useState(false);

    const [loading, setLoading] = useState(false);

    const [service, setService] = useState({});

    const [modalService, setModalService] = useState(false);

    const handleModalService = () => {
        setModalService((prev) => !prev);
    }

    const [modalEditService, setModalEditService] = useState(false);
    const handleModalEditService = (el) => {
        setService(el);
        setModalEditService(!modalEditService)
    };

    const handleService = (el) => {
        let key = el.id;
        let value = key == 'price' ? parseInt(el.value) : el.value;

        setService((prev) => {
            prev = { ...prev, [key]: value };
            return prev
        })
    }



    const [editProfile, setEditProfile] = useState({ ...admin });
    const [imageAvatar, setImageAvatar] = useState(new FormData());
    const handleImage = (img) => {

        setImageAvatar((prev) => {
            prev.delete('user');
            prev.delete('avatar');
            prev.append('avatar', img);
            return prev;
        });

    }

    const [showEditCli, setShowEditCli] = useState(false);

    const [showEditBar, setShowEditBar] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const handleForm = (el) => {
        let key = el.id;
        let value = el.value;

        switch (key) {
            case 'street':
                setEditProfile({ ...editProfile, address: { ...editProfile.address, street: value } });
                break;
            case 'postalCode':
                setEditProfile({ ...editProfile, address: { ...editProfile.address, postalCode: value } });
                break;
            case 'city':
                setEditProfile({ ...editProfile, address: { ...editProfile.address, city: value } });
                break;
            case 'country':
                setEditProfile({ ...editProfile, address: { ...editProfile.address, country: value } });
                break;
            case 'countryCode':
                setEditProfile({ ...editProfile, address: { ...editProfile.address, countryCode: value } });
                break;

            default:
                setEditProfile({ ...editProfile, [key]: value });
                break;
        }
    }


    async function addService() {

        try {
            setLoading(true);
            let res = await fetch(process.env.REACT_APP_URL_BARBER + editProfile._id + '/services', {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                method: 'POST',
                body: JSON.stringify(service)
            });

            if (res.ok) {
                setLoading(false);
                let json = await res.json();
                console.log(json);
                setRefresh(!refresh);
                handleModalService();
            } else {
                setLoading(true);
                console.log('Res non ha dato risultato');
                handleModalService();
            }
        } catch (error) {
            setLoading(true);
            console.log(error);
            handleModalService();
        }

    }

    async function deleteService(id) {
        try {
            setLoading(true);
            console.log(process.env.REACT_APP_URL_BARBER + editProfile._id + '/services/' + id)
            let res = await fetch(process.env.REACT_APP_URL_BARBER + editProfile._id + '/services/' + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                method: 'DELETE'
            });

            if (res.ok) {
                setLoading(false);
                setRefresh(!refresh);
            } else {
                setLoading(false);
                console.log('Errore nella cancellazione del servizio');
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function updateService(id) {
        try {
            setLoading(true);
            console.log(process.env.REACT_APP_URL_BARBER + editProfile._id + '/services/' + id)
            let res = await fetch(process.env.REACT_APP_URL_BARBER + editProfile._id + '/services/' + id, {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                method: 'PUT',
                body: JSON.stringify(service)
            });

            if (res.ok) {
                setLoading(false);
                setRefresh(!refresh);
                setModalEditService(false);
            } else {
                setLoading(false);
                console.log('Errore nella modifica del servizio');
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Funzione modifica profilo
    async function updateProfile() {



        try {
            setLoading(true);
            // Rilevo il tipo di profilo da modificare
            let API = editProfile.barber ? process.env.REACT_APP_URL_BARBER : process.env.REACT_APP_URL_CLIENT;

            if (imageAvatar.has('avatar')) {

                imageAvatar.append('user', JSON.stringify(editProfile));

                let res = await fetch(API + editProfile._id, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    method: 'PATCH',
                    body: imageAvatar
                });
                if (res.ok) {
                    console.log('immagine caricata');

                    let response = await res.json();
                    console.log(response);
                    if (response) {
                        let res2 = await fetch(API + response._id, {
                            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json' },
                            method: 'PUT',
                            body: JSON.stringify({ ...editProfile, avatar: response.avatar })
                        });

                        if (res2.ok) {
                            setLoading(false);
                            let json = await res2.json();
                            setShowEditBar(false);
                            getProfile();
                            setRefresh(true);
                        } else {
                            setLoading(false);
                            setShowEditBar(false);
                            setRefresh(true);
                        }
                    } else {
                        console.log('response non è ok')
                    }
                    imageAvatar.delete('avatar');
                } else {
                    imageAvatar.delete('avatar');
                    setLoading(false);
                    console.log('errore col caricamento dell immagine');
                    setShowEditBar(false);
                    setRefresh(true);
                }
            } else {

                let res = await fetch(API + editProfile._id, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json' },
                    method: 'PUT',
                    body: JSON.stringify(editProfile)
                });

                if (res.ok) {
                    setLoading(false);
                    let json = await res.json();
                    setShowEditBar(false);
                    getProfile();
                    setRefresh(true);
                } else {
                    setLoading(false);
                    setShowEditBar(false);
                    setRefresh(true);
                }
            }


        } catch (error) {
            setLoading(false);
            setShowEditBar(false);
            setRefresh(true);
        }

    }



    useEffect(() => {
        getProfile();
    }, [refresh])

    return (
        <>
            <Container fluid className="p-0 ">
                <MyNav />

                <Container fluid className='herobarber' style={{ backgroundImage: `url(${admin.avatar})` }}>

                </Container>

                <Container className=' p-5'>
                    <Row className='g-2 justify-content-center'>
                        
                                <Col>
                                    <img alt='immagine profilo' src={admin.avatar ?? ''} style={{ width: '180px', height: '180px', objectFit: 'cover' }} className='rounded-circle' />
                                </Col>
                                <Col xs={12} md={9} className=''>
                                    {admin.barber && <span className='warning d-block'>*Account Professional</span>}
                                    <h3 className='px-2'>{admin.name} {admin.lastname}</h3>
                                    <span className='px-2'>{admin.email}</span>
                                    <hr className='w-75'></hr>
                                    {admin.address?.street && <h4 className='px-2'>Indirizzo</h4>}
                                    <span className='px-2'>{admin.address?.street}</span>
                                    <span className='px-2'>{admin.address?.city}</span>
                                    <span className='px-2'>{admin.address?.postalCode}</span>
                                    <span className='px-2'>{admin.address?.country}</span>
                                    <Row className='p-1'>

                                        <span className='nav-link btn-outline-light success px-2 mt-3 link w-auto' onClick={() => { setShowEditBar(true) }}>Modifica profilo</span>
                                        <span className='nav-link btn-outline-light warning px-2 mt-3 link w-auto' onClick={() => { setShowEditBar(true) }}>Elimina profilo</span>
                                    </Row>
                                </Col>
                            

                            {admin.barber && <Container className='my-3'>
                                <Button className='bg-primary' onClick={handleModalService}>Aggiungi Servizio +</Button>
                            </Container>}

                            {admin.barber && admin.services.map((el) => {
                                return <Container key={el.name} className='p-4 border rounded my-1'>
                                    <h3>{el.name}</h3>
                                    <span>{el.description}</span><br></br>
                                    <span>Durata: <b>{el.duration} min</b></span><br></br>
                                    <span><b>{el.price}€</b></span><br></br>
                                    <span className='link info me-3' onClick={() => deleteService(el._id)}>Elimina</span>
                                    <span className='link primary' onClick={() => handleModalEditService(el)}>Modifica</span>
                                </Container>
                            })}
                        
                    </Row>
                </Container>
            </Container>

            <MyFooter />



            {/* Modal add service */}
            <Modal show={modalService} onHide={handleModalService}>
                <Modal.Header closeButton>
                    <Modal.Title>Aggiungi Servizio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control type='text' placeholder='Nome' id='name' className='my-2' onChange={(el) => handleService(el.target)} />
                            <Form.Control type='text' placeholder='Descrizione' id='description' className='my-2' onChange={(el) => handleService(el.target)} />
                            <Form.Control type='number' min={0} placeholder='Prezzo' id='price' className='my-2' onChange={(el) => handleService(el.target)} />
                            <Form.Control type='number' min={0} placeholder='Duration' id='duration' className='my-2' onChange={(el) => handleService(el.target)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalService}>
                        Annulla
                    </Button>
                    <Button variant="primary" onClick={addService}>
                        Aggiungi
                    </Button>
                    {loading && <Container className='row'>
                        <span>Caricamento in corso...  <Spinner animation="grow" variant="success" /></span>
                    </Container>}
                </Modal.Footer>
            </Modal>

            {/* Modal edit service */}
            <Modal show={modalEditService} onHide={handleModalEditService}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifica Servizio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type='text' placeholder='Nome' id='name' className='my-2' defaultValue={service.name} onChange={(el) => handleService(el.target)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type='text' placeholder='Descrizione' id='description' className='my-2' defaultValue={service.description} onChange={(el) => handleService(el.target)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type='number' min={0} placeholder='Prezzo' id='price' className='my-2' defaultValue={service.price} onChange={(el) => handleService(el.target)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Durata</Form.Label>
                            <Form.Control type='number' min={0} placeholder='Durata' id='duration' className='my-2' defaultValue={service?.duration} onChange={(el) => handleService(el.target)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalEditService}>
                        Annulla
                    </Button>
                    <Button variant="primary" onClick={() => updateService(service._id)}>
                        Modifica
                    </Button>
                    {loading && <Container className='row'>
                        <span>Caricamento in corso...  <Spinner animation="grow" variant="success" /></span>
                    </Container>}
                </Modal.Footer>
            </Modal>



            {/* Modal Edit Profile */}
            <Modal show={showEditBar} onHide={() => setShowEditBar(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className='info'>Modifica Profilo {admin.barber && 'Professional'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control type='text' defaultValue={admin.name} id='name' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.lastname} id='lastname' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.email} id='email' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='tel' defaultValue={admin.phone} placeholder='telefono' id='phone' className='my-2' onChange={(el) => handleForm(el.target)} />
                            {admin.barber && <Form.Control type='text' defaultValue={admin.salon} placeholder='Nome Salone' id='salon' className='my-2' onChange={(el) => handleForm(el.target)} />}
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type='text' defaultValue={admin.address?.street} placeholder='Via ...' id='street' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.address?.postalCode} placeholder='CAP' id='postalCode' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.address?.city} placeholder='Città' id='city' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.address?.country} placeholder='Provincia' id='country' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.address?.countryCode} placeholder='Provincia Code' id='countryCode' className='my-2' onChange={(el) => handleForm(el.target)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type='file' id='avatar' onChange={(e) => handleImage(e.target.files[0])} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="bg-secondary" onClick={() => setShowEditBar(false)}>
                        Annulla
                    </Button>
                    <Button className="bg-success" onClick={updateProfile}>
                        Modifica
                    </Button>
                    {loading && <Container className='row'>
                        <span>Caricamento in corso...  <Spinner animation="grow" variant="success" /></span>
                    </Container>}
                </Modal.Footer>
            </Modal>


            {/* Modal Delete Account */}
            {/* <Modal show={showDelete} onHide={setShowDelete(false)}>
                <Modal.Header>
                    <h4>Elimina Account</h4>
                </Modal.Header>
                <Modal.Body>
                    <h5>Sei sicuro di voler eliminare il tuo account?</h5>
                    <div className='row'>
                        <span className='nav-link link dark'>Annulla</span>
                        <Button className='nav-link '>Elimina</Button>
                    </div>
                </Modal.Body>
            </Modal> */}
        </>
    )
}
