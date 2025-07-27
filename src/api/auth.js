//const backendURL ='http://localhost:5000'
const backendURL = import.meta.env.VITE_BACKEND_URL;

export async function registerUser(userData) {
  const res = await fetch(`${backendURL}/api/auth/register`, {
    method: 'POST',
    headers: {
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json'
}
,
    body: JSON.stringify(userData),
  });
  console.log(res)
  return await res.json();
}

// src/api/auth.js
export async function loginUser(credentials) {
  const res = await fetch(`${backendURL}/api/auth/login`, {
    method: 'POST',
    headers: {
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json'
}
,
    body: JSON.stringify(credentials)
  });

  const data = await res.json();
  return data; // You’ll now get { token, user } or { message }
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUserRole() {
  return localStorage.getItem('userRole'); // store during login
}

