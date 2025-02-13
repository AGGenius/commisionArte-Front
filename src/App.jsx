import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './modules/nav/Nav';
import FrontPage from './modules/content/FrontPage';
import UploadImage from './modules/content/UploadImage';
import ProfilePage from './modules/content/Profile';
import PersonalGalleryPage from './modules/content/PersonalGalery';
import ClientOffersPage from './modules/content/Offers';
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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/personalGallery" element={<PersonalGalleryPage />} />
            <Route path="/clientOffers" element={<ClientOffersPage />} />
          </Routes>
        </UserProvider>
      </Router>
    </>
  )
}

export default App
