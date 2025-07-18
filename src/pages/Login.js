import React, { useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../config/config';
import { useDispatch } from 'react-redux';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login({ updateUserDetails }) {
  const dispatch = useDispatch();

  const [FormData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...FormData, [name]: value });
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
      try {
        const response = await axios.post(
          `${serverEndpoint}/auth/login`,
          { username: FormData.username, password: FormData.password },
          { withCredentials: true }
        );
        dispatch({ type: 'SET_USER', payload: response.data.userDetails });
      } catch (error) {
        setErrors({
          message:
            error?.response?.status === 401
              ? 'Invalid credentials'
              : 'Something went wrong, please try again',
        });
      }
    }
  };

  const handleGoogleSignin = async (authResponse) => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`,
        { idToken: authResponse.credential },
        { withCredentials: true }
      );
      dispatch({ type: 'SET_USER', payload: response.data.userDetails });
    } catch (error) {
      setErrors({ message: 'Something went wrong with Google sign-in' });
    }
  };

  const handleGoogleSigninFailure = () => {
    setErrors({ message: 'Something went wrong while Google sign-in' });
  };

  // ✅ Softer background gradient
  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  return (
    <div style={pageStyle}>
      <div className="card p-4 shadow-lg border-0" style={{ width: '100%', maxWidth: '420px', borderRadius: '16px' }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Login</h2>

        {errors.message && (
          <div className="alert alert-danger" role="alert">
            {errors.message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">Username</label>
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
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
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
          <div className="mb-3 text-end">
  <a href="/forget-password" className="text-decoration-none text-primary fw-medium">
    Forgot Password?
  </a>
</div>


          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary fw-semibold py-2">Login</button>
          </div>
        </form>

        <div className="text-center text-muted my-3">OR</div>

        <div className="d-flex justify-content-center">
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSignin}
              onError={handleGoogleSigninFailure}
              theme="outline"
              width="300"
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}

export default Login;
