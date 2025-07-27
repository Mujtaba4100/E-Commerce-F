import { loginUser } from "../../dist/assets/api/auth.js";


document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const credentials = {
    email: form.email.value,
    password: form.password.value
  };

  try {
    const result = await loginUser(credentials);

    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', result.user.id);
      localStorage.setItem('userEmail', result.user.email);
      localStorage.setItem('userName', result.user.name);
      localStorage.setItem('userRole', result.user.role);

      alert('Login successful!');

      if (result.user.role === 'admin') {
         //console.log("admin is here")
       window.location.href = '../admin.html'; // 👈 admin page
       
      } else {
        window.location.href = '../index.html'; // 👈 regular user
      }
    } else {
      alert(result.message || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    alert('Login failed');
  }
});
