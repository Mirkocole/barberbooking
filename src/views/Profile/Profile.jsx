import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row, Modal, Button, Form } from 'react-bootstrap'
import MyNav from '../../components/MyNav/MyNav'
import { AuthContext } from '../../context/AuthContextProvider'

export default function Profile() {

    const { admin } = useContext(AuthContext);

    const [refresh,setRefresh] = useState(false);

    useEffect(()=>{

    },[refresh])

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



    // Funzione modifica profilo
    async function updateProfile() {



        try {
            // Rilevo il tipo di profilo da modificare
            let API = editProfile.barber ? process.env.REACT_APP_URL_BARBER : process.env.REACT_APP_URL_CLIENT;
            console.log(imageAvatar.has('avatar'));
            if (imageAvatar.has('avatar')) {
                imageAvatar.append('user', JSON.stringify(editProfile));

                console.log(imageAvatar.get('avatar'));
                console.log(imageAvatar.get('user'));
                let res = await fetch(API + editProfile._id, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
                    method: 'PATCH',
                    body: imageAvatar
                });
                if (res.ok) {
                    
                    let json = await res.json();
                    console.log(json);
                    setRefresh(true);
                    
                } else {
                    console.log('errore col caricamento dell immagine');
                    
                }
            } else {
                let res = await fetch(API + editProfile._id, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json' },
                    method: 'PATCH',
                    body: JSON.stringify(editProfile)
                });
                console.log('Senza immagine');
                if (res.ok) {
                    let json = await res.json();
                    console.log(json);
                    setRefresh(true);
                } else {
                    console.log('errore col caricamento delle modifiche');
                }
            }

            
        } catch (error) {
            console.log('Errore Nella chiamata all API');
        }

    }

    return (
        <>
            <Container fluid className="p-0 ">
                <MyNav />

                <Container className=' p-5 border rounded'>
                    <Row xs={1} md={2} className='g-2 justify-content-center'>
                        <Col xs={12} md={4}>
                            <Container className='p-4 border'>
                                <img alt='immagine profilo' src={admin.avatar ?? ''} style={{ maxWidth: '180px' }} />
                            </Container>
                        </Col>
                        <Col>
                            <Container className='p-4 border rounded'>
                                {admin.barber && <span className='warning d-block'>*Account Professional</span>}
                                <h3 className='px-2'>{admin.name} {admin.lastname}</h3>
                                <span className='px-2'>{admin.email}</span>
                                <Button className='nav-link btn-outline-light success px-2' onClick={() => {  setShowEditBar(true) }}>modifica profilo</Button>
                            </Container>

                            {admin.barber && admin.services.map((el) => {
                                return <Container key={el.name} className='p-4 border rounded'>
                                    <h3>{el.name}</h3>
                                    <span>{el.description}</span>
                                    <span>{el.price}</span>
                                </Container>
                            })}
                        </Col>
                    </Row>
                </Container>
            </Container>



            {/* Modal Edit Profile Client */}
            {/* <Modal show={showEditCli} onHide={() => setShowEditCli(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifica Profilo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control type='text' defaultValue={admin.name} id='name' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.lastname} id='lastname' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.email} id='email' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='tel' defaultValue={admin.phone} placeholder='telefono' id='phone' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.salon} placeholder='Nome Salone' id='salon' className='my-2' onChange={(el) => handleForm(el.target)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type='text' defaultValue={admin.address?.street} placeholder='Via ...' id='street' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.address?.postalCode} placeholder='CAP' id='postalCode' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.address?.city} placeholder='Città' id='city' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.address?.country} placeholder='Provincia' id='country' className='my-2' onChange={(el) => handleForm(el.target)} />
                            <Form.Control type='text' defaultValue={admin.address?.countryCode} placeholder='Provincia Code' id='countryCode' className='my-2' onChange={(el) => handleForm(el.target)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type='file' placeholder='avatar' id='avatar' onChange={handleImage} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditCli(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => setShowEditCli(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal> */}



            {/* Modal Edit Profile Barber */}
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
                            <Form.Control type='file' id='avatar' onChange={(e)=>handleImage(e.target.files[0])} />
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
                </Modal.Footer>
            </Modal>
        </>
    )
}
