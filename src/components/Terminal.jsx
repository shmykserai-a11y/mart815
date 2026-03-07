import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(false);
    const [isUpdated, setIsUpdated] = useState(() => localStorage.getItem("systemUpdated") === "true");

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
        "> Доступные команды: help, start, update, crypto, admin",
        "> ",
        "> Введите 'help' для списка команд или 'update' для запуска обновления системы."
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

        if (localStorage.getItem('assistantReady') === 'true') {
            window.assistantReady = true;
            if (!isMobile) {
                activeMsg.push("> ");
                activeMsg.push("> 🐱 Виртуальный помощник ожидает ответ.");
                activeMsg.push("> Чтобы отправить кодовую фразу, напишите: send('ваша_фраза')");
            }
        }

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
            const promptStr = isAdmin ? 'admin@birthday:~# ' : 'guest@birthday:~$ ';
            setHistory(prev => [...prev, { text: `${promptStr}${isPasswordMode ? '********' : input}`, type: 'user' }]);
            setInput('');

            if (isPasswordMode) {
                if (cmd === '15031991') {
                    setIsAdmin(true);
                    setIsPasswordMode(false);
                    setHistory(prev => [...prev,
                    { text: "> ДОСТУП РАЗРЕШЕН.", type: 'success' },
                    { text: "> Здравствуй, Администратор.", type: 'system' },
                        //{ text: "> Загружается протокол \"Подарок\"...", type: 'system' },
                        //{ text: "> [██████████████████████████░░░░] 80%", type: 'system' },
                        //{ text: "> ", type: 'system' },
                        //{ text: "> Ошибка! Файл подарка был перемещен.", type: 'error' },
                        //{ text: "> Последняя известная геолокация:", type: 'system' },
                        //{ text: "> Широта: 55.751244", type: 'system' },
                        //{ text: "> Долгота: 37.618423", type: 'system' },
                        //{ text: "> ", type: 'system' },
                        //{ text: "> Для подтверждения получения введи 'accept'", type: 'system' }
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
                    { text: ">   update          - запустить обновление системы", type: 'system' },
                    { text: ">   crypto          - ручная настройка ключей доступа", type: 'system' },
                    { text: ">   admin           - вход в режим администратора", type: 'system' },
                    { text: ">   start           - запуск главного сервера", type: 'system' },
                    { text: "> ", type: 'system' }
                    ]);
                    break;
                case 'update':
                    if (isUpdated) {
                        setHistory(prev => [...prev, { text: "> Ошибка: Система уже обновлена до последней версии.", type: 'system' }]);
                    } else {
                        startUpdateSimulation();
                    }
                    break;
                case 'crypto':
                    if (!isUpdated) {
                        setHistory(prev => [...prev, { text: "> ПО устарело. Запустите обновление.", type: 'error' }]);
                    } else {
                        setIsScanning(true);
                    }
                    break;
                case 'admin':
                    setIsPasswordMode(true);
                    if (isUpdated) {
                        setHistory(prev => [...prev, { text: "> Вход в режим администратора. \n> Система обновлена. Воспользуйтесь командой crypto, чтобы узнать новый пароль.\n> Введите пароль: ", type: 'system' }]);
                    } else {
                        setHistory(prev => [...prev, { text: "> Вход в режим администратора. \n> Введите пароль: ", type: 'system' }]);
                    }
                    break;
                case 'start':
                    setHistory(prev => [...prev, { text: "> Используйте sudo", type: 'error' }]);
                    break;
                case 'sudo start':
                    if (isAdmin) {
                        startFakeServerLoad();
                    } else {
                        setHistory(prev => [...prev, { text: "> Ошибка: Требуются права администратора.", type: 'error' }]);
                    }
                    break;
                case 'accept':
                    if (isAdmin) {
                        setHistory(prev => [...prev,
                        { text: "> Статус: Подтверждено.", type: 'success' },
                        { text: "> Подарок активирован. Система завершает работу.", type: 'system' },
                        { text: "> С днём рождения, Таня!", type: 'success' },
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
                        if (window.assistantReady) {
                            let textInside = cmd.trim();
                            const isSendCmd = textInside.startsWith("send(") && textInside.endsWith(")");
                            if (isSendCmd) {
                                textInside = textInside.substring(5, textInside.length - 1).replace(/['"]/g, '').trim();
                            }
                            if (textInside.toLowerCase() === "irure voluptate laborum officia dolor") {
                                setHistory(prev => [...prev,
                                { text: "> 🐱 Виртуальный помощник: Отлично! парольная фраза верна.", type: 'system' },
                                { text: "> 🐱 Пароль администратора: 15031991", type: 'success' }
                                ]);
                                delete window.assistantReady;
                                delete window.send;
                                localStorage.removeItem('assistantReady');
                                return;
                            } else if (isSendCmd) {
                                setHistory(prev => [...prev, { text: "> 🐱 Виртуальный помощник: Неверно. Ищи лучше.", type: 'error' }]);
                                return;
                            }
                        }
                        setHistory(prev => [...prev, { text: `> Команда '${cmd}' не найдена. Введите 'help' для списка команд.`, type: 'error' }]);
                    }
            }
        }
    };

    const startFakeServerLoad = () => {
        setHistory(prev => [...prev, { text: "> Инициализация сервисов запуска...", type: 'system' }]);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setHistory(prev => [...prev, { text: `> Загрузка модулей... [${'█'.repeat(progress / 5)}${'░'.repeat(20 - Math.floor(progress / 5))}] ${progress}%`, type: 'system' }]);

            if (progress >= 100) {
                clearInterval(interval);
                setHistory(prev => [...prev, { text: "> Идет перенаправление...", type: 'success' }]);
                setTimeout(() => {
                    navigate('/hogwarts');
                }, 2000);
            }
        }, 1000); // 20 steps of 1s each = 20s
    };

    const startUpdateSimulation = () => {
        setAudioPlaying(true);
        let progress = 0;
        setHistory(prev => [...prev, { text: "> Загрузка обновления системы...", id: 'audio-line', type: 'system' }]);

        const interval = setInterval(() => {
            progress += 5;
            setAudioProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setAudioPlaying(false);
                setIsUpdated(true);
                localStorage.setItem("systemUpdated", "true");
                setHistory(prev => [...prev,
                { text: "> ВНИМАНИЕ: В процессе установки возникла системная ошибка.", type: 'error' },
                { text: "> Файл ключа администратора был поврежден или зашифрован.", type: 'error' },
                { text: "> Требуется ручная настройка ключей. Введите команду 'crypto'.", type: 'system' }
                ]);
            }
        }, 200);
    };

    if (isScanning) {
        return <Spectrogram onExit={() => setIsScanning(false)} />;
    }

    return (
        <div className="terminal-state" onClick={() => inputRef.current?.focus()}>
            <div className="terminal-output">
                {history.map((line, i) => (
                    <div key={i} className={`line ${line.type}`}>
                        {line.text}
                    </div>
                ))}
                {audioPlaying && (
                    <div className="line system">
                        {`> Выполнение установки: [${'█'.repeat(Math.floor(audioProgress / 5))}${'░'.repeat(20 - Math.floor(audioProgress / 5))}] ${audioProgress}%`}
                    </div>
                )}
            </div>

            {!isTypewriting && !isMobile && (
                <div className="input-line">
                    <span className="prompt">{isAdmin ? 'admin@birthday:~# ' : 'guest@birthday:~$ '}</span>
                    <input
                        ref={inputRef}
                        type={isPasswordMode ? 'password' : 'text'}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        autoFocus
                    />
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
          flex-grow: 1;
        }
      `}</style>
        </div>
    );
};

export default Terminal;
