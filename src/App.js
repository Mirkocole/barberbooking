import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './views/Homepage/Homepage';
import Login from './views/Login/Login';
import AuthContextProvider from './context/AuthContextProvider';
import Register from './views/Rigester/Register';

function App() {
  return (
    <>
      <AuthContextProvider>

        <BrowserRouter>

          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  );
}

export default App;
