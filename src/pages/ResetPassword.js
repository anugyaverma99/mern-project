import React, { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedEmail = useSelector((state) => state.userDetails?.email);
  const isLoggedIn = Boolean(storedEmail);

  const [form, setForm] = useState({
    email: isLoggedIn ? storedEmail : location.state?.email || "",
    code: "",
    newPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ prevent default form behavior

    try {
      await axios.post("http://localhost:5000/auth/reset-password", form);
      alert("Password reset successful");
      navigate("/login");
      // You can optionally navigate to login or dashboard here
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("Failed to reset password. Please check your inputs and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLoggedIn && (
        <div>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      )}
      <div>
        <label>Reset Code</label>
        <input
          type="text"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
      </div>
      <div>
        <label>New Password</label>
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          required
        />
      </div>
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
