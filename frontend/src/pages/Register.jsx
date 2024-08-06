import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const register_form = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          register_form.append(key, formData[key]);
        }
      }

      console.log("FormData contents:", ...register_form.entries());

      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: register_form,
      });

      const result = await response.json(); // Assuming server returns JSON

      if (response.ok) {
        navigate("/login");
      } else if (result.error && result.error === "User already exists") {
        window.alert("User already exists. Please use a different email or username.");
      } else {
        window.alert("Server error: " + result.message);
      }
    } catch (err) {
      window.alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />

          <label htmlFor="image">
            <img
              src={
                formData.profileImage
                  ? URL.createObjectURL(formData.profileImage)
                  : "/assets/images.png"
              }
              alt="Profile Photo"
              style={{ maxWidth: "80px", cursor: "pointer" }}
            />
          </label>

          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Have an account?{" "}
          <a href="/login">
            <span style={{ color: "blue" }}>Sign in</span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
