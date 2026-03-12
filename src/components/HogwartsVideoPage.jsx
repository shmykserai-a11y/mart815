import React, { useEffect, useRef, useState } from 'react'
import videoSrc from '../assets/from-hogwarts-with-love.mp4'

const base = {
  position: 'relative',
  height: '100vh',
  width: '100vw',
  background: 'radial-gradient(1200px 800px at 50% 30%, rgba(255,179,71,0.08), rgba(0,0,0,0.96))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  color: '#fff',
  fontFamily: '"Cinzel Decorative", "Cinzel", serif',
}

export default function HogwartsVideoPage() {
  const videoRef = useRef(null)
  const [ended, setEnded] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    // Try autoplay with sound on by default. If the browser blocks it,
    // the user will need to tap the overlay once (then audio will play).
    v.muted = false
    const p = v.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => setAutoplayBlocked(true))
    }
  }, [])

  const onToggleSound = async () => {
    const v = videoRef.current
    if (!v) return
    const nextMuted = !muted
    setMuted(nextMuted)
    v.muted = nextMuted
    if (!nextMuted) {
      try {
        v.volume = 1
        await v.play()
      } catch {
        // If play fails, keep UI stable. User can press play via controls.
      }
    }
  }

  const onPlayClick = async () => {
    const v = videoRef.current
    if (!v) return
    try {
      v.muted = muted
      await v.play()
      setAutoplayBlocked(false)
    } catch {
      // noop
    }
  }

  const onCheckMail = () => {
    // Switch from Mart815 (hash router) to the Hogwarts journey app (static export at /hogwarts/).
    window.location.assign(`${window.location.origin}/hogwarts/`)
  }

  return (
    <div style={base}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;700&display=swap');
        `}
      </style>

      {/* Soft vignette and subtle dust */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(900px 520px at 50% 45%, rgba(0,0,0,0.0), rgba(0,0,0,0.78))',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '3px 3px',
        opacity: 0.12,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: 'min(1080px, 94vw)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        zIndex: 1,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.75, fontSize: '12px' }}>
            From Hogwarts with Love
          </div>
          <div style={{ marginTop: '6px', fontSize: 'clamp(18px, 2.2vw, 28px)', color: '#ffb347', textShadow: '0 10px 40px rgba(0,0,0,0.65)' }}>
            Watch the message
          </div>
        </div>

        <div style={{
          width: '100%',
          borderRadius: '18px',
          border: '1px solid rgba(255,179,71,0.25)',
          background: 'rgba(0,0,0,0.55)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.65)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            controls
            muted={muted}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              background: '#000',
            }}
            onEnded={() => setEnded(true)}
          />

          {autoplayBlocked && (
            <button
              onClick={onPlayClick}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                fontFamily: '"Cinzel", serif',
                fontSize: '16px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#ffb347',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.65))',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span style={{
                width: '56px',
                height: '56px',
                borderRadius: '999px',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid rgba(255,179,71,0.65)',
                background: 'rgba(255,179,71,0.12)',
                boxShadow: '0 0 24px rgba(255,179,71,0.22)',
                fontSize: '20px',
              }}>
                ▶
              </span>
              Tap to play
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={onToggleSound}
            style={{
              pointerEvents: 'auto',
              padding: '10px 16px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,179,71,0.25)',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: '"Cinzel", serif',
              letterSpacing: '1px',
            }}
          >
            {muted ? 'Enable sound' : 'Mute'}
          </button>

          {ended && (
            <button
              onClick={onCheckMail}
              style={{
                pointerEvents: 'auto',
                padding: '12px 18px',
                borderRadius: '999px',
                background: 'rgba(255,179,71,0.18)',
                border: '1px solid rgba(255,179,71,0.9)',
                color: '#ffb347',
                cursor: 'pointer',
                fontFamily: '"Cinzel", serif',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                boxShadow: '0 0 24px rgba(255,179,71,0.16)',
              }}
            >
              Проверить почту
            </button>
          )}
        </div>

        {!ended && (
          <div style={{ opacity: 0.55, fontSize: '12px', letterSpacing: '1px', textAlign: 'center', fontFamily: '"Cinzel", serif' }}>
            После просмотра появится кнопка, чтобы перейти к письму.
          </div>
        )}
      </div>
    </div>
  )
}
