import {Routes, Route} from 'react-router-dom'
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import PageNotFound from './pages/errors/NotFound/PageNotFound';
import { ToastContainer } from 'react-toastify';
import Products from './pages/admin/products';
import SecureRoute from './routes/SecureRoute';
import UserProducts from './pages/users/Products';
import AdminRoute from './routes/AdminRoute';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>

      <Route path='' element={<SecureRoute/>}>
        <Route path='' element={<AdminRoute/>}>
          <Route path='/products' element={<Products/>}/>
        </Route>
          <Route path='/all/products' element={<UserProducts/>}/>
      </Route>

      <Route path='*' element={<PageNotFound/>}/>
    </Routes>
    <ToastContainer/>
    </>
  )
}

export default App
