import React, { useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from './config';
import { useDispatch } from 'react-redux';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login({ updateUserDetails }) {
  const dispatch = useDispatch();

  const [FormData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...FormData,
      [name]: value,
    });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;
    if (FormData.username.trim() === '') {
      newErrors.username = 'Username is mandatory';
      isValid = false;
    }
    if (FormData.password.trim() === '') {
      newErrors.password = 'Password is mandatory';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const body = {
        username: FormData.username,
        password: FormData.password,
      };
      const configuration = {
        withCredentials: true,
      };
      try {
        const response = await axios.post(`${serverEndpoint}/auth/login`, body, configuration);
        dispatch({
          type: 'SET_USER',
          payload: response.data.userDetails,
        });
      } catch (error) {
        if (error?.response?.status === 401) {
          setErrors({ message: 'Invalid credentials' });
        } else {
          setErrors({ message: 'Something went wrong, please try again' });
        }
      }
    }
  };

  const handleGoogleSignin = async (authResponse) => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`,
        {
          idToken: authResponse.credential,
        },
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: 'SET_USER',
        payload: response.data.userDetails,
      });
    } catch (error) {
      console.error(error);
      setErrors({ message: 'Something went wrong with Google sign-in' });
    }
  };

  const handleGoogleSigninFailure = (error) => {
    console.error(error);
    setErrors({ message: 'Something went wrong while Google sign-in' });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Login</h2>

      {errors.message && (
        <div className="alert alert-danger" role="alert">
          {errors.message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            id="username"
            name="username"
            value={FormData.username}
            onChange={handleChange}
          />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            value={FormData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
      </form>

      <div className="text-center">
        <div className="my-4 d-flex align-items-center text-muted">
          <hr className="flex-grow-1" />
          <span className="px-2">OR</span>
          <hr className="flex-grow-1" />
        </div>

        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <GoogleLogin onSuccess={handleGoogleSignin} onError={handleGoogleSigninFailure} />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}

export default Login;
