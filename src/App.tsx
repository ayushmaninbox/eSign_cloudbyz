import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Dashboard/Home.jsx';
import Manage from './components/Dashboard/Manage.jsx';
import RecipientSelection from './components/RecipientSelection/RecipientSelection.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/recipientselection" element={<RecipientSelection />} />
      </Routes>
    </Router>
  );
}

export default App;