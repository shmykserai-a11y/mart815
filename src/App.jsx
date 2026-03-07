import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LockedState from './components/LockedState';
import Terminal from './components/Terminal';
import HogwartsPage from './components/HogwartsPage';

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
          <Route path="/hogwarts" element={<HogwartsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
