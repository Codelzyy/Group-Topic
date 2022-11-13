const ip = document.querySelector('.hide').textContent;

const btn = document.querySelector('.btn-delete-swap');
const btn_open = document.querySelector('.btn-search');
export const deleteCourse = async (course) => {
   try {
      const res = await axios.patch(`http://${ip}:8080/api/v1/courses/enroll/${course}`);
      location.assign('/');
   } catch (err) {
      console.log(err.message);
   }
};
export const swapCourse = async (course) => {
   try {
      window.open(`http://${ip}:8080/course/${course}`, 'name', 'width=900,height=900');
   } catch (err) {
      console.log(err.message);
   }
};
if (btn) {
   btn.addEventListener('click', (e) => {
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
