import {Route,Routes} from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from './Home';    
import Login from './Login';
import Dashboard from './pages/Dashboard';
import {useState} from 'react';
import { Navigate,useNavigate } from 'react-router-dom';
import axios from "axios";
import {useEffect} from "react";
function App() {
  const navigate=useNavigate();
    
    const [userDetails,setUserDetails]=useState(null);
    const updateUserDetails=(updatedData)=>{
        setUserDetails(updatedData);
    };
    const isUserLoggedIn=async()=>{
      try{
        const response=await axios.post('http://localhost:5000/auth/is-user-logged-in',{},{
          withCredentials:true
        });
        updateUserDetails(response.data.userDetails);
        
              }catch(error){
                console.log('User not logged in',error);
              }
    };
    useEffect(()=>{
      isUserLoggedIn();

    },[]);
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Home/></AppLayout>}/>
      <Route path="/login" element={userDetails? <Navigate to='/dashboard' />:<AppLayout><Login updateUserDetails={updateUserDetails} /></AppLayout>}/>
      <Route path="/dashboard" element={userDetails?<Dashboard />: <Navigate to="/login" /> }/>
    </Routes>
  );
}

export default App;
