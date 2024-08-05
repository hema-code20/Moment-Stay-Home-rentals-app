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

      if (response.ok) {
        navigate("/login");
      } else {
        console.log("Server error:", await response.text());
      }
    } catch (err) {
      console.log("Registration failed:", err.message);
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
            <img src="/assets/images.png" alt="Profile Photo" />
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="avatar"
              style={{ maxWidth: "80px" }}
            />
          )}

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
          <button type="submit"> Sign Up </button>
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
