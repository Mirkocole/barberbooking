import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './views/Homepage/Homepage';
import Login from './views/Login/Login';
import AuthContextProvider from './context/AuthContextProvider';
import Register from './views/Rigester/Register';
import ProtectedAuthRoute from './components/ProtectedAuthRoute/ProtectedAuthRoute';
import Profile from './views/Profile/Profile';
import ProtectedAuthBarberRoute from './components/ProtectedAuthBarberRoute/ProtectedAuthBarberRoute';
import Calendar from './views/Calendar/Calendar';
import Booking from './views/Booking/Booking';

function App() {
  return (
    <>
      <AuthContextProvider>

        <BrowserRouter>

          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* Rotte protette da autenticazione */}
            <Route element={<ProtectedAuthRoute />}>

              <Route path='/' element={<Homepage />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/prenotazioni' element={<Booking />} />
              <Route path='/calendar/:id' element={<Calendar />} />
            </Route>


            {/* Rotte solo Barber */}
            <Route element={<ProtectedAuthBarberRoute />}>
              <Route path='/calendar' element={<Calendar />} />
              <Route path='/booking' element={<Booking />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  );
}

export default App;
