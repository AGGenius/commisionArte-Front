import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './modules/nav/Nav';
import FrontPage from './modules/content/FrontPage';
import UploadImage from './modules/content/UploadImage';
//Context
import { UserProvider } from './context/useUserContext';
import './App.css'

function App() {
  return (
    <>
      <Router>
        <UserProvider>
          {<Nav />}
          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/upload" element={<UploadImage />} />
          </Routes>
        </UserProvider>
      </Router>
    </>
  )
}

export default App
