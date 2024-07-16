import React, { Component, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Task from './Task';
import host from '../config/host.json';
import { Navigate, useNavigate  } from 'react-router-dom';
// import Logout from './Logout';
import { useAuth } from '../supports/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
// import './css/hover.css';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;

const Layout = ()  => {
  const [selectOption, setSelectOption] = useState('');
  const [auth, setAuth] = useState({
    token : localStorage.getItem('token') || null,
    isAuthenticated : localStorage.getItem('token') ? true : false
  });

  const [formData, setFormData] = useState({
    content: '',
    priority_level: '',
    assist_id: '',
    deadline: ''
  });

  const handleChange = (e) => {
    const inputElement = document.getElementById('assist_id');
    if(inputElement){
      setSelectOption(inputElement.value);
    }
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${SERVER_API}${API_ENDPOINT}/save`, formData, {
            headers: {
              // 'Content-Type': `application/x-www-form-urlencoded`,
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.data.success) {
            console.log('Task added successfully:', response.data.result);
            // Optionally reset form after successful submission
            setFormData({
                subject: '',
                content: '',
                attachment: '',
                to: ''
            });
        } else {
            setFormData({
              subject: '',
              content: '',
              attachment: '',
              to: ''
            });
            
            toast.success('Đã thêm thành công. Hãy tải lại trang', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            console.error('Failed to add task:', response.data.message);
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
  };

  const display_name = localStorage.getItem('email');

  if(!localStorage.getItem('assistant')) {
    const assist_id = Math.floor(Math.random() * 10) + 1;
    const assist_id_ = assist_id.toString();

    localStorage.setItem('assistant', assist_id_);
  }

  const assist_id_main = localStorage.getItem('assistant');
  // const [username, setUsername] = useState('');

  // useEffect(() => {
  //   if(originUsername) {
  //     const parts = originUsername.split('@'); // Tách email thành mảng gồm phần trước và sau dấu @
  //     if (parts.length > 0) {
  //         setUsername(parts[0]); // Lấy phần tử đầu tiên là phần trước dấu @
  //     }
  //   }
  // }, [originUsername]);

  const navigate = useNavigate();
 
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    localStorage.removeItem('SMTP_password');
    // localStorage.removeItem('pokemon_name');
    setAuth({ 
        token: null,
        isAuthenticated: false 
    });
    toast.warning('Đã đăng xuất. Hãy đăng nhập lại', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
  });
    navigate('/login');
}

    return (
      <div className='container'>
        <div className="row">
          <div className="col-2 col-md-2 mb-4 mt-3">
            <a href="/welcome" className='no-underline-link'>&lt; Quay lại Trang chủ</a>
          </div>
          <div className="col-md-8 col-8 text-center mb-4 mt-3">
            <h2 className='w-100 d-flex justify-content-center'>Gửi thư đồng loạt</h2>
            <h5 className='justify-content-center'><i>(Dragonite - Beta Dev.)</i></h5>
            <small><i>Người dùng: {display_name}* - Trợ lý chính:  
                {assist_id_main === '1' && ' Venusaur'}
                {assist_id_main === '2' && ' Pikachu'}
                {assist_id_main === '3' && ' Charizard'}
                {assist_id_main === '4' && ' Umbreon'}
                {assist_id_main === '5' && ' Lapras'}
                {assist_id_main === '6' && ' Dragonite'}
                {assist_id_main === '7' && ' Blastoise'}
                {assist_id_main === '8' && ' Dragapult'}
                {assist_id_main === '9' && ' Clefable'}
                {assist_id_main === '10' && ' Lucario'}
                {/* {(assist_id_main !== '1' 
                && assist_id_main !== '2' 
                && assist_id_main !== '3'  
                && assist_id_main !== '4'  
                && assist_id_main !== '5') && ' Không có'} */}
            **</i></small>
          </div>
          <div className="col-md-2 col-2">
            <div className='mt-4'>
              <button onClick={logout} className='btn btn-sm btn-danger'>Đăng xuất</button>
            </div>
          </div>
        </div>
        <div className="row">
            <div className="col-md-4">
                <h4>Thêm nội dung thư của bạn</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 mt-3">
                        <label htmlFor='content' className="form-label">Tiêu đề thư (title mail):</label>
                        <input type='text' 
                          className='form-control' 
                          id='subject' 
                          name='subject' 
                          placeholder='Nhập tiêu đề ...' 
                          value={formData.subject}
                          onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor='content' className="form-label">Nội dung thư (body mail):</label>
                        <input type='text' 
                          className='form-control' 
                          id='content' 
                          name='content' 
                          placeholder='Nhập nội dung...' 
                          value={formData.content}
                          onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor='attachment' className="form-label">Tệp đính kèm (attachment):</label>
                        <input type='file' 
                          className='form-control' 
                          id='attachment' 
                          name='attachment' 
                          value={formData.attachment}
                          onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor='content' className="form-label">Địa chỉ gửi đến (to Address):</label>
                        <input type='email' 
                          className='form-control' 
                          id='to' 
                          name='to' 
                          placeholder='Nhập Địa chỉ gửi...' 
                          value={formData.to}
                          onChange={handleChange}
                        />
                    </div>
                    {/* <div className="mb-3 mt-3">
                        <label htmlFor='priority_level' className="form-label">Mức ưu tiên:</label>
                        <select
                          name="priority_level"
                          id="priority_level"
                          className='form-control'
                          value={formData.priority_level}
                          onChange={handleChange}
                        >
                          <option className='text-success font-weight-bold' value="">-- Chọn 1 mức độ --</option>
                          <option className='text-success font-weight-bold' value="easy">Mặc định</option>
                          <option className='text-warning font-weight-bold' value="middle">Vừa phải</option>
                          <option className='text-danger font-weight-bold' value="difficult">Cao</option>
                        </select>
                    </div> */}
                    {/* <div className="mb-3 mt-3">
                        <label htmlFor='assist_id' className="form-label">Chọn trợ thủ riêng cho lời nhắc:</label>
                        <select
                          name="assist_id"
                          id="assist_id"
                          className='form-control'
                          value={formData.assist_id}
                          onChange={handleChange}
                        >
                          <option className='text-primary font-weight-bold' value="">-- Chọn 1 trợ thủ --</option>
                          <option className='text-primary font-weight-bold' value="2">Snorlax</option>
                          <option className='text-success font-weight-bold' value="3">Leafeon</option>
                          <option className='text-warning font-weight-bold' value="4">Lucario</option>
                        </select>
                    </div> */}
                    {/* <div className="mb-3 mt-3">
                        <label htmlFor='deadline' className="form-label">Thời hạn:</label>
                        <input 
                          type="datetime-local" 
                          id="deadline" 
                          name="deadline" 
                          min="2024-01-01T00:00" 
                          max="2038-01-19T03:14"
                          className='form-control'
                          value={formData.deadline}
                          onChange={handleChange}
                        ></input>
                    </div> */}
                    <div className='text-center mt-4 mb-3'>
                      <button type="submit" className='btn btn-secondary mb-3'>Thêm thư này (Send to stack)</button>
                    </div>
                </form>
            </div>
            <div className="col-md-8">  
              {selectOption !== '0' && <img src={`/assets/add/${selectOption}.png`} className='img-need-hover' alt=''/>}       
              {selectOption === '1' && <p><i>Hình ảnh về trợ thủ của bạn sẽ xuất hiện tại đây, sau khi bạn nhấn qua từng mục trong trường <strong>'Chọn trợ thủ riêng cho lời nhắc'</strong></i></p>}       
                <Task/>
            </div>
        </div>
        <div className='row mt-4 mb-4'>
          <div className='col-6 col-md-6 text-center'>
            <small><i><strong>----- Các chú thích: -----</strong></i></small><br />
          </div>
          <small><strong>*</strong><i>: Đây là địa chỉ e-mail của bạn, nó cùng với mật khẩu ứng dụng SMTP được dùng để thực thi việc gửi thư e-mail</i></small> <br />
          <small><strong>**</strong><i>: Trợ lý là người bạn được chọn ngẫu nhiên trong mỗi phiên đăng nhập, sẽ giúp giữ chân bạn ở lại ứng dụng lâu hơn</i></small><br />
        </div>
      </div>
    )
  }


export default Layout;