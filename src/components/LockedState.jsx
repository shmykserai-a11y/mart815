import React, { useState, useEffect, useRef } from 'react';

const LockedState = ({ onMobileUnlock }) => {
  const [tapCount, setTapCount] = useState(0);
  const [totalTaps, setTotalTaps] = useState(() => {
    const saved = localStorage.getItem("catTotalTaps");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [currentMessage, setCurrentMessage] = useState("");
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const resetTimeoutRef = useRef(null);









  // Обработка 5 тапов для мобильных устройств
  const handleTap = (e) => {
    e.stopPropagation();

    if (showFinalDialog) return;

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);

    if ("vibrate" in navigator) {
      navigator.vibrate(20);
    }

    const newTotal = totalTaps + 1;
    setTotalTaps(newTotal);
    localStorage.setItem("catTotalTaps", newTotal.toString());

    // Логика сообщений
    if (newTotal === 5) setCurrentMessage("Хватит тискать котика, лучше чини баг.");
    else if (newTotal === 10) setCurrentMessage("Ты вообще собираешься заниматься делом?");
    else if (newTotal === 15) setCurrentMessage("Что бы починить баг нужно его сначала найти.");
    else if (newTotal === 20) setCurrentMessage("Я думал ты профессиональный фронтенд-разработчик, а не просто любитель....котиков.");
    else if (newTotal === 25) setCurrentMessage("Ну все, мне надоело! Больше ничего тебе не скажу.");
    else if (newTotal >= 45) {
      setCurrentMessage("");
      setShowFinalDialog(true);
    }

    resetTimeoutRef.current = setTimeout(() => {
      if (!showFinalDialog) setCurrentMessage("");
    }, 3000);
  };

  return (
    <div className="locked-state">

      {currentMessage && (
        <div className="cat-toast">
          {currentMessage}
        </div>
      )}

      {showFinalDialog && (
        <div className="final-unlock-overlay">
          <div className="final-dialog">
            <p>Ладно. Хорошо! Так и быть. Починю баг сам. Но в терминале тебе придется разобраться самостоятельно.</p>
            <button onClick={() => onMobileUnlock()}>Открыть терминал</button>
          </div>
        </div>
      )}
      <div className="chrome-error-content">
        <div className={`error-icon ${isShaking ? "shake" : ""}`}>
          <img
            src="data:image/png;base64,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"
            alt="Error Icon"
            onClick={handleTap}
            draggable="false"
            style={{ cursor: "pointer", userSelect: "none", WebkitUserDrag: "none" }}
          />
        </div>
        <h1 className="main-title">Не удается получить доступ к сайту</h1>
        <p className="subtitle">Сайт <b>localhost</b> не позволяет установить соединение.</p>

        <div className="suggestions">
          <p>Попробуйте сделать следующее:</p>
          <ul>
            <li>Проверьте подключение к интернету.</li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Проверьте настройки прокси-сервера и брандмауэра.</a></li>
          </ul>
        </div>

        <p className="error-code">ERR_CONNECTION_REFUSED</p>

        <div className="button-row">
          <button className="refresh-btn" onClick={() => window.location.reload()}>Перезагрузить</button>
        </div>
      </div>

      <div className="hidden-cursor">
        <span className="hidden-hint">gjnbcrfq rjnbrf</span>
        <span className="cursor-blink">_</span>
      </div>

      <div className="hidden-text-selection">
        &lt;!-- Система заблокирована. Требуется ручное вмешательство. Проверьте консоль. --&gt;
      </div>

      <style>{`
        
        .cat-toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(32, 33, 36, 0.95);
          color: #e8eaed;
          padding: 12px 24px;
          border-radius: 8px;
          border: 1px solid #3c4043;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          z-index: 1000;
          font-size: 14px;
          animation: slideDown 0.3s ease-out;
          pointer-events: none;
        }

        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        .final-unlock-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .final-dialog {
          background: #202124;
          padding: 30px;
          border-radius: 12px;
          border: 1px solid #8ab4f8;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 0 20px rgba(138, 180, 248, 0.2);
        }

        .final-dialog p {
          color: #e8eaed;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .final-dialog button {
          background: #8ab4f8;
          color: #202124;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s;
        }

        .final-dialog button:hover {
          background: #aecbfa;
          transform: scale(1.05);
        }
        .chrome-error-content {
          max-width: 600px;
          width: 100%;
        }
        
        .error-icon.shake img {
          animation: shake-animation 0.3s ease-in-out;
        }

        @keyframes shake-animation {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }

        .error-icon img {
          user-select: none;
          -webkit-user-drag: none;
        }
        .error-icon {
          margin-left: -10px;
          margin-bottom: 30px;
        }
        .main-title {
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 12px;
          color: #e8eaed;
        }
        .subtitle {
          font-size: 15px;
          margin-bottom: 30px;
          color: #bdc1c6;
        }
        .suggestions {
          font-size: 14px;
          margin-bottom: 20px;
          color: #bdc1c6;
        }
        .suggestions ul {
          margin-top: 10px;
          margin-left: 20px;
        }
        .suggestions li {
          margin-bottom: 8px;
        }
        .suggestions a {
          color: #8ab4f8;
          text-decoration: none;
        }
        .error-code {
          font-size: 12px;
          color: #9aa0a6;
          margin-bottom: 40px;
          text-transform: uppercase;
        }
        .refresh-btn {
          background-color: #8ab4f8;
          color: #202124;
          border: none;
          padding: 10px 24px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .refresh-btn:hover {
          background-color: #aecbfa;
        }
        
        /* Скрытые элементы */
        

        .hidden-cursor {
          position: fixed;
          bottom: 10px;
          left: 10px;
          color: #ffffff;
          font-family: monospace;
          display: flex;
          align-items: flex-end;
        }
        
        .hidden-hint {
          opacity: 0.01;
          font-size: 15px;
          margin-right: 5px;
          user-select: all;
          transition: opacity 0.1s;
        }

        .hidden-hint::selection {
          background: #8ab4f8;
          color: #000000;
        }

        .cursor-blink {
          font-size: 20px;
          opacity: 0.3;
          animation: blink 1s infinite;
        }
        
        .hidden-text-selection {
          position: absolute;
          bottom: -100px;
          color: transparent;
          user-select: all;
        }
        .hidden-text-selection::selection {
          background: #3c4043;
          color: #e8eaed;
        }

        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0; }
        }

        @media (max-width: 600px) {
          .locked-state {
            padding: 40px 24px;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default LockedState;
