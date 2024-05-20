import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row, Modal, Button, Form, Spinner } from 'react-bootstrap'
import MyNav from '../../components/MyNav/MyNav'
import { AuthContext } from '../../context/AuthContextProvider'

export default function Profile() {

    const { admin, getProfile } = useContext(AuthContext);

    const [refresh, setRefresh] = useState(false);

    const [loading, setLoading] = useState(false);

    const [service,setService] = useState({});

    const [modalService,setModalService] = useState(false);

    const handleModalService = ()=>{
        setModalService((prev) => !prev);
    }

    const handleService = (el)=>{
        let key = el.id;
        let value = key == 'price' ? parseInt(el.value) : el.value;

        setService((prev)=>{
            prev = {...prev,[key] : value};
            return prev
        })
    }

    

    const [editProfile, setEditProfile] = useState({ ...admin });
    const [imageAvatar, setImageAvatar] = useState(new FormData());
    const handleImage = (img) => {

        setImageAvatar((prev) => {
            prev.delete('avatar');
            prev.append('avatar', img);
            return prev;
        });

    }

    const [showEditCli, setShowEditCli] = useState(false);

    const [showEditBar, setShowEditBar] = useState(false);

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


    async function addService(){
        
        try {
            setLoading(true);
            let res = await fetch(process.env.REACT_APP_URL_BARBER+editProfile._id+'/services',{
                headers:{'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+localStorage.getItem('token')},
                method:'POST',
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

    async function deleteService(id){
        try {
            setLoading(true);
            console.log(process.env.REACT_APP_URL_BARBER+editProfile._id+'/services/'+id)
            let res = await fetch(process.env.REACT_APP_URL_BARBER+editProfile._id+'/services/'+id,{
                headers:{'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+localStorage.getItem('token')},
                method: 'PUT'
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
                    setLoading(false);
                    let json = await res.json();
                    setShowEditBar(false);
                    setRefresh(true);

                } else {
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
                    console.log('Res');
                    console.log(json);
                    setShowEditBar(false);
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

                <Container className=' p-5 border rounded'>
                    <Row xs={1} md={2} className='g-2 justify-content-center'>
                        {admin.barber && <Col xs={12} md={4}>
                            <Container className='p-4 border'>
                                <h3 className='info'>Salone: {admin.salon}</h3>
                                <img alt='immagine profilo' src={admin.cover ?? ''} style={{ maxWidth: '180px' }} />
                            </Container>
                        </Col>}
                        <Col>
                            <Container className='p-4 border rounded'>
                                <img alt='immagine profilo' src={admin.avatar ?? ''} style={{ maxWidth: '180px' }} className='rounded-circle'/>
                                {admin.barber && <span className='warning d-block'>*Account Professional</span>}
                                <h3 className='px-2'>{admin.name} {admin.lastname}</h3>
                                <span className='px-2'>{admin.email}</span>
                                <hr></hr>
                                {admin.address?.street && <h4 className='px-2'>Indirizzo</h4>}
                                <span className='px-2'>{admin.address?.street}</span>
                                <span className='px-2'>{admin.address?.city}</span>
                                <span className='px-2'>{admin.address?.postalCode}</span>
                                <span className='px-2'>{admin.address?.country}</span>
                                <Button className='nav-link btn-outline-light success px-2 mt-3' onClick={() => { setShowEditBar(true) }}>modifica profilo</Button>
                            </Container>

                            <Container className='my-3'>
                                <Button className='bg-primary' onClick={handleModalService}>Aggiungi Servizio +</Button>
                            </Container>

                            {admin.barber && admin.services.map((el) => {
                                return <Container key={el.name} className='p-4 border rounded'>
                                    <h3>{el.name}</h3>
                                    <span>{el.description}</span><br></br>
                                    <span><b>{el.price}€</b></span>
                                    <Button className='bg-danger' onClick={()=>deleteService(el._id)}>Elimina</Button>
                                </Container>
                            })}
                        </Col>
                    </Row>
                </Container>
            </Container>

            



            {/* Modal add service */}
            <Modal show={modalService} onHide={handleModalService}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifica Profilo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control type='text' placeholder='Nome' id='name' className='my-2' onChange={(el) => handleService(el.target)} />
                            <Form.Control type='text' placeholder='Descrizione' id='description' className='my-2' onChange={(el) => handleService(el.target)} />
                            <Form.Control type='number' min={0} placeholder='Prezzo' id='price' className='my-2' onChange={(el) => handleService(el.target)} />
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
        </>
    )
}
