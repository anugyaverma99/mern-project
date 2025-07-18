import {useSelector} from"react-redux";
import {Navigate} from "react-router-dom";
// here roles will be array of role that willl be allowed to visit /render children component

function ProtectedRoute({roles,children}){
    const userDetails=useSelector((state)=>state.userDetails);
    return roles.includes(userDetails?.role)?children:
    <Navigate to="/unauthorized-access"/>;

}
export default ProtectedRoute;