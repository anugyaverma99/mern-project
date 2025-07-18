import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useState, useEffect } from 'react';
import axios from "axios";
import Error from './pages/Error';
import Logout from './pages/Logout';
import Register from './pages/Register'
import { serverEndpoint } from './config/config';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from "./layout/UserLayout";
import Spinner from"./components/Spinner";
import UserDashBoard from "./pages/Users/UserDashBoard";
import ProtectedRoute from "./rbac/ProtectedRoute";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import ManagePayments from "./pages/payments/ManagePayments";
import AnalyticsDashboard from "./pages/links/AnalyticsDashboard";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const dispatch = useDispatch(); // ✅ FIXED useDispatch call
const [loading,setLoading]=useState(true);
  const isUserLoggedIn = async () => {
    try {
      const response = await axios.get(
        `${serverEndpoint}/auth/is-user-logged-in`,
        
        { withCredentials: true }
      );
      dispatch({
        type: 'SET_USER',
        payload: response.data.userDetails,
      });
    } catch (error) {
      console.log('User not logged in', error);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);
  if(loading){
    return <Spinner/>
  }

  return (
    <Routes>
      {/* HOME ROUTE */}
      <Route
        path="/"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout><Home /></AppLayout>
          )
        }
      />

      {/* LOGIN ROUTE */}
      <Route
        path="/login"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout><Login /></AppLayout>
          )
        }
      />
      <Route path="/register" 
      element={userDetails ?
         <Navigate to='/dashboard' /> :
         <AppLayout><Register /></AppLayout>
          } />

      {/* DASHBOARD ROUTE */}
      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <UserLayout><Dashboard /></UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/users" element={userDetails ? 
      <ProtectedRoute roles={['admin']}>
      <UserLayout><UserDashBoard />
      </UserLayout> 
      </ProtectedRoute>: <Navigate to='/login' />
       } />

       <Route path="/unauthorized-access" element={userDetails?
        <UserLayout> <UnauthorizedAccess/></UserLayout>:<Navigate to="/login"/>
       }/>


      {/* LOGOUT ROUTE */}
      <Route
        path="/logout"
        element={
          userDetails ? <Logout /> : <Navigate to="/login" />
        }
      />

      {/* ERROR ROUTE */}
      <Route
        path="/error"
        element={
          userDetails ? (
            <UserLayout><Error /></UserLayout>
          ) : (
            <AppLayout><Error /></AppLayout>
          )
        }
      />
      <Route path="/manage-payment" element={userDetails ?
              <UserLayout>
                <ManagePayments />
              </UserLayout> :
              <Navigate to='/login' />
            } />
      
      <Route path="/analytics/:linkId" element={userDetails?
        <UserLayout>
          <AnalyticsDashboard/>
        </UserLayout>:<Navigate to="/login"/>
      }/>

      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />





    </Routes>
  );
}

export default App;
