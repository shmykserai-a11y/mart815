import React, { useState, useEffect, useRef } from 'react';
import Spectrogram from './Spectrogram';

const Terminal = () => {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [isTypewriting, setIsTypewriting] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPasswordMode, setIsPasswordMode] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);

    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const [isMobile, setIsMobile] = useState(false);

    const ASCII_ART = [
        "==================================================",
        "              SYSTEM TERMINAL v2.4.1              ",
        "==================================================",
        "",
        "          .__....._             _.....__,",
        "            .\": o :':         ;': o :\".",
        "            `. `-' .'.       .'. `-' .'",
        "              `---'             `---'",
        "",
        "    _...----...      ...   ...      ...----..._",
        " .-'__..-\"\"'----    `.  `\"`  .'    ----'\"\"-..__`-.",
        "'.-'   _.--\"\"\"'       `-._.-'       '\"\"\"--._   `-.'",
        "'  .-\"'                  :                  `\"-.  '",
        "  '   `.              _.'\"'._              .'   '",
        "        `.       ,.-'\"       \"'-.,       .'",
        "          `.                           .'",
        "            `-._                   _.-'",
        "                `\"'--...___...--'\"`",
        "",
        "=================================================="
    ];

    const DESKTOP_MSG = [
        "> Добро пожаловать, гость.",
        "> Система разблокирована. Уровень доступа: Гость (Read-Only)",
        "> Доступные команды: help, play, scan, admin",
        "> ",
        "> Введите 'help' для списка команд или 'play' для прослушивания сообщения."
    ];

    const MOBILE_MSG = [
        "Система не инициализирована. Ваше устройство не подходит для дальнейших действий."
    ];

    useEffect(() => {
        // Проверка на мобильное устройство
        const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobile(checkMobile);

        setHistory([]); // Обнуляем историю при монтировании
        setIsTypewriting(true);
    }, []);

    useEffect(() => {
        const activeMsg = isMobile ? [...ASCII_ART, ...MOBILE_MSG] : [...ASCII_ART, ...DESKTOP_MSG];

        if (isTypewriting && history.length < activeMsg.length) {
            const timeout = setTimeout(() => {
                const nextLine = activeMsg[history.length];
                const type = (isMobile && history.length >= ASCII_ART.length) ? 'error' : 'system';
                setHistory(prev => [...prev, { text: nextLine, type }]);
            }, 100); // 100ms для комфортной скорости загрузки на мобилках
            return () => clearTimeout(timeout);
        } else if (isTypewriting && history.length >= activeMsg.length) {
            setIsTypewriting(false);
        }
    }, [history, isTypewriting, isMobile]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    useEffect(() => {
        if (!isTypewriting && !isScanning) {
            inputRef.current?.focus();
        }
    }, [isTypewriting, isScanning]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            setHistory(prev => [...prev, { text: `guest@birthday:~$ ${isPasswordMode ? '********' : input}`, type: 'user' }]);
            setInput('');

            if (isPasswordMode) {
                if (cmd === '22031995') {
                    setIsAdmin(true);
                    setIsPasswordMode(false);
                    setHistory(prev => [...prev,
                    { text: "> ДОСТУП РАЗРЕШЕН.", type: 'success' },
                    { text: "> Здравствуй, Администратор.", type: 'system' },
                    { text: "> Загружается протокол \"Подарок\"...", type: 'system' },
                    { text: "> [██████████████████████████░░░░] 80%", type: 'system' },
                    { text: "> ", type: 'system' },
                    { text: "> Ошибка! Файл подарка был перемещен.", type: 'error' },
                    { text: "> Последняя известная геолокация:", type: 'system' },
                    { text: "> Широта: 55.751244", type: 'system' },
                    { text: "> Долгота: 37.618423", type: 'system' },
                    { text: "> (Координаты места, где спрятан подарок)", type: 'system' },
                    { text: "> ", type: 'system' },
                    { text: "> Для подтверждения получения введи 'accept'", type: 'system' }
                    ]);
                } else {
                    setHistory(prev => [...prev, { text: "> Неверный пароль. Попытка залогирована.", type: 'error' }]);
                    setIsPasswordMode(false);
                }
                return;
            }

            switch (cmd) {
                case 'help':
                    setHistory(prev => [...prev,
                    { text: "> Доступные команды:", type: 'system' },
                    { text: ">   help            - показать эту справку", type: 'system' },
                    { text: ">   play            - воспроизвести аудиосообщение", type: 'system' },
                    { text: ">   scan            - открыть анализатор сигнала", type: 'system' },
                    { text: ">   admin           - вход в режим администратора", type: 'system' },
                    { text: "> ", type: 'system' },
                    { text: "> Для перехода к анализу спектра используй 'scan'.", type: 'system' }
                    ]);
                    break;
                case 'play':
                    startAudioSimulation();
                    break;
                case 'scan':
                    setIsScanning(true);
                    break;
                case 'admin':
                    setIsPasswordMode(true);
                    setHistory(prev => [...prev, { text: "> Вход в режим администратора. \n> Введите пароль: ", type: 'system' }]);
                    break;
                case 'accept':
                    if (isAdmin) {
                        setHistory(prev => [...prev,
                        { text: "> Статус: Подтверждено.", type: 'success' },
                        { text: "> Подарок активирован. Система завершает работу.", type: 'system' },
                        { text: "> С днём рождения, Кристина! (Имя заменено на стандартное)", type: 'success' },
                        { text: "> ", type: 'system' },
                        { text: "> Сеанс будет закрыт через 10 секунд...", type: 'system' }
                        ]);
                        setTimeout(() => {
                            alert("GIFT ACTIVATED! С ДНЕМ РОЖДЕНИЯ!");
                        }, 10000);
                    } else {
                        setHistory(prev => [...prev, { text: "> Ошибка: Требуются права администратора.", type: 'error' }]);
                    }
                    break;
                case 'clear':
                    setHistory([]);
                    break;
                default:
                    if (cmd !== '') {
                        setHistory(prev => [...prev, { text: `> Команда '${cmd}' не найдена. Введите 'help' для списка команд.`, type: 'error' }]);
                    }
            }
        }
    };

    const startAudioSimulation = () => {
        setAudioPlaying(true);
        let progress = 0;
        setHistory(prev => [...prev, { text: "> Загрузка аудиосообщения...", id: 'audio-line', type: 'system' }]);

        const interval = setInterval(() => {
            progress += 5;
            setAudioProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setAudioPlaying(false);
                setHistory(prev => [...prev,
                { text: "> Сообщение доставлено. Рекомендуется провести спектральный анализ.", type: 'system' },
                { text: "> Используй 'scan' для открытия анализатора.", type: 'system' }
                ]);
            }
        }, 200);
    };

    if (isScanning) {
        return <Spectrogram onExit={() => setIsScanning(false)} />;
    }

    return (
        <div className="terminal-state">
            <div className="terminal-output">
                {history.map((line, i) => (
                    <div key={i} className={`line ${line.type}`}>
                        {line.text}
                    </div>
                ))}
                {audioPlaying && (
                    <div className="line system">
                        {`> Воспроизведение: [${'█'.repeat(Math.floor(audioProgress / 5))}${'░'.repeat(20 - Math.floor(audioProgress / 5))}] ${audioProgress}%`}
                    </div>
                )}
            </div>

            {!isTypewriting && !isMobile && (
                <div className="input-line">
                    <span className="prompt">guest@birthday:~$ </span>
                    <input
                        ref={inputRef}
                        type={isPasswordMode ? 'password' : 'text'}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        autoFocus
                    />
                    <span className="cursor">_</span>
                </div>
            )}
            <div ref={bottomRef} />

            <style>{`
        .terminal-output {
          white-space: pre-wrap;
          margin-bottom: 10px;
        }
        .line {
          margin-bottom: 4px;
          line-height: 1.4;
        }
        .user { color: #fff; }
        .system { color: #00ff00; }
        .error { color: #ff5555; }
        .success { color: #33ff33; font-weight: bold; }
        
        .input-line {
          display: flex;
          align-items: center;
        }
        .prompt {
          color: #00ff00;
          margin-right: 8px;
        }
        input {
          background: transparent;
          border: none;
          color: #00ff00;
          font-family: inherit;
          font-size: inherit;
          outline: none;
          width: 0;
          flex-grow: 1;
        }
        .cursor {
          background: #00ff00;
          color: #00ff00;
          animation: blink 1s infinite;
          width: 10px;
          height: 1.2em;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default Terminal;
