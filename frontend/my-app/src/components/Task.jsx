import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../supports/AuthProvider';
import host from '../config/host.json';
import { toast } from 'react-toastify';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;

const Task = () => {
    const [data, setData] = useState('');
    const [countSent, setCountSent] = useState('');
    const [serviceName, setServiceName] = useState('');
    //const [pokemonTaskName, setPokemonTaskName] = useState('');
    //const [deadline, setDeadline] = useState('');
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
                // xử lý e-mail để lấy tên dịch vụ smtp
                const getUserEmail = localStorage.getItem('email');
                const parts = getUserEmail.split('@');
                const domainParts = parts[1].split('.');

                // fetch api
                const response = await axios.get(`${SERVER_API}${API_ENDPOINT}/mails`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                
                setData(response.data.data);
                setCountSent(response.data);
                setServiceName(domainParts[0]);

                //console.log("Check count sent mail: " + countSent.the_number_of_mail_sent)              
        }
        catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [auth.token]);    
    
    // if (!data || !pokemonTaskName) {
    //     return <div>Đang tải dữ liệu...</div>;
    // }

    // const handleUpdateClick = (jobId) => {
    //     navigate(`/update/${jobId}`);
    // };

    const removeMailFromStack = async (mailId) => {
        try {
            await axios.get(`${SERVER_API}/sanctum/csrf-cookie`, { withCredentials: true });
            const response = await axios.patch(`${SERVER_API}${API_ENDPOINT}/finish/mail/${mailId}`, 
                // status: '0' // Cap nhat thanh '0' (hoan thanhf Task)
                null, {
                headers: {
                    "Accept-Language": "en-US,en;q=0.9",
                    'Content-Type': 'application/json',
                    'Charset':'utf-8',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Sau khi cập nhật thành công, cập nhật lại danh sách công việc
            if (response.data.success) {
                // Bởi vì phương thức PUT đã trả về controller có chức năng tự xử lí update trường status = 0 (xử lí phía backend) rồi nên ko cần xử lí phía frontend

                // const updatedJobs = data.map(jobs => {
                //     if (jobs.id === jobId) {
                //         return { ...jobs, status: '0' };
                //     }
                //     return jobs;
                // });
                // setData(updatedJobs);
                // console.log(response.headers)
                // 
                console.log('Đã đánh dấu hoàn thành');
                window.location.reload();
            } else {
                toast.warning('Hãy tải lại trang', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                // console.log(response.headers)
                console.error('Không thể hoàn thành, có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Có lỗi xảy ra. Nội dung lỗi: ', error);
        }
    };

    const sendMailFunction = async (e) => { // sendAll MAils
        e.preventDefault();
        try {
            const email = localStorage.getItem('email');
            //const assistant = localStorage.getItem('pokemon_name');
            const smtp = localStorage.getItem('SMTP_password');
         
            const sendData = {
                email: email,
                //assistant: assistant,
                smtp: smtp // Sửa lỗi gán 'deadline' vào 'email'
            };
            const response = await axios.post(`${SERVER_API}${API_ENDPOINT}/send`, sendData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Content-Type': 'application/json',
                        'Charset':'utf-8',
                        'Access-Control-Allow-Origin': '*',
                        'supports_credentials' : true,
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                },
                {withCredentials: true}
            );
           

            if (response.data.success) {
                console.log('Dang gui tin hieu toi SMTP...'); 
            } else {             
                console.error('Co loi xay ra');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        e.target.innerHTML = '<p style="cursor:not-allowed">Đang gửi e-mail</p>';
    };
   
    return (
      <div className='container'>
        {/* <div>
            {(dateOnDeadline) ? (
                <div className='text-danger mb-4 mt-1' onClick={sendMailFunction} id="notification-on-centerr">CẢNH BÁO: Có lời nhắc sắp đến hạn hôm nay, hãy kiểm tra lại<br />Nhấn vào đây để tắt</div>
            ) : (
                <div className='mb-4 mt-1'><i>Hãy hover vào từng trợ thủ để xem chúng nhắc bạn điều gì</i></div>
            )}
        </div> */}
        <h4>Danh sách e-mail (E-mail Stack)</h4>
        <div className='mb-4 text-danger'>
            <i>Các e-mail phía dưới đang được chờ để gửi đi. Hãy kiểm tra thật cẩn thận trước khi nhấn nút <strong>Gửi toàn bộ</strong>, vì không thể hoàn tác sau khi thực hiện nhấn nút.</i>
        </div>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tiêu đề thư</th>
                    <th scope="col">Nội dung thư</th>
                    <th scope="col">Đính kèm tệp</th>
                    <th scope="col">Gửi đến địa chỉ</th>
                    {/* <th scope="col">Trợ thủ</th> */}
                    {/* <th scope="col">Cập nhật công việc</th> */}
                    <th scope="col">Gỡ khỏi stack</th>
                </tr>
            </thead>
            <tbody>
                {(data.length === 0) ? (
                    <tr>
                        <td colSpan="7" className="text-center">Không có thư khả dụng</td>
                    </tr>
                ) : (
                    // pokemonTaskName.map(pokemons => (
                        data.map((mails) => (
                            // mails.status === '1' && 
                            (
                                <tr key={mails.id}>
                                    <td>{stt++}</td>
                                    <td>{mails.subject}</td>
                                    <td>{mails.content}</td>
                                    <td>{mails.attachment == null && <p>Không có</p>}
                                        {mails.attachment != '' && mails.attachment}</td>
                                    <td>{mails.to}</td>
                                    {/* {mails.priority_level === 'easy' && <p className='text-success'><BsEmojiSmile /> Thấp</p>}
                                    {mails.priority_level === 'middle' && <p className='text-warning'><BsEmojiAstonished /> Trung bình</p>}
                                    {mails.priority_level === 'difficult' && <p className='text-danger'><BsEmojiAngry /> Cao</p>} */}
                                    {/* <td>{pokemonTaskName[index] ? (<a className='force-link link-offset-2 link-underline link-underline-opacity-0' >{pokemonTaskName[index].character_name}</a> ) : (<p>Lời nhắc này không có trợ thủ!</p>)}</td> */}
                                    {/* <td>
                                        <button onClick={ () => handleUpdateClick(mails.id) } className='btn btn-sm btn-secondary'>Chỉnh sửa</button>
                                    </td> */}
                                    <td>
                                        <button className='btn btn-danger' onClick={ () => removeMailFromStack(mails.id)}>X</button>
                                    </td>
                                </tr>
                                // ))
                            )
                        )
                    ))}
            </tbody>
        </table>
        <div>
            {(countSent.the_number_of_mail_sent > 0) ? (<p>Trong lịch sử, bạn có <a href="/history" className="no-underline-link"> {countSent.the_number_of_mail_sent} thư đã gửi</a>, hãy kiểm tra chúng trong hộp thư đã gửi ({serviceName}).</p>) : (`Lịch sử sẽ ghi nhận thư sau khi bạn sử dụng ứng dụng.`)}
        </div>
        <div className='text-center mt-4 mb-4'>
            {(data.length > 0) ? (
                <button className='btn btn-primary' onClick={sendMailFunction}>Gửi toàn bộ thư ở trên</button>
            ) : (
                ''
            )}
        </div>
        {/* <div>
           {assistId !== '0' && data.length !== 0 && <img src={`/assets/${assistId}.png`} className='img-need-hover-login' alt={`${pokemonName}`} title={`${pokemonName} thắc mắc rằng bạn đã hoàn thành mọi công việc hay chưa?`} width={`40%`} height={`30%`} />}
           {assistId === '0' && <></>}
           {assistId !== '0' && data.length === 0 && <img src={`/assets/${assistId}.png`} className='img-need-hover-login' alt={`${pokemonName}`} title={`${pokemonName} đang vui vẻ vì bạn đang rảnh rỗi`} width={`40%`} height={`30%`} />}
        </div> */}
      </div>
    )
  }


export default Task;