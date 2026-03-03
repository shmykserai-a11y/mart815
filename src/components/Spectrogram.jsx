import React, { useState, useEffect } from 'react';

const Spectrogram = ({ onExit }) => {
  const [mode, setMode] = useState(0);
  const [offsets, setOffsets] = useState([3, 7, 2]);
  const [selectedRow, setSelectedRow] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const targetDigits = [
    ["  █", "  █", "  █"], // 1
    ["█▀▀", "▀▀█", "▄▄█"], // 5
    ["█▀█", "█ █", "█▄█"], // 0
    ["▀▀█", " ▀█", "▄▄█"], // 3
    ["  █", "  █", "  █"], // 1
    ["█▀█", "▀▀█", "▄▄█"], // 9
    ["█▀█", "▀▀█", "▄▄█"], // 9
    ["  █", "  █", "  █"], // 1
  ];

  useEffect(() => {
    if (offsets[0] === 0 && offsets[1] === 0 && offsets[2] === 0) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }
  }, [offsets]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onExit();
      if (e.key === 'v') setMode(prev => (prev + 1) % 2);
      if (e.key === 'r') console.log("Audio restart simulation");

      if (mode === 1 && !isUnlocked) {
        if (e.key === 'ArrowUp') {
          setSelectedRow(prev => (prev > 0 ? prev - 1 : 2));
        } else if (e.key === 'ArrowDown') {
          setSelectedRow(prev => (prev < 2 ? prev + 1 : 0));
        } else if (e.key === 'ArrowLeft') {
          setOffsets(prev => {
            const newOffsets = [...prev];
            newOffsets[selectedRow] = (newOffsets[selectedRow] - 1 + 8) % 8;
            return newOffsets;
          });
        } else if (e.key === 'ArrowRight') {
          setOffsets(prev => {
            const newOffsets = [...prev];
            newOffsets[selectedRow] = (newOffsets[selectedRow] + 1) % 8;
            return newOffsets;
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, selectedRow, isUnlocked, onExit]);

  const renderPuzzle = () => {
    const rowStrings = [0, 1, 2].map(rowIndex => {
      const offset = offsets[rowIndex];
      const items = [];
      for (let i = 0; i < 8; i++) {
        const sourceIndex = (i - offset + 8) % 8;
        items.push(targetDigits[sourceIndex][rowIndex]);
      }
      return items.join("  ");
    });

    const cursor0 = selectedRow === 0 && !isUnlocked ? ">" : " ";
    const cursor1 = selectedRow === 1 && !isUnlocked ? ">" : " ";
    const cursor2 = selectedRow === 2 && !isUnlocked ? ">" : " ";

    return `
==================================================
   КРИПТОГРАФИЧЕСКИЙ АНАЛИЗАТОР v1.0 [ДЕШИФРАТОР]
==================================================

[ДЕКОДИРОВАНИЕ СИГНАЛА]
Используйте стрелки ВВЕРХ/ВНИЗ для выбора полосы.
Используйте стрелки ВЛЕВО/ВПРАВО для сдвига кода.

┌──────────────────────────────────────────────────┐
│                                                  │
│     ${cursor0} ${rowStrings[0]}     │
│     ${cursor1} ${rowStrings[1]}     │
│     ${cursor2} ${rowStrings[2]}     │
│                                                  │
└──────────────────────────────────────────────────┘

${isUnlocked
        ? `[СООБЩЕНИЕ УСПЕШНО РАСШИФРОВАНО]
> Обнаружена скрытая запись:
> ПАРОЛЬ АДМИНИСТРАТОРА: 15031991
> (запиши его, он понадобится для команды admin)`
        : `[ОЖИДАНИЕ ДЕКОДИРОВАНИЯ...]
> Сигнал искажен. Форма волны повреждена.
> Требуется ручная синхронизация фаз.`}
`;
  };

  const renderMode0 = () => `
==================================================
   АНАЛИЗАТОР СПЕКТРА СИГНАЛА v1.0
==================================================

[СПЕКТРОГРАММА]
┌──────────────────────────────────────────────────┐
│                                                  │
│    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│    ░░░░░░░░░░░▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│    ░░░░░░░▓▓▓███████▓▓▓░░░░░░░░░░░░░░░░░░░░░░    │
│    ░░░░░███████████████▓▓▓░░░░░░░░░░░░░░░░░░░    │
│    ░░░▓███████████████████▓░░░░░░░░░░░░░░░░░░    │
│    ░░██  ██  █  █  █ ███ ███ ███ █ ░░░░░░░░░░    │
│    ░███ █ █ █ █ █ █ █   █   █   █  ░░░░░░░░░░    │
│    ██ █ █ █ █ █ █ █ █   ██  ██  ██ ░░░░░░░░░░    │
│     █ █ █ █ █ █ █ █ █   █   █   █  ░░░░░░░░░░    │
│    ██ █████ ██  █  █ ███ ███ ███ █ ░░░░░░░░░░    │
│    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │
│                                                  │
└──────────────────────────────────────────────────┘
[ ЧАСТОТА (Гц) → ]

[УПРАВЛЕНИЕ]
> Нажми 'v' для переключения режима отображения
> Нажми 'Esc' для возврата в терминал

[СООБЩЕНИЕ ОБНАРУЖЕНО]
> На частоте 2100 Гц обнаружена скрытая запись:
> ПАРОЛЬ АДМИНИСТРАТОЯ... [ОШИБКА ДЕКОДИРОВАНИЯ]
> (Попробуйте переключить визуализацию клавишей 'v')
`;

  return (
    <div className="terminal-state spectrogram-container">
      <pre>{mode === 0 ? renderMode0() : renderPuzzle()}</pre>
      <style>{`
        .spectrogram-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 1.2;
        }
        pre {
          color: #00ff00;
          text-shadow: 0 0 5px #00ff00;
        }
      `}</style>
    </div>
  );
};

export default Spectrogram;
