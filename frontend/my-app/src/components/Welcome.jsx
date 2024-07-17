import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { toast } from 'react-toastify';

const Welcome = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [auth, setAuth] = useState({
    token : localStorage.getItem('token') || null,
    isAuthenticated : localStorage.getItem('token') ? true : false
});

  const handleNavigation = () => {
    const check_username = localStorage.getItem('token');
    if (check_username) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  const HandleAbout = () => {
    // window.alert('Mã nguồn: GitHub/@TrHgTung');
    toast.success('Mã nguồn thuộc về Hoàng Tùng (GitHub/@TrHgTung)');
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    localStorage.removeItem('SMTP_password');
    localStorage.removeItem('assistant');
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
    <>
      <div className="row mt-4">
        <div className="col-2">
          <div className='text-center ms-5 force-link' onClick={HandleAbout}>
            <h6>Giới thiệu về ứng dụng</h6>
          </div>
        </div>
        <div className="col-7">
        </div>
        <div className="col-3">
          {username ? (
              <>
              <div className="dropdown">
              <a class="btn btn-secondary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                
              </a>
                <ul className="dropdown-menu show" aria-labelledby="dropdownMenuLink">
                  <li><a href='/' className="dropdown-item btn btn-outline-success" onClick={handleNavigation}>Truy cập dữ liệu</a></li>
                  <li><a onClick={logout} className="dropdown-item force-link btn btn-outline-danger" >Đăng xuất</a></li>
                </ul>
              </div>
              </>
          ) : (
            <a href='/login' className="btn btn-sm btn-primary" onClick={handleNavigation}>Đăng nhập</a>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12 text-center">
          <h2>Dragonite</h2>
          <p><i>Một ứng dụng gửi đồng loạt thư điện tử dành cho mọi người dùng</i></p>
          <div className='mt-3'>
            <button className='btn btn-secondary' onClick={handleNavigation}>Bắt đầu sử dụng</button>
          </div>
        </div>      
      </div>
      <div>
        <img src='/bg/0_1.png' alt="" />
      </div>
      <div className='ms-4 mb-4'>
        <p>Hình ảnh: The Pokémon Company / Game Freak / Nintendo (1996)</p>
      </div>
    </>
  )
}

export default Welcome