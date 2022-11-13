const ip = document.querySelector('.hide').textContent;

const btn = document.querySelector('.btn-enroll');
const message = document.querySelector('.message-enroll');
export const enrollCourses = async (course) => {
   try {
      const res = await axios.post(`http://${ip}:8080/api/v1/courses/enroll/${course}`);
      message.insertAdjacentHTML('afterend', `<p class="message-success">Đã đăng ký thành công</p>`);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   } catch (err) {
      console.log(err.message);
      message.insertAdjacentHTML('afterend', `<p class="message-error">Lỗi</p>`);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   }
};
if (btn) {
   btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('enroll-course')) enrollCourses(e.target.getAttribute('data-idCourse'));
   });
}
