import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LockedState from './components/LockedState';
import Terminal from './components/Terminal';
import NewPage from './components/NewPage';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => localStorage.getItem("isUnlocked") === "true");

  useEffect(() => {
    // Подсказка в консоли (выводим при каждом монтировании для надежности)
    console.log('%cUncaught Error: System.Locked() - User verification failed.', 'color: red; font-size: 14px; font-weight: bold;');
    console.log('%c> Чтобы разблокировать, введи: window.userTrust = true', 'color: gray; font-size: 12px;');

    // Используем сеттер для мгновенной реакции на ввод в консоли
    let trustValue = false;
    Object.defineProperty(window, 'userTrust', {
      get: () => trustValue,
      set: (val) => {
        trustValue = val;
        if (val === true || val === "true") {
          setIsUnlocked(true);
          localStorage.setItem("isUnlocked", "true");
        }
      },
      configurable: true
    });
  }, []);

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
