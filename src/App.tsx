import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchEngine from './SearchEngine/SearchEngine';


import MedicalQA from './projects/MedicalQA';
import Games from './projects/Games';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-wrapper">
        <Navbar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search-engine" element={<SearchEngine />} />
            <Route path="/medical-qa" element={<MedicalQA />} />
            <Route path="/games" element={<Games />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

