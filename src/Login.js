import {React,useState} from 'react';
import {useNavigate} from "react-router-dom";

function Login({updateUserDetails}) {
    const navigate=useNavigate();
    const [FormData,setFormData]=useState({
        username:"",
        password:""

    });
    const [errors,setErrors]=useState({});
    const [message,setMessage]=useState(null);

    const handleChange=(event)=>{
        const name=event.target.name;
        const value=event.target.value;

        setFormData({
            ...FormData, //copy old values of username and password
            [name]:value
            
        });
    };
        const validate=()=>{
            let newErrors={};
            let isValid=true;
            if(FormData.username.length===0){
                newErrors.username="Username is mendatory";
                isValid=false;
            }
            if(FormData.password.length===0){
                newErrors.password="Password is mendatory";
                isValid=false;
            }
            setErrors(newErrors);
            return isValid;

        }

   
    const handleSubmit=(e)=>{
        e.preventDefault();// prevent default behaviour of html which is to re-load form on submission
        if(validate()){
            // if(FormData.username==='admin' && FormData.password==='admin'){
            //     updateUserDetails({
            //         name:'John Cena',
            //         email:'john@cena.com'

            //     });
            //      navigate('/dashboard'); 
            // }
            // else{
            //     setMessage("Invalid Credentials");
            // }

            // INTEGRATE WITH REST ENDPOINTS

            await axios.post();
        }
    };

  return (
    <div className="container text-center">
      <h1> Login Page</h1>
      {message && (
        message
      )}
      <form onSubmit={handleSubmit}>
        <div>
            <label>UserName: </label>
            <input type="text" name="username"
             value={FormData.username}
             onChange={handleChange}/>
             {errors.username &&(errors.username)}

        </div>
        <div>
            <label>Password: </label>
            <input type="password" name="password"
             value={FormData.password}
             onChange={handleChange}/>
             {errors.password && (errors.password)}

        </div>
        <div>
            <button>Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;