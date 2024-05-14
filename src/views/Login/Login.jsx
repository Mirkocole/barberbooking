import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { AuthContext } from '../../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

export default function Login() {


    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const {admin,setAdmin} = useContext(AuthContext);

    const [user,setUser] = useState({
        email : '',
        password : ''
    });

    const [refresh,setRefresh] = useState(false);
    const [logged,setLogged] = useState(false);

    // Refresh pagina
    useEffect(()=>{
        
    },[refresh])

    const handleForm = (el)=>{
        let id = el.id;
        let value = el.value;

        setUser({...user,[id] : value});
    }

    async function login(){
        try {
            setLoading(true);
            let res = await fetch(process.env.REACT_APP_URL_AUTH+'loginClient',{
                headers : {'Content-Type' : 'application/json'},
                method: 'POST',
                body : JSON.stringify(user)
            });
            if (res.ok) {
                setLoading(false);
                let json = await res.json();
                console.log(json);

                setAdmin(json.user);
                localStorage.setItem('token',json.token);
                navigate('/');
            }else{
                setLoading(false);
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


  return (
    <>
        <Container fluid className='p-5'>

            <Container className='w-50'>
                <Form className='p-5 m-3 rounded shadow'>
                    <h3>Login</h3>
                    <Form.Group>
                        <Form.Label>
                            Email
                        </Form.Label>
                        <Form.Control type='text' placeholder={'insert your email'} id='email' onChange={(el)=>handleForm(el.target)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            Password
                        </Form.Label>
                        <Form.Control type='password' placeholder={'insert your password'} id='password' onChange={(el)=>handleForm(el.target)}/>
                    </Form.Group>
                    <Form.Group className='my-3'>
                        <Button variant='dark' className='m-2' onClick={()=>{setRefresh(!refresh)}}>Reset</Button>
                        <Button variant='success' className='m-2' onClick={login}>Login</Button>
                    </Form.Group>
                </Form>
            </Container>
        </Container>
    </>
  )
}
