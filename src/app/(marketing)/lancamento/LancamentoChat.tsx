'use client'

import { useState, useRef, useEffect } from 'react'

// Variante do FleetChat para a campanha /lancamento.
// Mesmo visual (caixa com borda animada), mas o CTA pós-envio leva ao form
// do Lote 1 (#vaga) — nunca "testar grátis" (termo da /fleet, proibido aqui).

const SUGGESTIONS = [
  'Quanto faturei essa semana?',
  'Qual rota deu mais prejuízo?',
  'Motoristas com acerto pendente?',
  'Custo de combustível em maio?',
]

export function LancamentoChat({ onWantSpot }: { onWantSpot: () => void }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }
  function handleSuggestion(s: string) {
    setValue(s)
    setTimeout(() => handleSend(s), 0)
  }

  return (
    <>
      <style>{`
        .fc-wrap{display:flex;flex-direction:column;align-items:center;max-width:680px;margin:0 auto}
        .fc-border-wrap{width:100%;position:relative;border-radius:22px;padding:1.5px;background:linear-gradient(var(--fc-angle,135deg),rgba(99,102,241,0.55),rgba(96,165,250,0.35),rgba(255,255,255,0.08),rgba(99,102,241,0.45));animation:fc-border-spin 4s linear infinite}
        @property --fc-angle{syntax:'<angle>';initial-value:135deg;inherits:false}
        @keyframes fc-border-spin{to{--fc-angle:495deg}}
        .fc-box{width:100%;background:#0e1014;border-radius:20px;padding:16px 18px 14px;position:relative}
        .fc-pills-inner{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .fc-pill{font-size:12px;padding:5px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.38);background:transparent;cursor:pointer;font-family:inherit;transition:color .15s,border-color .15s,background .15s;white-space:nowrap}
        .fc-pill:hover{color:rgba(255,255,255,0.75);border-color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.04)}
        @media(max-width:640px){.fc-pills-inner{display:none}.fc-box{padding:14px 16px 12px;border-radius:16px}.fc-border-wrap{border-radius:18px}.fc-textarea{font-size:14px;min-height:44px}}
        .fc-textarea{width:100%;background:transparent;border:none;outline:none;resize:none;color:rgba(255,255,255,0.88);font-size:15px;font-family:inherit;line-height:1.55;min-height:28px;max-height:120px;overflow-y:auto;padding:0}
        .fc-textarea::placeholder{color:rgba(255,255,255,0.22)}
        .fc-footer{display:flex;align-items:center;justify-content:space-between;margin-top:12px}
        .fc-hint{font-size:12px;color:rgba(255,255,255,0.15)}
        .fc-send-btn{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.9);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,transform .1s;flex-shrink:0}
        .fc-send-btn:hover{background:#fff;transform:scale(1.06)}
        .fc-send-btn:disabled{background:rgba(255,255,255,0.1);cursor:default;transform:none}
        .fc-cta-box{width:100%;background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.22);border-radius:20px;padding:28px 32px;text-align:center;animation:fc-fade-in .3s ease}
        @keyframes fc-fade-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .fc-cta-query{font-size:13px;color:rgba(255,255,255,0.3);margin-bottom:16px;font-style:italic}
        .fc-cta-text{font-size:15px;color:rgba(255,255,255,0.6);line-height:1.65;margin-bottom:20px}
        .fc-cta-text strong{color:rgba(255,255,255,0.85);font-weight:600}
        .fc-cta-action{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:rgba(99,102,241,0.14);border:1px solid rgba(99,102,241,0.35);border-radius:999px;font-size:14px;font-weight:700;color:#a5b4fc;cursor:pointer;font-family:inherit;transition:background .15s,transform .1s}
        .fc-cta-action:hover{background:rgba(99,102,241,0.24);transform:translateY(-1px)}
        .fc-reset{display:block;margin:12px auto 0;font-size:12px;color:rgba(255,255,255,0.18);background:none;border:none;cursor:pointer;font-family:inherit;transition:color .15s}
        .fc-reset:hover{color:rgba(255,255,255,0.42)}
      `}</style>

      <div className="fc-wrap">
        {/* SSR-safe (L17): nunca {cond && <el>}. Renderiza ambos os estados,
            alterna por className "hidden". submitted parte de false no SSR. */}
        <div className={submitted ? 'hidden' : 'fc-border-wrap'}>
          <div className="fc-box">
            <div className="fc-pills-inner">
              {SUGGESTIONS.map((s) => (
                <button type="button" key={s} className="fc-pill" onClick={() => handleSuggestion(s)}>{s}</button>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className="fc-textarea"
              placeholder="Pergunte sobre sua operação..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <div className="fc-footer">
              <span className="fc-hint">Enter para enviar</span>
              <button type="button" className="fc-send-btn" onClick={() => handleSend()} disabled={!value.trim()} aria-label="Enviar">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M7.5 2v11M2 7.5l5.5-5.5 5.5 5.5" stroke="#0c0d0f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={submitted ? 'fc-cta-box' : 'hidden'}>
          <p className="fc-cta-query">&quot;{value}&quot;</p>
          <p className="fc-cta-text">
            Essa é uma <strong>demonstração</strong>. No Fleet, o Assistente responde isso com os <strong>dados reais</strong> da sua operação. Garanta sua vaga no Lote 1 e veja com a sua frota.
          </p>
          <button type="button" className="fc-cta-action" onClick={onWantSpot}>Quero minha vaga →</button>
          <button type="button" className="fc-reset" onClick={() => { setSubmitted(false); setValue('') }}>voltar</button>
        </div>
      </div>
    </>
  )
}
