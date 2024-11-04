const loginForm = document.querySelector('.form-box.login form');
const registerForm = document.querySelector('.form-box.register form');

loginForm.addEventListener('submit', handleLoginSubmit);
registerForm.addEventListener('submit', handleRegisterSubmit);

function handleLoginSubmit(event) {
  event.preventDefault();

  const username = loginForm.querySelector('input[type="text"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;

  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {

    console.log('Login successful:', data);
  })
  .catch(error => {

    console.error('Login error:', error);
  });
}

function handleRegisterSubmit(event) {
  event.preventDefault(); 

  const username = registerForm.querySelector('input[type="text"]').value;
  const email = registerForm.querySelector('input[type="text"][label="Email"]').value;
  const password = registerForm.querySelector('input[type="password"]').value;


  fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
  .then(response => response.json())
  .then(data => {
   
  })
  .catch(error => {
    console.error('Registration error:', error);
  });
}