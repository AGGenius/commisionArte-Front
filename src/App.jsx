import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './modules/nav/Nav';
import FrontPage from './modules/content/FrontPage';
import UploadImage from './modules/content/UploadImage';
import ProfilePage from './modules/content/Profile';
import PersonalGalleryPage from './modules/content/PersonalGalery';
import OffersPage from './modules/content/Offers';
import StateCardPage from './modules/content/StateCard';
import ContactPage from './modules/content/ContactPage';
import TermsPage from './modules/content/TermsPage';
import Footer from './modules/footer/Footer';
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
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/stateCard" element={<StateCardPage />} />
            <Route path="/stateCard" element={<StateCardPage />} />
            <Route path="/stateCard" element={<StateCardPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
          {<Footer />}
        </UserProvider>
      </Router>
    </>
  )
}

export default App
