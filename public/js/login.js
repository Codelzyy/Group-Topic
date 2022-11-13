/* eslint-disable */
const ip = document.querySelector('.hide').textContent;

// import { showAlert, hideAlert } from './alerts.js';
const hideAlert = () => {
   const el = document.querySelector('.alert');
   if (el) el.parentElement.removeChild(el);
};
const showAlert = (type, msg, time = 7) => {
   hideAlert();
   const markup = `<div class="alert alert--${type}">${msg}</div>`;
   document.querySelector('.container').insertAdjacentHTML('afterbegin', markup);
   window.setTimeout(hideAlert, time * 1000);
};
// type is 'success' or 'error'

export const login = async (email, password) => {
   try {
      const res = await axios.post(`http://${ip}:8080/api/v1/users/login`, {
         email,
      });
      console.log(res);

      if (res.status === 200) {
         showAlert('success', 'Logged in successfully!');
         window.setTimeout(() => {
            location.assign('/');
         }, 1500);
      }
   } catch (err) {
      showAlert('error', 'Sai thông tin');
   }
};

export const logout = async () => {
   try {
      const res = await axios({
         method: 'GET',
         url: '/api/v1/users/logout',
      });
      if ((res.status = 'success')) location.reload(true);
   } catch (err) {
      console.log(err.response);
      showAlert('error', 'Error logging out! Try again.');
   }
};
// const loginForm = document.querySelector('.form--login');
// const logOutBtn = document.querySelector('.nav__el--logout');

// // DELEGATION

// if (loginForm)
//    loginForm.addEventListener('submit', (e) => {
//       e.preventDefault();
//       const email = document.getElementById('email').value;
//       const password = document.getElementById('password').value;
//       login(email, password);
//    });
