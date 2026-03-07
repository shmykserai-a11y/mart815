import React from 'react';

const HogwartsPage = () => {
    // Используем стиль Google Fonts, похожий на шрифты мира Гарри Поттера (например, Cinzel или MedievalSharp)
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#0a0a0a',
            color: '#d4af37', // Золотой цвет
            fontFamily: '"Cinzel Decorative", "MedievalSharp", serif',
            fontSize: '32px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            textAlign: 'center',
            padding: '20px'
        }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=MedievalSharp&display=swap');
                `}
            </style>
            <h1>Ваше приглашение еще в пути...</h1>
        </div>
    );
};

export default HogwartsPage;
