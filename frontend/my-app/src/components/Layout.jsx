import React, { Component, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Task from './Task';
import host from '../config/host.json';
import pokemon_color from '../config/pokemon-color.json';
import { Link, Navigate, useNavigate  } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Logout from './Logout';
import { useAuth } from '../supports/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
// import './css/hover.css';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;

const {Venusaur} = pokemon_color;
const {Pikachu} = pokemon_color;
const {Charizard} = pokemon_color;
const {Umbreon} = pokemon_color;
const {Lapras} = pokemon_color;
const {Dragonite} = pokemon_color;
const {Blastoise} = pokemon_color;
const {Dragapult} = pokemon_color;
const {Clefable} = pokemon_color;
const {Lucario} = pokemon_color;

const Layout = ()  => {
  const [auth, setAuth] = useState({
    token : localStorage.getItem('token') || null,
    isAuthenticated : localStorage.getItem('token') ? true : false
  });

  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    attachment: null,
    to: ''
  });

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    //const data = editor.getData();
    setFormData({
        ...formData,
        //data,
        [name]: files ? files[0] : value
    });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({
      ...formData,
      content: data
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('subject', formData.subject);
    data.append('content', formData.content);
    data.append('to', formData.to);
    if (formData.attachment) {
      data.append('attachment', formData.attachment);
    }

    try {
        const response = await axios.post(`${SERVER_API}${API_ENDPOINT}/save`, data, {
            headers: {
                'Content-Type': `multipart/form-data`,
                // 'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.data.success) {
            console.log('Task added successfully:', response.data.result);
            // Optionally reset form after successful submission
            setFormData({
                subject: '',
                content: '',
                attachment: null,
                to: ''
            });
            toast.success('Thêm thư thành công! Hãy rải lại trang', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
        } else {
            // setFormData({
            //   subject: '',
            //   content: '',
            //   attachment: '',
            //   to: ''
            // });
            
            toast.warning('Hãy tải lại trang', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            // console.error('Failed to add task:', response.data.message);
        }
    } catch (error) {
        toast.warning('Thư (không có tệp). Hãy tải lại trang.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // console.error('Error adding task:', error);
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
    localStorage.clear();
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

  const showDragonite = () => {
    toast.success('Bravo! Bạn đã tìm thấy Dragonite rồi');
  }

    useEffect(() => {
      const value = localStorage.getItem('assistant');
      if (value) {
        switch (parseInt(value, 10)) {
          case 1:
            document.body.style.backgroundColor = Venusaur;
            break;
          case 2:
            document.body.style.backgroundColor = Pikachu;
            break;
          case 3:
            document.body.style.backgroundColor = Charizard;
            break;
          case 4:
            document.body.style.backgroundColor = Umbreon;
            break;
          case 5:
            document.body.style.backgroundColor = Lapras;
            break;
          case 6:
            document.body.style.backgroundColor = Dragonite;
            break;
          case 7:
            document.body.style.backgroundColor = Blastoise;
            break;
          case 8:
            document.body.style.backgroundColor = Dragapult;
            break;
          case 9:
            document.body.style.backgroundColor = Clefable;
            break;
          default:
            document.body.style.backgroundColor = Lucario;
        }
      }
    }, []);

    const editor_configuration = {
      toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
      height: '800px'
    };

    return (
      <div className='container application-classname'>
        <div className="row">
          <div className="col-2 col-md-2 mb-4 mt-3">
            <Link to="/welcome" className='no-underline-link'>&lt; Quay lại Trang chủ</Link>
          </div>
          <div className="col-md-8 col-8 text-center mb-3 mt-5">
            <h3 className='w-100 d-flex justify-content-center'>Hệ thống gửi thư đồng loạt - Dragonite</h3>
            <small><i><strong>Người dùng:</strong> {display_name}<strong>*</strong> - <strong>Trợ lý:</strong>  
                {assist_id_main === '1' && ' Venusaur'}
                {assist_id_main === '2' && ' Pikachu'}
                {assist_id_main === '3' && ' Charizard'}
                {assist_id_main === '4' && ' Umbreon'}
                {assist_id_main === '5' && ' Lapras'}
                {assist_id_main === '6' && ( <a href="#" className="no-underline-link" onClick={showDragonite}> Dragonite</a>)}
                {assist_id_main === '7' && ' Blastoise'}
                {assist_id_main === '8' && ' Dragapult'}
                {assist_id_main === '9' && ' Clefable'}
                {assist_id_main === '10' && ' Lucario'}
                {/* {(assist_id_main !== '1' 
                && assist_id_main !== '2' 
                && assist_id_main !== '3'  
                && assist_id_main !== '4'  
                && assist_id_main !== '5') && ' Không có'} */}
            <strong>**</strong></i></small>
          </div>
          <div className="col-md-2 col-2">
            <div className='mt-4'>
              <button onClick={logout} className='btn btn-sm btn-danger'>Đăng xuất</button>
            </div>
          </div>
        </div>
        <div className="row">
            <div className="col-md-4">
                <h5>Thêm nội dung thư của bạn</h5>
                <small><i>Note: Tệp đính kèm (file attachment) là trường không bắt buộc và có giới hạn về kích cỡ tệp được tải lên, tùy vào loại tài khoản của bạn</i></small><br /><br />
                <small><i>Nếu bạn cố gắng vượt qua các giới hạn về số lượng ký tự được nhập vào các trường bằng cách chỉnh sửa các thuộc tính thông qua công cụ Kiểm tra phần tử (DevTools), thì nội dung được lưu cuối cùng vẫn sẽ bị giới hạn số lượng ký tự!</i></small><br />
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 mt-3">
                        <label htmlFor='content' className="form-label">Tiêu đề thư (e-mail subject):</label>
                        <input type='text' 
                          className='form-control' 
                          id='subject' 
                          name='subject' 
                          placeholder='Nhập tiêu đề (tối đa 100 ký tự - hỗ trợ tiếng Việt) ...' 
                          maxlength="100"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor='content' className="form-label">Nội dung thư (e-mail content):</label>
                        <CKEditor
                          editor={ClassicEditor}
                          config={editor_configuration}
                          className='' 
                          id='content' 
                          name='content' 
                          data={formData.content}
                          onChange={handleEditorChange}
                        />
                        <small>Lời khuyên: <Link to="/suggest" className='no-underline-link'>Lấy nội dung được gợi ý</Link></small>
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor='attachment' className="form-label">Tệp đính kèm (file attachment):</label>
                        <input type='file' 
                          className='form-control' 
                          id='attachment' 
                          name='attachment' 
                          // value={formData.attachment}
                          onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor='content' className="form-label">Địa chỉ gửi đến (to Address):</label>
                        <input type='email' 
                          className='form-control' 
                          id='to' 
                          name='to' 
                          placeholder='Nhập Địa chỉ gửi (tối đa 100 ký tự) ...' 
                          maxlength="50"
                          value={formData.to}
                          onChange={handleChange}
                        />
                    </div>
                    <div className='text-center mt-4 mb-3'>
                      <button type="submit" className='btn btn-secondary mb-3'>Thêm thư này (Send to stack)</button>
                    </div>
                </form>
            </div>
            <div className="col-md-8">  
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