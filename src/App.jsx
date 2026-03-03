import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LockedState from './components/LockedState';
import Terminal from './components/Terminal';
import NewPage from './components/NewPage';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => localStorage.getItem("isUnlocked") === "true");



  const handleMobileUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem("isUnlocked", "true");
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              !isUnlocked ? (
                <LockedState onMobileUnlock={handleMobileUnlock} />
              ) : (
                <Navigate to="/terminal" replace />
              )
            }
          />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/new" element={<NewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
