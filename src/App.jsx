import React, { useState, useEffect } from 'react';
import './index.css';
import LockedState from './components/LockedState';
import Terminal from './components/Terminal';

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

    return () => {
      // Очистка не требуется, так как window глобален
    };
  }, []);

  const handleMobileUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem("isUnlocked", "true");
  };

  return (
    <div className="app-container">
      {!isUnlocked ? (
        <LockedState onMobileUnlock={handleMobileUnlock} />
      ) : (
        <Terminal />
      )}
    </div>
  );
}

export default App;
