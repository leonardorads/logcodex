'use client'

import { useState, useRef, useEffect } from 'react'

interface FleetChatProps {
  onOpenContact: () => void
}

// Frases digitadas automaticamente no placeholder, uma de cada vez, enquanto o
// campo está vazio e sem foco — some assim que o usuário interage de verdade.
const TYPE_EXAMPLES = [
  'Quanto faturei essa semana?',
  'Qual motorista deu mais prejuízo esse mês?',
  'Custo de combustível em maio?',
  'Quais viagens ainda não fecharam acerto?',
]

const TYPE_SPEED_MS = 45
const ERASE_SPEED_MS = 22
const HOLD_MS = 1400
const PAUSE_MS = 500

function useTypingPlaceholder(active: boolean) {
  const [text, setText] = useState('')

  useEffect(() => {
    // Quando `active` vira false, o consumidor já para de renderizar `text`
    // (ver FleetChat: overlay some no foco/digitação) — não precisa resetar
    // aqui, evitando setState síncrono dentro do efeito.
    if (!active) return
    let phraseIndex = 0
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    function typePhrase() {
      const phrase = TYPE_EXAMPLES[phraseIndex]
      let charIndex = 0

      function typeStep() {
        if (cancelled) return
        charIndex++
        setText(phrase.slice(0, charIndex))
        if (charIndex < phrase.length) {
          timeoutId = setTimeout(typeStep, TYPE_SPEED_MS)
        } else {
          timeoutId = setTimeout(eraseStep, HOLD_MS)
        }
      }

      function eraseStep() {
        if (cancelled) return
        charIndex--
        setText(phrase.slice(0, charIndex))
        if (charIndex > 0) {
          timeoutId = setTimeout(eraseStep, ERASE_SPEED_MS)
        } else {
          phraseIndex = (phraseIndex + 1) % TYPE_EXAMPLES.length
          timeoutId = setTimeout(typePhrase, PAUSE_MS)
        }
      }

      typeStep()
    }

    typePhrase()
    return () => { cancelled = true; clearTimeout(timeoutId) }
  }, [active])

  return text
}

