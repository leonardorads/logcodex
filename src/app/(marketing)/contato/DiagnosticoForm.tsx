'use client'

import { useState } from 'react'
import { trackLeadConversion } from '@/lib/track'
import { WhatsAppButton } from './WhatsAppButton'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

type FieldErrors = { nome?: string; empresa?: string; whatsapp?: string; email?: string; consent?: string }

type Origem = 'home_diagnostico' | 'home_agendamento' | 'home_whatsapp'

// A Fase 2 troca `horarioPreferido` por um AgendaPicker com slots reais do
// Google Calendar. Até lá, agendar reunião = pedir a preferência em texto livre.
export function DiagnosticoForm({ origem }: { origem: Origem }) {
  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [horarioPreferido, setHorarioPreferido] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sendErr, setSendErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [doneName, setDoneName] = useState<string | null>(null)

  const validate = (): boolean => {
    const e: FieldErrors = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a gente saber como te chamar.'
    if (empresa.trim().length < 2) e.empresa = 'Informe o nome da sua empresa.'
    if (whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = 'Informe um WhatsApp válido com DDD. É por onde a gente te chama.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Esse e-mail não parece válido. Confira e tente de novo.'
    if (!consent) e.consent = 'Marque a caixa de consentimento para a gente poder entrar em contato.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    setSendErr(null)
    if (!validate()) return
    const form = ev.currentTarget
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? ''
    const turnstileToken = (form.elements.namedItem('cf-turnstile-response') as HTMLInputElement | null)?.value ?? ''
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome, empresa, whatsapp, email, consent,
          mensagem: [mensagem, horarioPreferido && `Horário preferido: ${horarioPreferido}`].filter(Boolean).join(' — ') || undefined,
          origem,
          website: honeypot,
          turnstile_token: turnstileToken,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setSendErr(json.error?.message ?? 'Não conseguimos registrar seu pedido agora.')
        return
      }
      const name = json.data?.nome ?? nome
      trackLeadConversion('lead_diagnostico')
      setDoneName(name)
    } catch {
      setSendErr('Não conseguimos enviar agora. Verifique sua internet e tente de novo.')
    } finally {
      setLoading(false)
    }
  }

  if (doneName) {
    return (
      <div className="cm-done">
        <p className="cm-title" style={{ marginBottom: '8px' }}>Recebemos, {doneName}.</p>
        <p className="cm-sub" style={{ marginBottom: 0 }}>
          {origem === 'home_agendamento'
            ? 'Registramos seu horário preferido. Confirmamos por WhatsApp.'
            : 'Nossa equipe analisa sua operação e retorna por WhatsApp ou e-mail em até 1 dia útil.'}
        </p>
      </div>
    )
  }

  return (
    <form className="cm-form" onSubmit={onSubmit} noValidate>
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label>Não preencha este campo<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="cm-field">
        <label htmlFor="df-nome">Seu nome</label>
        <input id="df-nome" className={`cm-input${errors.nome ? ' err' : ''}`} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João da Silva" autoComplete="name" />
        {errors.nome && <p className="cm-field-err">{errors.nome}</p>}
      </div>

      <div className="cm-field">
        <label htmlFor="df-empresa">Empresa</label>
        <input id="df-empresa" className={`cm-input${errors.empresa ? ' err' : ''}`} value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nome da transportadora" autoComplete="organization" />
        {errors.empresa && <p className="cm-field-err">{errors.empresa}</p>}
      </div>

      <div className="cm-field">
        <label htmlFor="df-wpp">WhatsApp</label>
        <input id="df-wpp" className={`cm-input${errors.whatsapp ? ' err' : ''}`} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(00) 00000-0000" inputMode="tel" autoComplete="tel" />
        {errors.whatsapp && <p className="cm-field-err">{errors.whatsapp}</p>}
      </div>

      <div className="cm-field">
        <label htmlFor="df-email">E-mail</label>
        <input id="df-email" type="email" className={`cm-input${errors.email ? ' err' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com.br" autoComplete="email" />
        {errors.email && <p className="cm-field-err">{errors.email}</p>}
      </div>

      {origem === 'home_agendamento' && (
        <div className="cm-field">
          <label htmlFor="df-horario">Horário preferido (Horários em Brasília)</label>
          <input id="df-horario" className="cm-input" value={horarioPreferido} onChange={(e) => setHorarioPreferido(e.target.value)} placeholder="Ex: terça de manhã, sábado 10h" />
        </div>
      )}

      <div className="cm-field">
        <label htmlFor="df-msg">Conte um pouco da sua operação (opcional)</label>
        <textarea id="df-msg" className="cm-input" rows={3} value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Quantos veículos, como controla hoje, o que mais incomoda..." />
      </div>

      <label className="cm-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>Aceito receber contato da LogCodex sobre minha operação. <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de privacidade</a></span>
      </label>
      {errors.consent && <p className="cm-field-err">{errors.consent}</p>}

      {TURNSTILE_SITE_KEY ? <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} style={{ margin: '8px 0' }} /> : null}

      {sendErr && (
        <div className="cm-send-err">
          <p>{sendErr}</p>
          <WhatsAppButton message="Olá! Tentei solicitar um diagnóstico pelo site e não consegui enviar. Pode me ajudar?" label="Falar no WhatsApp agora" />
        </div>
      )}

      <button className="cm-email-btn" type="submit" disabled={loading}>
        {loading ? 'Enviando…' : origem === 'home_agendamento' ? 'Enviar preferência de horário' : 'Solicitar diagnóstico'}
      </button>
    </form>
  )
}
