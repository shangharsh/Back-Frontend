import { TextField } from '@mui/material'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import {Row, Col, Form} from 'react-bootstrap'

const SignUp = () => {
  return (
    <Container>
      <Row>
        <Col xs={12} md={6}>
        <h1>Sign Up</h1>
        <Form>
          <TextField id='name' variant='outlined' className='mb-4' required label='name' placeholder='Enter Name Here' fullWidth autoFocus/>
          <TextField id='email' variant='outlined' className='mb-4' required label='email' placeholder='Enter Email Here' fullWidth autoFocus/>
          <TextField id='password' variant='outlined' className='mb-4' required label='password' placeholder='Enter Password Here' fullWidth autoFocus/>
          <TextField id='password' variant='outlined' className='mb-4' required label='password' placeholder='Enter Re-Password Here' fullWidth autoFocus/>
          <Button type='submit'>Submit</Button>
        </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default SignUp