export function FleetChat({ onOpenContact }: FleetChatProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const typingPlaceholder = useTypingPlaceholder(!focused && value === '' && !submitted)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  function handleSend(text?: string) {
    const q = (text ?? value).trim()
    if (!q) return
    setValue(q)
    setSubmitted(true)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <style>{`
        .fc-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 680px;
          margin: 0 auto;
        }

        /* ── animated border box ── */
        .fc-border-wrap {
          width: 100%;
          position: relative;
          border-radius: 22px;
          padding: 1.5px;
          background: linear-gradient(
            var(--fc-angle, 135deg),
            rgba(201,168,118,0.55),
            rgba(228,200,150,0.35),
            rgba(255,255,255,0.08),
            rgba(201,168,118,0.45)
          );
          animation: fc-border-spin 4s linear infinite;
        }
        @property --fc-angle {
          syntax: '<angle>';
          initial-value: 135deg;
          inherits: false;
        }
        @keyframes fc-border-spin {
          to { --fc-angle: 495deg; }
        }

        .fc-box {
          width: 100%;
          background: #131313;
          border-radius: 20px;
          padding: 16px 18px 14px;
          position: relative;
        }

        @media (max-width: 640px) {
          .fc-box { padding: 14px 16px 12px; border-radius: 16px; }
          .fc-border-wrap { border-radius: 18px; }
          .fc-textarea, .fc-typing-overlay { font-size: 14px; }
          .fc-textarea { min-height: 44px; }
        }

        .fc-input-wrap { position: relative; }
        .fc-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          color: rgba(255,255,255,0.88);
          font-size: 15px;
          font-family: inherit;
          line-height: 1.55;
          min-height: 28px;
          max-height: 120px;
          overflow-y: auto;
          padding: 0;
        }
        .fc-textarea::placeholder { color: transparent; }
        .fc-typing-overlay {
          position: absolute;
          top: 0; left: 0; right: 0;
          font-size: 15px;
          line-height: 1.55;
          color: rgba(255,255,255,0.32);
          pointer-events: none;
          white-space: pre;
        }
        .fc-typing-cursor {
          display: inline-block;
          width: 1.5px;
          height: 15px;
          margin-left: 2px;
          background: rgba(255,255,255,0.4);
          vertical-align: -2px;
          animation: fc-blink 1s step-end infinite;
        }
        @keyframes fc-blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }

        .fc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
        }
        .fc-hint {
          font-size: 12px;
          color: rgba(255,255,255,0.15);
        }
        .fc-send-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .15s, transform .1s;
          flex-shrink: 0;
        }
        .fc-send-btn:hover { background: #fff; transform: scale(1.06); }
        .fc-send-btn:disabled {
          background: rgba(255,255,255,0.1);
          cursor: default;
          transform: none;
        }

        /* CTA state */
        .fc-cta-box {
          width: 100%;
          background: rgba(74,222,128,0.05);
          border: 1px solid rgba(74,222,128,0.18);
          border-radius: 20px;
          padding: 28px 32px;
          text-align: center;
          animation: fc-fade-in .3s ease;
        }
        @keyframes fc-fade-in { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
        .fc-cta-query {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 16px;
          font-style: italic;
        }
        .fc-cta-text {
          font-size: 15px;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          margin-bottom: 20px;
        }
        .fc-cta-text strong { color: rgba(255,255,255,0.85); font-weight: 600; }
        .fc-cta-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: rgba(74,222,128,0.12);
          border: 1px solid rgba(74,222,128,0.3);
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          color: #4ade80;
          cursor: pointer;
          font-family: inherit;
          transition: background .15s, transform .1s;
        }
        .fc-cta-action:hover { background: rgba(74,222,128,0.22); transform: translateY(-1px); }
        .fc-reset {
          display: block;
          margin: 12px auto 0;
          font-size: 12px;
          color: rgba(255,255,255,0.18);
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: color .15s;
        }
        .fc-reset:hover { color: rgba(255,255,255,0.42); }
      `}</style>

      <div className="fc-wrap">
        {!submitted ? (
          <div className="fc-border-wrap">
            <div className="fc-box">
              {/* Sem pills de sugestão: o placeholder já digita os exemplos
                  sozinho (useTypingPlaceholder), então os botões repetiam a
                  mesma informação e competiam com a animação. */}
              <div className="fc-input-wrap">
                <textarea
                  ref={textareaRef}
                  className="fc-textarea"
                  placeholder="Pergunte sobre sua operação..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKey}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  rows={1}
                />
                {!focused && value === '' && (
                  <span className="fc-typing-overlay" aria-hidden="true">
                    {typingPlaceholder}
                    <span className="fc-typing-cursor" />
                  </span>
                )}
              </div>
              <div className="fc-footer">
                <span className="fc-hint">Enter para enviar</span>
                <button
                  type="button"
                  className="fc-send-btn"
                  onClick={() => handleSend()}
                  disabled={!value.trim()}
                  aria-label="Enviar"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M7.5 2v11M2 7.5l5.5-5.5 5.5 5.5" stroke="#0c0d0f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="fc-cta-box">
            <p className="fc-cta-query">"{value}"</p>
            <p className="fc-cta-text">
              Essa é uma <strong>demonstração</strong>. Para ver esse tipo de automação aplicada aos dados reais da sua operação, fale com a gente.
            </p>
            <button type="button" className="fc-cta-action" onClick={onOpenContact}>
              Falar com especialista →
            </button>
            <button type="button" className="fc-reset" onClick={() => { setSubmitted(false); setValue('') }}>
              voltar
            </button>
          </div>
        )}
      </div>
    </>
  )
}
