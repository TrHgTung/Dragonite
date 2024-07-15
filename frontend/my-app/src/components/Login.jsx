import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate  } from 'react-router-dom';
import { useAuth } from '../supports/AuthProvider';
// import bg from './inline-img/bg/0.PNG';
import { toast } from 'react-toastify';
import host from '../config/host.json';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;
axios.defaults.withCredentials = true;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [assist, setAssist] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const handleLogin  = async (e) => {
        e.preventDefault();
        try{
            await axios.get(`${SERVER_API}/sanctum/csrf-cookie`, { withCredentials: true });
            const response = await axios.post(`${SERVER_API}${API_ENDPOINT}/login`, {
                email,
                password,
            }, { withCredentials: true });

            const { token } = response.data;
            // const { token } = JSON.stringify(response.data.token);
            // localStorage.setItem('token', JSON.stringify(response.data.token));
            // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // console.log('Successful');
            if (token) {
                login(token); 
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                toast.success('Đăng nhập thành công!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setAssist(response.data.assist_id);

                localStorage.setItem('username', email);
                localStorage.setItem('assist_id', response.data.assist_id);
                localStorage.setItem('display_name', response.data.display_name);
                localStorage.setItem('pokemon_name', response.data.pokemon_name);
                // localStorage.setItem('assist_id2', assist);
                navigate('/');
            } else {
                console.log('Đăng nhập thất bại (no token found');
                toast.error('Đăng nhập thất bại.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            // console.log(JSON.stringify(response.data.token));
            // navigate('/');
        }
        catch (error) {
            toast.error('Đăng nhập thất bại.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.log('Đăng nhập thất bại (cannot authenticate)');
        }
    };
  
    return (
        
        <div className='container'>
            <div className='mt-4'>
                <a href="/welcome" className='no-underline-link'>&lt; Quay lại Trang chủ</a>
            </div>
            <form onSubmit={handleLogin} autoComplete='off'>
                <div className="row">
                    <div className="col-md-6">
                        <img src="/bg/0_1.png" alt="review-pokemon" />
                    </div>
                    <div className="col-md-6">
                    <h2 className='w-100 d-flex justify-content-center p-3'>Yêu cầu xác thực người dùng</h2>
                        <div className="form-floating text-center">
                            <i>Bạn phải đăng nhập để có thể xem được các lời nhắc của mình</i>
                        </div>
                        <div className="form-floating mt-4">
                            <label htmlFor='email'>E-mail đăng nhập:</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-floating mt-4 mb-4">   
                            <label htmlFor='password'>Mật khẩu:</label>
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button className="btn btn-primary w-100 py-2" type="submit">Đăng nhập</button>
                        {error && <p>{error}</p>}
                        <div className='mt-3'>
                            <p>Bạn chưa có tài khoản? Hãy bắt đầu <Link to="/register">đăng ký sử dụng Lời nhắc</Link></p>
                        </div>
                    </div>
                    
                </div>
                <p><strong>Hình ảnh</strong>: <i>The Pokémon Company / Game Freak / Nintendo (1996) &copy; Pokémon</i></p>
                <p><strong>Mã nguồn</strong>: <i>Hoàng Tùng</i></p>
            </form>
        </div>
    )
  }


export default Login;