// src/pages/login.js
import { loginUser } from "../api/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) {
    console.error("loginForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const credentials = {
      email: form.email.value.trim(),
      password: form.password.value
    };

    if (!credentials.email || !credentials.password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const result = await loginUser(credentials);

      if (result.token && result.user) {
        // Store user data in localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("userEmail", result.user.email);
        localStorage.setItem("userName", result.user.name);
        localStorage.setItem("userRole", result.user.role);

        alert("Login successful!");

        // Redirect based on role
        if (result.user.role === "admin") {
          window.location.href = "./admin.html"; // ✅ Admin page
        } else {
          window.location.href = "./index.html"; // ✅ Regular user
        }
      } else {
        alert(result.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please try again later.");
    }
  });
});
