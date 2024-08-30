import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../supports/AuthProvider';
import host from '../config/host.json';
import quote from '../config/quote.json';
import pokemon_color from '../config/pokemon-color.json';
import { toast } from 'react-toastify';

const { SERVER_API, API_ENDPOINT } = host;

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

const Suggest = () => {
    const [data, setData] = useState(null);
    const [pokemon, setPokemon] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);
    const [lastPage, setLastPage] = useState(1);
    const { auth } = useAuth();
    const getAssistant = localStorage.getItem('assistant');
    let stt = 1;

    useEffect(() => {
        // Set background color based on Pokemon selection
        switch(getAssistant){
            case '1':
                setPokemon('Venusaur');
                break;
            case '2':
                setPokemon('Pikachu');
                break;
            case '3':
                setPokemon('Charizard');
                break;
            case '4':
                setPokemon('Umbreon');
                break;
            case '5':
                setPokemon('Lapras');
                break;
            case '6':
                setPokemon('Dragonite');
                break;
            case '7':
                setPokemon('Blastoise');
                break;
            case '8':
                setPokemon('Dragapult');
                break;
            case '9':
                setPokemon('Clefable');
                break;
            default:
                setPokemon('Lucario');
                break;
        }
        // console.log(pokemon);
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

        // Fetch data for the current page
        fetchData(currentPage);
    }, [auth.token, currentPage]);

    const fetchData = async (page) => {
        try {
            const response = await axios.get(`${SERVER_API}${API_ENDPOINT}/suggest?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setData(response.data.paginated_data.data);
            setLastPage(response.data.paginated_data.last_page);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePagination = (page) => {
        setCurrentPage(page);
    };

    const sayMessage = () => {
        const itemRand = quote[Math.floor(Math.random() * quote.length)];
        toast.warning(itemRand);
    };

    const copyToClipboard = async (content, id) => {
        try {
            await navigator.clipboard.writeText(content);
            toast.success('Đã sao chép đoạn văn bản, hãy quay lại và dán');

            await axios.patch(`${SERVER_API}${API_ENDPOINT}/upvote/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            window.location.reload();
        } catch (error) {
            toast.warning('Không thể sao chép, lỗi không xác định');
            console.error('Lỗi copyToClipboard:', error);
        }
    };

    if (!data) {
        return (
            <div className='container mt-4'>
                <div className='mb-4'>
                    <Link to="/" className='no-underline-link'>&lt; Quay lại danh sách</Link>
                </div>
                <div className='text-center'>
                    <h5>Các gợi ý cho nội dung e-mail:</h5>
                    <div className='mb-4'>
                        <i>Hãy sao chép một trong những gợi ý nội dung e-mail phía dưới. Chúng có thể giúp bạn hoàn thiện e-mail tốt hơn</i>
                    </div>
                </div>
                <div className='mt-4 mb-4'>
                    <p> Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='container mt-4'>
            <div className='mb-4'>
                <Link to="/" className='no-underline-link'>&lt; Quay lại danh sách</Link>
            </div>
            <div className='text-center'>
                <h5>Các gợi ý cho nội dung e-mail:</h5>
                <div className='mb-4'>
                    <i>Hãy sao chép một trong những gợi ý nội dung e-mail phía dưới. Chúng có thể giúp bạn hoàn thiện e-mail tốt hơn</i>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Index</th>
                        <th scope="col">Nội dung được gợi ý</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center">Không có thư khả dụng</td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={item.id}>
                                {(stt == 1) ? (
                                    <>
                                        <td>{stt++} <i>(Được đề xuất)</i></td>
                                        <td>{item.content}</td>
                                        <td>
                                            <button className='btn btn-sm btn-secondary' onClick={() => copyToClipboard(item.content, item.id)}>Sao chép</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{stt++}</td>
                                        <td>{item.content}</td>
                                        <td>
                                            <button className='btn btn-sm btn-secondary' onClick={() => copyToClipboard(item.content, item.id)}>Sao chép</button>
                                        </td>
                                    </>
                                
                                
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className='text-center'>
                {[...Array(lastPage)].map((_, index) => (
                    <button key={index + 1} onClick={() => handlePagination(index + 1)} className='btn btn-secondary ms-3'>
                        {index + 1}
                    </button>
                ))}
            </div>

            <div>
                <img src={`/pokemon/${pokemon}.png`} alt={pokemon} title={`Xin chào, ${pokemon} hi vọng bạn tìm được thứ mình cần`} onClick={sayMessage} />
            </div>
        </div>
    );
}

export default Suggest;
