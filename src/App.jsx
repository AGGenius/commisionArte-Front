import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './modules/nav/Nav';
import FrontPage from './modules/content/FrontPage';
import UploadImage from './modules/content/UploadImage';
import './App.css'

function App() {
  return (
    <>
      <Router>
        {<Nav />}
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/upload" element={<UploadImage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
