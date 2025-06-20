import {Route,Routes} from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from './Home';    
import Login from './Login';
import Dashboard from './pages/Dashboard';
import {useState} from 'react';
import { Navigate } from 'react-router-dom';
function App() {
    
    const [userDetails,setUserDetails]=useState(null);
    const updateUserDetails=(updatedData)=>{
        setUserDetails(updatedData);
    };
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Home/></AppLayout>}/>
      <Route path="/login" element={userDetails? <Navigate to='/dashboard ' />:<AppLayout><Login updateUserDetails={updateUserDetails} /></AppLayout>}/>
      <Route path="/dashboard" element={userDetails?<Dashboard />: <Navigate to="/login" /> }/>
    </Routes>
  );
}

export default App;
