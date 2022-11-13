const ip = document.querySelector('.hide').textContent;

const template = (courses) => {
   courses = courses.map(
      (el) => ` 
   <tr>
      <td>${el.subject_id}</td>
      <td>${el.classname}</td>
      <td>${el.subjectname}</td>
      <td>${el.stc}</td>
      <td>${el.type}</td>
      <td>${el?.time || '1-5'}</td>
      <td>${el.teachername}</td>
      <td>${el.max}</td>
      <td>${el.total}</td>
      <td>${new Date(el.dateStart).toLocaleDateString('vi-VN')}</td>
      <td>${new Date(el.dateEnd).toLocaleDateString('vi-VN')}</td>
      <td><button  data-idCourse=${el._id}  class="${
         el.max < el.total + 1 || el.isExist ? 'inactive' : ''
      } btn btn-primary btn-enroll"> ${
         el.max < el.total + 1 || el.isExist ? 'Đã đăng kí' : 'Đăng kí'
      }  </button> </td>
   </tr>
`
   );
   return ` <tr>
<td>
   <table
      width="100%"
      border="1"
      cellpadding="10"
      style="border-collapse: collapse; font-size: 12px"
      class="enrollmaintable"
   >
      <thead>
         <tr>
            <th>Mã môc học</th>
            <th>Mã lớp học phần</th>
            <th>Tên môn học</th>
            <th>STC</th>
            <th>Loại học phần</th>
            <th>Thông tin</th>
            <th>Giảng viên</th>
            <th>Giới hạn</th>
            <th>Số SV</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kêt thúc</th>
            <th>Đăng kí</th>
         </tr>
      </thead>
      <tbody class = "enroll-click">
         <ul>
            ${courses.join('')}
         </ul>
      </tbody>
   </table>
</td>
</tr>`;
};
export const enrollCourse = async (course) => {
   try {
      const res = await axios.post(`http://${ip}:8080/api/v1/courses/enroll/${course}`);
      document
         .querySelector('#datatable')
         .insertAdjacentHTML('beforebegin', `<p class="message-success">Đã đăng ký thành công</p>`);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   } catch (err) {
      console.log(err.message);
      document
         .querySelector('#datatable')
         .insertAdjacentHTML('beforebegin', `<p class="message-error">Lỗi</p>`);
      window.setTimeout(() => {
         location.reload();
      }, 1000);
   }
};
export const search = async (search_text, option) => {
   try {
      const res = await axios.get(`http://${ip}:8080/api/v1/courses?${option}=${search_text}`);
      document.querySelector('#datatable').innerHTML = template(res.data.data.data);
      console.log(document.querySelector('#datatable'));
      const btn_enroll = document.querySelector('.enroll-click');
      if (btn_enroll) {
         btn_enroll.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('btn-enroll')) {
               console.log(e.target);
               enrollCourse(e.target.getAttribute('data-idCourse'));
            }
         });
      }
      //if ((res.data.status = 'success')) location.reload(true);
   } catch (err) {
      console.log(err.message);
   }
};
