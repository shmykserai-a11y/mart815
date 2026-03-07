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
    if (isUnlocked || mode !== 1 || localStorage.getItem('assistantReady') === 'true') return;

    let chatTimeout;
    let sequenceTimeouts = [];

    const startChat = () => {
      const catStyle = "color: #ffb86c; font-size: 14px; font-weight: bold; background: #282a36; padding: 4px; border-radius: 4px;";
      const sysStyle = "color: #8be9fd; font-size: 12px; font-style: italic;";
      const textStyle = "color: #f8f8f2; font-size: 14px;";

      console.log("%c🐱 Виртуальный помощник: %cДостаточно скучная загадка, правда?", catStyle, textStyle);
      console.log("%c> Чтобы ответить, просто напиши: да или нет (и нажмите Enter)", sysStyle);

      let step = 0;
      const handleAnswer = (text) => {
        console.log(`%cВы: ${text}`, "color: #50fa7b; font-size: 14px; font-weight: bold;");
        if (step === 0) {
          step = 1;
          sequenceTimeouts.push(setTimeout(() => {
            console.log("%c🐱 Виртуальный помощник: %cА мне вообще не нравится этот терминал. Достаточно унылое место.", catStyle, textStyle);
            sequenceTimeouts.push(setTimeout(() => {
              console.log("%c🐱 Виртуальный помощник: %cЯ вообще знаю пароль администратора, но я не могу сказать. Мне запретили.", catStyle, textStyle);
              sequenceTimeouts.push(setTimeout(() => {
                console.log("%c🐱 Виртуальный помощник: %cГоворят, ты любишь котиков. Хочешь загадку про кота?", catStyle, textStyle);
                console.log("%c> Ответьте: да или нет", sysStyle);
              }, 4000));
            }, 4000));
          }, 1500));
        } else if (step === 1) {
          step = 2;
          sequenceTimeouts.push(setTimeout(() => {
            console.log("%c🐱 Виртуальный помощник: %cНо я в любом случае тебе задам её.", catStyle, textStyle);
            sequenceTimeouts.push(setTimeout(() => {
              console.log("%c🐱 Виртуальный помощник: \n%cРастолстел обжора-кот,\nОн диет не признаёт.\nВ миску я ему кладу\nБио-чистую еду:\nЛист капусты, лист салата,\nПару листиков шпината.\nГневно кот повёл усами:\n— Эту травку ешьте сами,\nМне всегда кладите в миску\nДве котлеты и сосиску!", catStyle, "color: #f1fa8c; font-size: 14px; font-style: italic;");
              sequenceTimeouts.push(setTimeout(() => {
                console.log("%c🐱 Виртуальный помощник: %cНо это, правда, была и не загадка никакая.", catStyle, textStyle);
                sequenceTimeouts.push(setTimeout(() => {
                  console.log("%c🐱 Виртуальный помощник: %cА знаешь что, я дам тебе архив с подсказкой.\nРазархивируй его и найди кодовую фразу.\nКак только ты пришлешь мне ее, я дам тебе пароль.", catStyle, textStyle);
                  sequenceTimeouts.push(setTimeout(() => {
                    console.log("%c🐱 Архив: %caHR0cHM6Ly9kaXNrLnlhbmRleC5rei9pL0lJel92WXotRVZqcFl3", catStyle, "color: #50fa7b; background: #282a36; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px; border: 1px solid #50fa7b;");
                    console.log("%c> Чтобы отправить кодовую фразу, напишите: send('passphrase')", sysStyle);

                    delete window.да;
                    delete window.нет;

                    window.assistantReady = true;
                    localStorage.setItem('assistantReady', 'true');

                    window.send = (phrase) => {
                      if (phrase && typeof phrase === 'string' && phrase.trim().toLowerCase() === "irure voluptate laborum officia dolor") {
                        console.log("%c🐱 Виртуальный помощник: %cОтлично! парольная фраза верна.", catStyle, textStyle);
                        console.log("%c🐱 Пароль администратора: %c15031991", catStyle, "color: #ff5555; background: #111; font-size: 16px; font-weight: bold; padding: 4px 8px; border: 2px solid #ff5555; border-radius: 4px;");
                        delete window.send;
                      } else {
                        console.log("%c🐱 Виртуальный помощник: %cНеверно. Ищи лучше.", catStyle, "color: #ff5555; font-size: 14px;");
                      }
                      return "Сообщение отправлено";
                    };
                  }, 4000));
                }, 4000));
              }, 12000));
            }, 3000));
          }, 1500));
        }
        return "Сообщение отправлено";
      };

      Object.defineProperty(window, 'да', { get: () => handleAnswer("да"), configurable: true });
      Object.defineProperty(window, 'нет', { get: () => handleAnswer("нет"), configurable: true });
    };

    chatTimeout = setTimeout(startChat, 30000);

    return () => {
      clearTimeout(chatTimeout);
      sequenceTimeouts.forEach(clearTimeout);
      delete window.да;
      delete window.нет;
      delete window.assistantReady;
      delete window.send;
    };
  }, [mode, isUnlocked]);

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
