import React from 'react';
import './App.css';
import LandingPage from './pages/landingPage';
import Operations from './pages/operations';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/operations" element={<Operations />} />
      </Routes>
    </Router>
  );
}

export default App;
