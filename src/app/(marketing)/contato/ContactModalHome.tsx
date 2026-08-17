'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AgendaPicker } from './AgendaPicker'

// Um único caminho: falar com especialista = agendar direto no calendário.
// `ContactIntent` continua exportado (mesmo com um único valor possível) para
// não quebrar as assinaturas de `onOpenContact` já espalhadas pelos CTAs.
export type ContactIntent = 'agendar' | null

interface ContactModalHomeProps {
  open: boolean
  onClose: () => void
  intent?: ContactIntent
}

export function ContactModalHome({ open, onClose }: ContactModalHomeProps) {
  // `createPortal` só pode rodar após montar no client — em vez de setState num
  // efeito (cascata de render), usa useState(lazy init) para ler `document`
  // uma única vez, já resolvido na primeira renderização client-side.
  const [mounted] = useState(() => typeof document !== 'undefined')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !mounted) return null

  return createPortal(
    <>
      <style>{`
        .cm-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,.72);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px; overflow-y: auto;
          animation: cm-in .18s ease;
        }
        @keyframes cm-in { from { opacity:0 } to { opacity:1 } }
        .cm-box {
          background: #111318;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 20px;
          width: 100%; max-width: 420px;
          padding: 30px 28px 28px;
          position: relative;
          animation: cm-up .22s ease;
          margin: auto;
          /* O calendário + formulário passavam da altura da tela em notebook;
             a caixa rola por dentro em vez de crescer indefinidamente. */
          max-height: 88vh;
          overflow-y: auto;
        }
        @media (max-width: 560px) {
          .cm-backdrop { padding: 0; align-items: flex-end; }
          .cm-box {
            max-width: 100%;
            border-radius: 20px 20px 0 0;
            padding: 28px 20px 24px;
            max-height: 92vh;
            overflow-y: auto;
          }
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
        .cm-wa-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 15px 20px;
          background: #25d366; color: #fff;
          font-size: 15px; font-weight: 700;
          border: none; border-radius: 12px;
          cursor: pointer; text-decoration: none;
          transition: background .15s, transform .1s;
        }
        .cm-wa-btn:hover { background: #1ebe5d; transform: translateY(-1px); }
        .cm-form { display: flex; flex-direction: column; gap: 14px; }
        .cm-field { display: flex; flex-direction: column; gap: 6px; position: relative; }
        .cm-field label { font-size: 12.5px; color: rgba(255,255,255,.5); }
        .cm-input {
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px; color: #fff; font-size: 15px;
          outline: none; transition: border-color .15s;
          box-sizing: border-box; font-family: inherit; resize: vertical;
        }
        .cm-input::placeholder { color: rgba(255,255,255,.25); }
        .cm-input:focus { border-color: rgba(255,255,255,.35); }
        .cm-input.err { border-color: #f87171; }
        .cm-field-err { font-size: 12.5px; color: #f87171; margin: 0; }
        .cm-consent { display: flex; align-items: flex-start; gap: 10px; font-size: 12.5px; color: rgba(255,255,255,.5); line-height: 1.5; cursor: pointer; }
        .cm-consent input { margin-top: 2px; flex-shrink: 0; }
        .cm-consent a { color: rgba(255,255,255,.7); text-decoration: underline; }
        .cm-email-btn {
          width: 100%; padding: 13px 20px;
          background: #fff; color: #0c0d0f;
          font-size: 15px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          transition: background .15s, transform .1s;
        }
        .cm-email-btn:hover:not(:disabled) { background: #e8eaee; transform: translateY(-1px); }
        .cm-email-btn:disabled { opacity: .5; cursor: default; }
        .cm-send-err {
          background: rgba(248,113,113,.08); border: 1px solid rgba(248,113,113,.2);
          border-radius: 10px; padding: 14px 16px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .cm-send-err p { font-size: 13px; color: #f87171; margin: 0; }
        .cm-done { text-align: center; padding: 12px 0; }
      `}</style>

      <div className="cm-backdrop" onClick={onClose}>
        <div className="cm-box" onClick={(e) => e.stopPropagation()}>
          <button className="cm-close" onClick={onClose} aria-label="Fechar">×</button>

          <p className="cm-eyebrow">Agendar reunião</p>
          <h2 className="cm-title">Fale com um especialista</h2>
          {/* Sem prometer "confirmada na hora": com o Google Calendar
              desligado o sistema só registra o horário preferido, e a tela de
              sucesso já diz isso. O texto de antes prometia o que o back-end
              nem sempre entrega. */}
          <p className="cm-sub">Escolha um horário disponível. Retornamos a confirmação pelo WhatsApp.</p>
          <AgendaPicker />
        </div>
      </div>
    </>,
    document.body
  )
}
