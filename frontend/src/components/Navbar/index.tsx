import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import {BsFillCartCheckFill} from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slice/authSlice';
import { successToast } from '../../services/toaster.service';


const NavbarComponent = () => {
    const {name, role} = useSelector((state: any) => state.auth);

    const dispatch = useDispatch();

    const logoutHandler = () =>{
        localStorage.removeItem('persist:root');
        dispatch(logout());
        successToast('Logout Successfully.')
    }
  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg='dark' variant='light'>
      <Container>
        <Link to={'/Products'}>
            <Navbar.Brand>Ecomm</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {role ==='user' && <BsFillCartCheckFill/>}
            <NavDropdown title={name} id="basic-nav-dropdown">
              <Button variant='primary' className='w-100'>Profile</Button>
              <Button variant='danger' className='w-100 mt-1' onClick={logoutHandler}>Logout</Button>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;