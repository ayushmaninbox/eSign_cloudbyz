import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Home from './components/Dashboard/Home.jsx';
import Manage from './components/Dashboard/Manage.jsx';
import RecipientSelection from './components/RecipientSelection/RecipientSelection.jsx';
import SignSetupUI from './components/Signature/SignSetupUI.jsx';
import SigneeUI from './components/Signature/SigneeUI.jsx';
import SignPreview from './components/Signature/SignPreview.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/recipientselection" element={<RecipientSelection />} />
        <Route path="/signsetupui" element={<SignSetupUI />} />
        <Route path="/signeeui" element={<SigneeUI />} />
        <Route path="/signpreview" element={<SignPreview />} />
      </Routes>
    </Router>
  );
}

export default App;