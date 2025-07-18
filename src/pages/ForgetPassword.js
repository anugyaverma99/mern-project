import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Correct import
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // ✅ make sure this is from 'react-router-dom'

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ prevent default form behavior

    try {
      await axios.post("http://localhost:5000/auth/send-reset-token", { email },{withCredentials:true});
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      console.error("Failed to send reset code:", err);
      alert("Failed to send reset code. Please check your email.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Reset Code</button>
    </form>
  );
};

export default ForgetPassword;
