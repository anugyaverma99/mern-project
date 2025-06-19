import {Route,Routes} from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from './Home';    
import Login from './Login';
import DashBoard from './Dashboard'
function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Home/></AppLayout>}/>
      <Route path="/login" element={<AppLayout><Login /></AppLayout>}/>
      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>}/>
    </Routes>
  );
}

export default App;
