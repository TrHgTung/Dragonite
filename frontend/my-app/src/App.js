import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Index from './components/Index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Index />} />
      </Routes>
    </Router>
  );
}

export default App;
