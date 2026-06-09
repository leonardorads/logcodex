'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const WA_NUMBER = '5541999283590'
const WA_MSG = encodeURIComponent(
  'Olá! Quero conhecer o LogCodex Fleet. Pode me ajudar?'
)
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`

interface ContactModalProps {
  open: boolean
  onClose: () => void
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (!open) {
      setEmail('')
      setStatus('idle')
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus('done')
    } catch {
      const msg = encodeURIComponent(`Olá! Quero conhecer o LogCodex Fleet. Meu e-mail: ${email}`)
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
      setStatus('done')
    }
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!open || !mounted) return null

  return createPortal(
    <>
      <style>{`
        .cm-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,.72);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: cm-in .18s ease;
        }
        @keyframes cm-in { from { opacity:0 } to { opacity:1 } }
        .cm-box {
          background: #111318;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 20px;
          width: 100%; max-width: 480px;
          padding: 40px 36px 36px;
          position: relative;
          animation: cm-up .22s ease;
        }
        @keyframes cm-up { from { transform:translateY(16px); opacity:0 } to { transform:none; opacity:1 } }
        .cm-close {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,.35); font-size: 22px; line-height: 1;
          padding: 4px 8px; border-radius: 6px;
          transition: color .15s;
        }
        .cm-close:hover { color: #fff; }
        .cm-eyebrow {
          font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
          color: rgba(255,255,255,.35); margin-bottom: 10px;
        }
        .cm-title {
          font-size: 22px; font-weight: 800; color: #fff;
          letter-spacing: -.02em; line-height: 1.2; margin-bottom: 8px;
        }
        .cm-sub {
          font-size: 14px; color: rgba(255,255,255,.45); line-height: 1.6;
          margin-bottom: 32px;
        }
        .cm-divider {
          display: grid; grid-template-columns: 1fr auto 1fr;
          align-items: center; gap: 12px; margin-bottom: 24px;
        }
        .cm-divider hr { border: none; border-top: 1px solid rgba(255,255,255,.1); }
        .cm-divider span { font-size: 12px; color: rgba(255,255,255,.25); white-space: nowrap; }
        .cm-wa-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 15px 20px;
          background: #25d366; color: #fff;
          font-size: 15px; font-weight: 700;
          border: none; border-radius: 12px;
          cursor: pointer; text-decoration: none;
          transition: background .15s, transform .1s;
          margin-bottom: 24px;
        }
        .cm-wa-btn:hover { background: #1ebe5d; transform: translateY(-1px); }
        .cm-email-form { display: flex; flex-direction: column; gap: 10px; }
        .cm-input {
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px; color: #fff; font-size: 15px;
          outline: none; transition: border-color .15s;
          box-sizing: border-box;
        }
        .cm-input::placeholder { color: rgba(255,255,255,.25); }
        .cm-input:focus { border-color: rgba(255,255,255,.35); }
        .cm-email-btn {
          width: 100%; padding: 13px 20px;
          background: #fff; color: #0c0d0f;
          font-size: 15px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          transition: background .15s, transform .1s;
        }
        .cm-email-btn:hover:not(:disabled) { background: #e8eaee; transform: translateY(-1px); }
        .cm-email-btn:disabled { opacity: .5; cursor: default; }
        .cm-feedback {
          font-size: 13px; text-align: center; margin-top: 4px;
          color: rgba(255,255,255,.5);
        }
        .cm-feedback.success { color: #4ade80; }
        .cm-feedback.error { color: #f87171; }
        .cm-fine {
          font-size: 12px; color: rgba(255,255,255,.2);
          text-align: center; margin-top: 20px; line-height: 1.6;
        }
      `}</style>

      <div className="cm-backdrop" onClick={onClose}>
        <div className="cm-box" onClick={(e) => e.stopPropagation()}>
          <button className="cm-close" onClick={onClose} aria-label="Fechar">×</button>

          <p className="cm-eyebrow">LogCodex Fleet · 7 dias grátis</p>
          <h2 className="cm-title">Como prefere começar?</h2>
          <p className="cm-sub">Sem cartão de crédito. Sem compromisso. Você escolhe o canal.</p>

          {/* WhatsApp */}
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cm-wa-btn"
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.47 1.65 6.35L3 29l6.85-1.6A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm6.45 18.1c-.27.76-1.58 1.46-2.16 1.52-.55.06-1.07.26-3.6-.75-3.02-1.2-4.96-4.27-5.11-4.47-.15-.2-1.22-1.63-1.22-3.1 0-1.47.77-2.2 1.04-2.5.27-.3.6-.37.8-.37l.57.01c.18 0 .43-.07.67.51l.87 2.1c.07.17.12.37.01.58l-.32.54-.48.5c-.15.15-.32.32-.14.63.18.3.8 1.31 1.72 2.12 1.18 1.05 2.18 1.38 2.49 1.53.3.15.47.13.65-.08l.43-.52c.18-.22.36-.18.6-.11l1.92.9c.22.1.37.15.42.24.05.33-.12 1.35-.39 2.11z"/>
            </svg>
            Falar pelo WhatsApp
          </a>

          <div className="cm-divider">
            <hr /><span>ou entre com e-mail</span><hr />
          </div>

          {/* E-mail */}
          {status === 'done' ? (
            <p className="cm-feedback success">✓ Link enviado! Confira sua caixa de entrada.</p>
          ) : (
            <form className="cm-email-form" onSubmit={handleEmail}>
              <input
                className="cm-input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <button
                className="cm-email-btn"
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Enviando...' : 'Receber link de acesso'}
              </button>
              {status === 'error' && (
                <p className="cm-feedback error">Algo deu errado. Tente novamente.</p>
              )}
            </form>
          )}

          <p className="cm-fine">7 dias grátis · sem cartão · seus dados sempre seus</p>
        </div>
      </div>
    </>,
    document.body
  )
}
