/* eslint-disable */

import { login, logout } from './login';
import { search } from './search';
import { showAlert } from './alerts';
import { enrollCourses } from './enroll';
import { deleteCourse, swapCourse } from './mainpage';
// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');

// DELEGATION

if (loginForm)
   loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
   });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

//search pages
const btntim = document.getElementById('btntim');
if (btntim) {
   btntim.addEventListener('click', (e) => {
      e.preventDefault();
      const search_text = document.getElementById('txtSearch')?.value;
      const option = document.getElementById('ddlMonHoc')?.value;
      if (search_text?.trim() === '') return;
      const optionObjs = { 0: 'subject_id', 1: 'subjectname' };
      //console.log();
      search(search_text, optionObjs[option]);
   });
}

/// main page
const btnMain = document.querySelector('.btn-delete-swap');
const btn_open = document.querySelector('.btn-search');
if (btnMain) {
   btnMain.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('btn-xoa')) deleteCourse(e.target.getAttribute('data-idCourse'));
      if (e.target.classList.contains('btn-swap')) swapCourse(e.target.getAttribute('data-idCourse'));
   });
}
if (btn_open) {
   btn_open.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('btn-swap')) swapCourse(e.target.getAttribute('data-idCourse'));
   });
}

// enroll course
const btnEnroll = document.querySelector('.btn-enroll');
if (btnEnroll) {
   btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('enroll-course')) enrollCourses(e.target.getAttribute('data-idCourse'));
   });
}
