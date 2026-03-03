import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import catWalkImg from '../assets/cat_walk.png';
import catFrontImg from '../assets/cat_front.png';
import catBackImg from '../assets/cat_back.png';

const LockedState = ({ onMobileUnlock }) => {
  const [tapCount, setTapCount] = useState(0);
  const [totalTaps, setTotalTaps] = useState(() => {
    const saved = localStorage.getItem("catTotalTaps");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [currentMessage, setCurrentMessage] = useState("");
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Игровая логика
  const [isPlaying, setIsPlaying] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [gameTime, setGameTime] = useState(60);
  const [gameStatus, setGameStatus] = useState(""); // "", "lost", "won"

  const gameLoopRef = useRef();
  const timerRef = useRef();
  const lastTimeRef = useRef(0);
  const obstacleTimerRef = useRef(0);
  const isJumpingRef = useRef(false);
  const resetTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!isPlaying && !gameStatus) {
          startGame();
        } else if (isPlaying && !isJumpingRef.current) {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, gameStatus]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);

    setIsPlaying(true);
    setGameStatus("");
    setGameTime(60);
    setObstacles([]);
    setCurrentMessage("");
    lastTimeRef.current = performance.now();
    obstacleTimerRef.current = 1000; // Ждем 1 сек перед первым препятствием
    isJumpingRef.current = false;

    // Таймер
    timerRef.current = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= -14) {
          winGame();
          return -15;
        }
        return prev - 1;
      });
    }, 1000);

    // Игровой цикл
    gameLoopRef.current = requestAnimationFrame(updateGame);
  };

  const jump = () => {
    if (isJumpingRef.current) return;
    setIsJumping(true);
    isJumpingRef.current = true;
    setTimeout(() => {
      setIsJumping(false);
      isJumpingRef.current = false;
    }, 700);
  };

  const updateGame = (time) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setObstacles((prev) => {
      // Скорость движения (% от ширины контейнера в мс)
      const speed = 0.05;
      const moved = prev
        .map((o) => ({ ...o, x: o.x - speed * deltaTime }))
        .filter((o) => o.x > -10);

      // Спавн новых препятствий
      obstacleTimerRef.current -= deltaTime;
      if (obstacleTimerRef.current <= 0) {
        moved.push({ id: time, x: 110 }); // За пределами (100% + запас)
        obstacleTimerRef.current = 1500 + Math.random() * 2000;
      }

      // Коллизии
      // Кот находится на x=4% (20px / 500px) и имеет ширину ~13% (64px / 500px)
      // Кот занимает диапазон [4%, 17%]
      const collision = moved.some((o) => {
        const hitX = o.x > 4 && o.x < 15;
        const hitY = !isJumpingRef.current;
        return hitX && hitY;
      });

      if (collision) {
        loseGame();
        return [];
      }

      return moved;
    });

    if (gameLoopRef.current) {
      gameLoopRef.current = requestAnimationFrame(updateGame);
    }
  };

  const loseGame = () => {
    setIsPlaying(false);
    setGameStatus("lost");
    setCurrentMessage("GAME OVER");
    clearInterval(timerRef.current);
    cancelAnimationFrame(gameLoopRef.current);
    gameLoopRef.current = null;

    setTimeout(() => {
      setGameStatus("");
      setCurrentMessage("");
      setObstacles([]);
    }, 2000);
  };

  const winGame = () => {
    setIsPlaying(false);
    setGameStatus("won");
    clearInterval(timerRef.current);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    setCurrentMessage("");
    setShowFinalDialog(true);
    setObstacles([]);
  };









  // Прыжок по тапу на экран (для мобильных)
  const handleScreenTap = () => {
    if (isPlaying && !isJumpingRef.current) {
      jump();
    }
  };

  // Обработка тапов по самому коту
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
    if (newTotal === 10) setCurrentMessage("Хватит тискать котика, лучше чини баг.");
    else if (newTotal === 20) setCurrentMessage("Ты вообще собираешься заниматься делом?");
    else if (newTotal === 30) setCurrentMessage("Что бы починить баг нужно его сначала найти.");
    else if (newTotal === 40) setCurrentMessage("Я думал ты профессиональный фронтенд-разработчик, а не просто любитель....котиков.");
    else if (newTotal === 50) {
      setCurrentMessage("Ну все, мне надоело! Я ухожу.");
      setTimeout(() => {
        if (!isPlaying) startGame();
      }, 3000);
    }
    else if (newTotal > 50 && newTotal < 75) {
      if (!isPlaying) {
        startGame();
      } else if (!isJumpingRef.current) {
        jump();
      }
    }
    else if (newTotal >= 75) {
      setCurrentMessage("");
      setShowFinalDialog(true);
      if (isPlaying) {
        setIsPlaying(false);
        clearInterval(timerRef.current);
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
        setObstacles([]);
      }
    }

    resetTimeoutRef.current = setTimeout(() => {
      if (!showFinalDialog) setCurrentMessage("");
    }, 3000);
  };

  return (
    <div className="locked-state" onClick={handleScreenTap}>

      {currentMessage && (
        <div className="cat-toast">
          {currentMessage}
        </div>
      )}

      {showFinalDialog && (
        <div className="final-unlock-overlay">
          <div className="final-dialog">
            <p>Все, я устал! Так и быть. Котики не чинят баги, но я сделаю это, потому что мне надоело. Но сервер запустишь ты.</p>
            <button onClick={() => { onMobileUnlock(); navigate("/terminal"); }}>Открыть терминал</button>
          </div>
        </div>
      )}
      <div className="chrome-error-content">
        <div className={`error-icon ${isShaking ? "shake" : ""}`}>
          <div className={`game-container ${isPlaying ? "playing" : ""}`}>
            {isPlaying && <div className="game-timer">{gameTime}s</div>}

            <img
              src={isPlaying ? catWalkImg : (totalTaps >= 10 ? catFrontImg : catBackImg)}
              alt="Error Icon"
              className={`cat-image ${isJumping ? "jumping" : ""} ${isPlaying ? "running" : ""}`}
              onClick={handleTap}
              draggable="false"
              style={{ cursor: "pointer", userSelect: "none", WebkitUserDrag: "none" }}
            />

            {isPlaying && obstacles.map(o => (
              <div key={o.id} className="obstacle" style={{ left: `${o.x}% ` }}>🌵</div>
            ))}
          </div>
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
        <span className="hidden-hint">cktleq pf cthsv rjnbrjv</span>
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
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

@media(max-width: 600px) {
          .locked-state {
    padding: 40px 24px;
    justify-content: flex-start;
  }
}

        /* Game Styles */
        .game-container {
  position: relative;
  width: 300px;
  height: 150px;
  border-bottom: 2px solid #5f6368;
  overflow: hidden;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-end;
  transition: width 0.3s;
}

        .game-container.playing {
  width: 500px;
  background: rgba(255, 255, 255, 0.02);
}

        .cat-image {
  width: 64px;
  height: 64px;
  position: absolute;
  left: 20px;
  bottom: 0;
  transition: bottom 0.2s cubic-bezier(0.1, 0.7, 0.1, 1);
  z-index: 10;
}

        .cat-image.jumping {
  bottom: 80px;
}

        .cat-image.running {
  animation: run-wiggle 0.2s infinite alternate;
}

@keyframes run-wiggle {
          from { transform: rotate(-3deg); }
          to { transform: rotate(3deg); }
}

        .obstacle {
  position: absolute;
  bottom: 5px;
  font-size: 24px;
  line-height: 1;
  width: 30px;
  height: 30px;
  z-index: 5;
}

        .game-timer {
  position: absolute;
  top: 10px;
  right: 10px;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  color: #8ab4f8;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(138, 180, 248, 0.5);
}
`}</style>
    </div>
  );
};

export default LockedState;
