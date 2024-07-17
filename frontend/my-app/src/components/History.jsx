import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../supports/AuthProvider';
import host from '../config/host.json';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;

const Task = () => {
    const [data, setData] = useState('');
    const [serviceName, setServiceName] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();
    let stt = 1;
    // const pokemonName = localStorage.getItem('pokemon_name');
    const assistId = localStorage.getItem('assist_id');

    const [sendData, setSendData] = useState({
        email: '',
        //assistant: '',
        deadline: ''
    });

    useEffect(() => {
        // const validToken = localStorage.getItem("token");
        const fetchData = async () => {
            try {
                const getUserEmail = localStorage.getItem('email');
                // xử lý e-mail để lấy tên dịch vụ smtp
                const parts = getUserEmail.split('@');
                const domainParts = parts[1].split('.');

                //fetch api
                const response = await axios.get(`${SERVER_API}${API_ENDPOINT}/mails`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                
                setServiceName(domainParts[0]);
                setData(response.data.all_mails_sent);
        }
        catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [auth.token]);    

    
    if (data === null || !data) {
        return (
        <div className='container mt-4'>
           <div className='mb-4'>
                <a href="/" className='no-underline-link'>&lt; Quay lại danh sách chính</a>
            </div>
            <div className='text-center'>
                <h5>Lịch sử e-mail đã hoàn tất:  </h5>
                <div className='mb-4'>
                    <i>Dưới đây là tất cả thư mà bạn đã gửi đi thành công, hãy xem lại chúng. Bạn cũng có thể kiểm tra trong hộp thư gửi đi ({serviceName})</i>
                </div>
            </div>
           <div className='mt-4 mb-4'>
                <p> Máy chủ hiện tại không phản hồi...</p>
           </div>
        </div>
        );
    }

  
   
    return (
      <div className='container mt-4'>
        <div className='mb-4'>
                <a href="/" className='no-underline-link'>&lt; Quay lại danh sách chính</a>
            </div>
            <div className='text-center'>
                <h5>Lịch sử e-mail đã hoàn tất:  </h5>
                <div className='mb-4'>
                    <i>Dưới đây là tất cả thư mà bạn đã gửi đi thành công, hãy xem lại chúng. Bạn cũng có thể kiểm tra trong hộp thư gửi đi ({serviceName})</i>
                </div>
            </div>
           
        
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tiêu đề thư</th>
                    <th scope="col">Nội dung thư</th>
                    <th scope="col">Đính kèm tệp</th>
                    <th scope="col">Đã gửi đến địa chỉ</th>
                </tr>
            </thead>
            <tbody>
                {(data.length === 0) ? (
                    <tr>
                        <td colSpan="7" className="text-center">Không có thư khả dụng</td>
                    </tr>
                ) : (
                        data.map((mails) => (
                            (
                                <tr key={mails.id}>
                                    <td>{stt++}</td>
                                    <td>{mails.subject}</td>
                                    <td>{mails.content}</td>
                                    <td>{mails.attachment == null && <p>Không có</p>}
                                        {mails.attachment != '' && mails.attachment}</td>
                                    <td>{mails.to}</td>
                                </tr>
                            )
                        )
                    ))}
            </tbody>
        </table>
      </div>
    )
  }


export default Task;