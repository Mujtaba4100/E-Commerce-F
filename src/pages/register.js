// src/pages/register.js
import { registerUser } from "../api/auth.js";
process.env.
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const userData = {
    name: form.name.value,
    email: form.email.value,
    password: form.password.value
  };

  try {
    const result = await registerUser(userData);
    alert(result.message || 'Registered successfully!');
    // redirect to login
    window.location.href = '/login.html';
  } catch (err) {
    alert('Registration failed');
  }
});
