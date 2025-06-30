import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from './Home';
import Login from './Login';
import Dashboard from './pages/Dashboard';
import { useState, useEffect } from 'react';
import axios from "axios";
import Error from './pages/Error';
import Logout from './pages/Logout';
import Register from './pages/Register'
import { serverEndpoint } from './config';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from "./layout/UserLayout";

function App() {
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const dispatch = useDispatch(); // ✅ FIXED useDispatch call

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/is-user-logged-in`,
        {},
        { withCredentials: true }
      );
      dispatch({
        type: 'SET_USER',
        payload: response.data.userDetails,
      });
    } catch (error) {
      console.log('User not logged in', error);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

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
    </Routes>
  );
}

export default App;
