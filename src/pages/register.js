// src/pages/register.js
import { registerUser } from "../api/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) {
    console.error("registerForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value
    };

    if (!userData.name || !userData.email || !userData.password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const result = await registerUser(userData);
      alert(result.message || "Registered successfully!");
      window.location.href = "./login.html";
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.message || "Registration failed. Please try again.");
    }
  });
});
