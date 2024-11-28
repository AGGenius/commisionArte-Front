import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './modules/content/FrontPage';
import UploadImage from './modules/content/UploadImage';
import './App.css'

function App() {
  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<FrontPage/>} />
          </Routes>
        </Router>
    </>
  )
}

export default App
