import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import {Row, Col, Form} from 'react-bootstrap';
import {useState} from 'react';
import { errorToast, successToast, warningToast } from '../../../services/toaster.service';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading,setIsLoading] = useState(false);

  const navigate = useNavigate();

  const registerSubmitHandler = async (e: any) =>{
    e.preventDefault();
    console.log(name,email,password);
    if(password !== confirmPassword){
      warningToast('Password and Confirm Password must be same.');
    }else{
      const data = {
        name,password,email
      };
      
      try{
        const response = await axios.post('http://localhost:8080/api/v1/auth/register',data);

      if(response.data.status){
        navigate('/');
        successToast(response.data.message);
      }
      }
      catch(error:any){
        errorToast(error.response.data.error)
      }
    }
  };


  return (
      <Row className='d-flex justify-content-center align-items-center'>
        <Col xs={12} md={6}>
        <h1 className='fs-4'>Sign Up</h1>
        <Form onSubmit={registerSubmitHandler}>
          <TextField id='name' variant='outlined' className='mb-4' required label='Name' placeholder='Enter Name Here' fullWidth autoFocus onChange ={(e) => setName(e.target.value)}/>
          <TextField id='email' variant='outlined' className='mb-4' required label='Email' placeholder='Enter Email Here' fullWidth onChange={(e)=> setEmail(e.target.value)}/>
          <TextField id='password' variant='outlined' className='mb-4' required label='Password' placeholder='Enter Password Here' fullWidth onChange={(e)=> setPassword(e.target.value)}/>
          <TextField id='confirm-password' variant='outlined' className='mb-4' required label='Confirm-password' placeholder='Enter Re-Password Here' fullWidth onChange={(e)=> setConfirmPassword(e.target.value)}/>
          <Button type='submit' variant='contained'>Submit</Button>
        </Form>
        </Col>
      </Row>
  )
}
export default SignUp