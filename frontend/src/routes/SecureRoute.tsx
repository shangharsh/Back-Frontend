import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const SecureRoute = () => {
    const {isLoggedIn} = useSelector((state: any) => state.auth);
    console.log(isLoggedIn);
  return (
    <>  
    {isLoggedIn?<Outlet/>:<Navigate to={'/'}/>}
    </>
  )
}

export default SecureRoute