import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { Formik, Field, ErrorMessage } from 'formik';
import {Row, Col, Form} from 'react-bootstrap';
import {object, string} from 'yup';
import { AuthInterface } from '../../../interface/auth.interface';
import { postData } from '../../../services/axios.service';
import { successToast } from '../../../services/toaster.service';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../slice/authSlice';

const Login = () => {

  let initialValues = {
    email: "",
    password: "",
  };
  
  let authValidationSchema = object({
    email: string().email().required('Email is a required field.'),
    password: string().min(8, 'Minimum length of password must be 8 characters long.').required('Password is a required field.'),
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const loginHandler = async (values: AuthInterface)=>{
    const resp = await postData('/auth/login',values);
    if(resp.status === 'success'){
      const data = {
        jwt: resp.token,
        role: resp.authData.role,
        email: resp.authData.email
      }
      dispatch(login(data));
      navigate('/products');
      successToast('Login '+ resp.status);
    }
  }
  return (
    <Row className='d-flex justify-content-center align-items-center'>
        <Col xs={12} md={6}>
        <h1 className='fs-4'>Sign Up</h1>
        <Formik onSubmit={loginHandler} initialValues={initialValues} validationSchema={authValidationSchema}>
        {({handleChange, handleSubmit, touched, errors})=>(
          <Form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <TextField id='email' name='email' variant='outlined' className='mb-4' required label='Email' placeholder='Enter Email Here' fullWidth autoFocus onChange={handleChange}/>
              <span className='text-danger'>
                {touched.email && errors.email}
              </span>
            </div>
            <div className='mb-4'>
              <TextField id='password' name='password' variant='outlined' className='mb-4' required label='Password' placeholder='Enter Password Here' fullWidth onChange={handleChange}/>
              <span className='text-danger'>
                {touched.password && errors.password}
              </span>
            </div>
          <Button type='submit' variant='contained'>Submit</Button>
        </Form>
        )}
        </Formik>
        </Col>
      </Row>
  )
}

export default Login