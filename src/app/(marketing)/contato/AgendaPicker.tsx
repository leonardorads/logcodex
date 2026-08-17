'use client'

import { useEffect, useRef, useState } from 'react'
import { trackLeadConversion } from '@/lib/track'
import { WhatsAppButton } from './WhatsAppButton'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
        }
      ) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
  }
}

/**
 * O script do Turnstile (`layout.tsx`) faz um scan implícito do DOM só uma vez,
 * no seu próprio load — como esta `<div class="cf-turnstile">` só existe depois
 * que o modal abre (bem depois desse scan), o widget nunca renderizava sozinho
 * e `cf-turnstile-response` ficava sempre vazio, derrubando todo envio com 422.
 * Precisa chamar `window.turnstile.render()` explicitamente quando o elemento
 * aparece — com retry curto, pois o script pode ainda não ter carregado.
 *
 * O token vem pelo `callback`, não da leitura do input escondido no momento do
 * clique: o desafio termina de forma ASSÍNCRONA, então quem preenchia o
 * formulário rápido enviava com o campo ainda vazio e levava 422
 * ("Verificação de segurança falhou"). Guardar o token em estado permite
 * bloquear o botão até ele existir.
 */
function useTurnstileWidget(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onToken: (token: string | null) => void,
  widgetIdRef: React.MutableRefObject<string | null>
) {
  // Ref para o callback não recriar o widget a cada render do formulário
  // (cada recriação reiniciaria o desafio e perderia o token já obtido).
  const onTokenRef = useRef(onToken)
  useEffect(() => { onTokenRef.current = onToken }, [onToken])

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return
    const container = containerRef.current
    if (!container) return

    let widgetId: string | null = null
    let cancelled = false
    let attempts = 0

    function tryRender() {
      if (cancelled || !container) return
      if (window.turnstile) {
        widgetId = window.turnstile.render(container, {
          sitekey: TURNSTILE_SITE_KEY!,
          callback: (token: string) => { if (!cancelled) onTokenRef.current(token) },
          // Token expira em ~5 min; sem isto o visitante que deixa o modal
          // aberto envia com token vencido e leva 422.
          'expired-callback': () => { if (!cancelled) onTokenRef.current(null) },
          'error-callback': () => { if (!cancelled) onTokenRef.current(null) },
        })
        widgetIdRef.current = widgetId
        return
      }
      attempts++
      if (attempts < 40) setTimeout(tryRender, 250)
    }
    tryRender()

    return () => {
      cancelled = true
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
      widgetIdRef.current = null
    }
  }, [containerRef, widgetIdRef])
}

interface SlotApi {
  inicio: string
  fim: string
  label: string
  diaLabel: string
  ocupado: boolean
}

const TZ = 'America/Sao_Paulo'
const WEEK_DAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

/**
 * Chave de dia (YYYY-MM-DD) do slot NO FUSO DE BRASÍLIA.
 *
 * O `inicio` vem em UTC: um slot das 18:20 BRT chega como 21:20Z do mesmo dia,
 * mas um horário noturno cairia no dia seguinte em UTC. Usar `getDate()` puro
 * jogaria esse slot na célula errada do calendário — por isso a data é montada
 * a partir do `Intl` com timeZone explícito, nunca do relógio do servidor.
 */
function diaKeyEmSP(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(iso))
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

/** Constrói a grade do mês (semanas de domingo a sábado) para uma chave YYYY-MM. */
function gradeDoMes(ano: number, mes: number): (string | null)[][] {
  const primeiro = new Date(Date.UTC(ano, mes, 1))
  const diasNoMes = new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate()
  const offsetInicial = primeiro.getUTCDay()

  const celulas: (string | null)[] = Array(offsetInicial).fill(null)
  for (let d = 1; d <= diasNoMes; d++) {
    celulas.push(`${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  while (celulas.length % 7 !== 0) celulas.push(null)

  const semanas: (string | null)[][] = []
  for (let i = 0; i < celulas.length; i += 7) semanas.push(celulas.slice(i, i + 7))
  return semanas
}

type FieldErrors = { nome?: string; empresa?: string; whatsapp?: string; email?: string; consent?: string; slot?: string }

export function AgendaPicker() {
  const turnstileRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileDesistiu, setTurnstileDesistiu] = useState(false)
  useTurnstileWidget(turnstileRef, setTurnstileToken, widgetIdRef)

  // Trava de segurança da trava: se o desafio não resolver em 12s (domínio não
  // autorizado, Cloudflare fora do ar, bloqueador), liberar o botão. É melhor
  // deixar o servidor recusar com uma mensagem do que prender o visitante num
  // botão que nunca habilita — o guard do servidor continua valendo.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || turnstileToken) return
    const t = setTimeout(() => setTurnstileDesistiu(true), 12000)
    return () => clearTimeout(t)
  }, [turnstileToken])

  // Sem site key configurada o guard do servidor se auto-desliga, então o
  // formulário não pode ficar travado esperando um token que nunca vem.
  const aguardandoTurnstile = Boolean(TURNSTILE_SITE_KEY) && !turnstileToken && !turnstileDesistiu

  const [slots, setSlots] = useState<SlotApi[] | null>(null)
  const [loadErr, setLoadErr] = useState(false)
  const [selected, setSelected] = useState<SlotApi | null>(null)
  const [diaAberto, setDiaAberto] = useState<string | null>(null)
  const [mesVisivel, setMesVisivel] = useState<{ ano: number; mes: number } | null>(null)

  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [sendErr, setSendErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<{ nome: string; calendarConfirmed: boolean } | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/agenda/slots')
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        const lista: SlotApi[] = json.data?.slots ?? []
        setSlots(lista)
        // Abre já no primeiro dia com horário livre: um calendário que abre
        // vazio faz o visitante procurar onde clicar.
        const primeiroLivre = lista.find((s) => !s.ocupado) ?? lista[0]
        if (primeiroLivre) {
          const key = diaKeyEmSP(primeiroLivre.inicio)
          setDiaAberto(key)
          const [a, m] = key.split('-').map(Number)
          setMesVisivel({ ano: a, mes: m - 1 })
        }
      })
      .catch(() => { if (!cancelled) setLoadErr(true) })
    return () => { cancelled = true }
  }, [])

  const validate = (): boolean => {
    const e: FieldErrors = {}
    if (!selected) e.slot = 'Escolha um horário na lista.'
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a gente saber como te chamar.'
    if (empresa.trim().length < 2) e.empresa = 'Informe o nome da sua empresa.'
    if (whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = 'Informe um WhatsApp válido com DDD.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Esse e-mail não parece válido.'
    if (!consent) e.consent = 'Marque a caixa de consentimento para a gente poder entrar em contato.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    setSendErr(null)
    if (!validate() || !selected) return
    const form = ev.currentTarget
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? ''
    // O token vem do callback do widget. Fallback para o input escondido
    // cobre o caso de o Turnstile ter preenchido o campo sem disparar o
    // callback (acontece quando o desafio é resolvido antes do render).
    const token =
      turnstileToken ??
      (form.elements.namedItem('cf-turnstile-response') as HTMLInputElement | null)?.value ??
      ''
    setLoading(true)
    try {
      const res = await fetch('/api/agenda/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome, empresa, whatsapp, email, consent,
          mensagem: mensagem || undefined,
          slot_inicio: selected.inicio,
          slot_fim: selected.fim,
          website: honeypot,
          turnstile_token: token,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        if (json.error?.code === 'SLOT_TAKEN') {
          setSelected(null)
          setSlots((prev) => prev?.map((s) => (s.inicio === selected.inicio ? { ...s, ocupado: true } : s)) ?? null)
        }
        // O Turnstile consome o token a cada verificação: sem reiniciar o
        // widget, a segunda tentativa reenviaria um token já gasto e falharia
        // de novo, prendendo o visitante num erro que não é culpa dele.
        setTurnstileToken(null)
        if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current)
        setSendErr(json.error?.message ?? 'Não conseguimos registrar seu horário agora.')
        return
      }
      trackLeadConversion('lead_agendamento')
      setDone({ nome: json.data?.nome ?? nome, calendarConfirmed: Boolean(json.data?.calendarConfirmed) })
    } catch {
      setSendErr('Não conseguimos enviar agora. Verifique sua internet e tente de novo.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="cm-done">
        <p className="cm-title" style={{ marginBottom: '8px' }}>Recebemos, {done.nome}.</p>
        <p className="cm-sub" style={{ marginBottom: 0 }}>
          {done.calendarConfirmed
            ? `Reunião confirmada para ${selected?.diaLabel} às ${selected?.label} (Horários em Brasília). O convite foi criado na nossa agenda.`
            : 'Registramos seu horário preferido. Confirmamos por WhatsApp.'}
        </p>
      </div>
    )
  }

  // Agrupa por dia (chave YYYY-MM-DD em Brasília) para o calendário.
  const porDia = new Map<string, SlotApi[]>()
  for (const s of slots ?? []) {
    const key = diaKeyEmSP(s.inicio)
    if (!porDia.has(key)) porDia.set(key, [])
    porDia.get(key)!.push(s)
  }

  const semanas = mesVisivel ? gradeDoMes(mesVisivel.ano, mesVisivel.mes) : []
  const slotsDoDia = diaAberto ? (porDia.get(diaAberto) ?? []) : []

  // Navegação só entre meses que têm algum horário — a janela é de 14 dias,
  // então deixar navegar livremente levaria o visitante a meses sempre vazios.
  const mesesComSlots = [...new Set([...porDia.keys()].map((k) => k.slice(0, 7)))].sort()
  const mesAtualKey = mesVisivel
    ? `${mesVisivel.ano}-${String(mesVisivel.mes + 1).padStart(2, '0')}`
    : ''
  const idxMes = mesesComSlots.indexOf(mesAtualKey)
  const temMesAnterior = idxMes > 0
  const temMesSeguinte = idxMes >= 0 && idxMes < mesesComSlots.length - 1

  const irParaMes = (delta: number) => {
    const alvo = mesesComSlots[idxMes + delta]
    if (!alvo) return
    const [a, m] = alvo.split('-').map(Number)
    setMesVisivel({ ano: a, mes: m - 1 })
  }

  return (
    <form className="cm-form" onSubmit={onSubmit} noValidate>
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label>Não preencha este campo<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="cm-field">
        <label>Horário (Horários em Brasília)</label>
        {!slots && !loadErr && <p className="cm-sub" style={{ marginBottom: 0 }}>Carregando horários…</p>}
        {loadErr && <p className="cm-field-err">Não conseguimos carregar os horários agora. Tente recarregar a página.</p>}
        {slots && slots.length === 0 && <p className="cm-sub" style={{ marginBottom: 0 }}>Sem horários disponíveis no momento — fale com a gente pelo WhatsApp.</p>}
        {slots && slots.length > 0 && mesVisivel && (
          <div className="ap-cal">
            <header className="ap-cal-head">
              <span className="ap-cal-title">
                {MESES[mesVisivel.mes]} de {mesVisivel.ano}
              </span>
              <button
                type="button" className="ap-cal-nav" aria-label="Mês anterior"
                disabled={!temMesAnterior} onClick={() => irParaMes(-1)}
              >‹</button>
              <button
                type="button" className="ap-cal-nav" aria-label="Próximo mês"
                disabled={!temMesSeguinte} onClick={() => irParaMes(1)}
              >›</button>
            </header>

            <table className="ap-cal-grid">
              <thead>
                <tr>{WEEK_DAYS.map((d) => <th key={d} scope="col">{d}</th>)}</tr>
              </thead>
              <tbody>
                {semanas.map((semana, i) => (
                  <tr key={i}>
                    {semana.map((key, j) => {
                      if (!key) return <td key={j} />
                      const doDia = porDia.get(key)
                      const temLivre = doDia?.some((s) => !s.ocupado) ?? false
                      const indisponivel = !doDia || !temLivre
                      const numero = Number(key.slice(8))
                      return (
                        <td key={j}>
                          <button
                            type="button"
                            className={`ap-cal-cell${diaAberto === key ? ' active' : ''}${indisponivel ? ' off' : ''}`}
                            disabled={indisponivel}
                            aria-label={indisponivel ? `Dia ${numero}, sem horário` : `Dia ${numero}, com horários`}
                            onClick={() => setDiaAberto(key)}
                          >
                            {numero}
                            {!indisponivel && <span className="ap-cal-dot" aria-hidden="true" />}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {diaAberto && (
              <div className="ap-times">
                <p className="ap-times-label">{slotsDoDia[0]?.diaLabel ?? ''}</p>
                <div className="ap-times-list">
                  {slotsDoDia.map((s) => (
                    <button
                      type="button"
                      key={s.inicio}
                      disabled={s.ocupado}
                      className={`ap-slot${selected?.inicio === s.inicio ? ' active' : ''}${s.ocupado ? ' busy' : ''}`}
                      onClick={() => setSelected(s)}
                    >
                      {s.ocupado ? `${s.label} · ocupado` : s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {errors.slot && <p className="cm-field-err">{errors.slot}</p>}
      </div>

      <div className="cm-field">
        <label htmlFor="ap-nome">Seu nome</label>
        <input id="ap-nome" className={`cm-input${errors.nome ? ' err' : ''}`} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João da Silva" autoComplete="name" />
        {errors.nome && <p className="cm-field-err">{errors.nome}</p>}
      </div>

      <div className="cm-field">
        <label htmlFor="ap-empresa">Empresa</label>
        <input id="ap-empresa" className={`cm-input${errors.empresa ? ' err' : ''}`} value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nome da transportadora" autoComplete="organization" />
        {errors.empresa && <p className="cm-field-err">{errors.empresa}</p>}
      </div>

      <div className="cm-field">
        <label htmlFor="ap-wpp">WhatsApp</label>
        <input id="ap-wpp" className={`cm-input${errors.whatsapp ? ' err' : ''}`} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(00) 00000-0000" inputMode="tel" autoComplete="tel" />
        {errors.whatsapp && <p className="cm-field-err">{errors.whatsapp}</p>}
      </div>

      <div className="cm-field">
        <label htmlFor="ap-email">E-mail</label>
        <input id="ap-email" type="email" className={`cm-input${errors.email ? ' err' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com.br" autoComplete="email" />
        {errors.email && <p className="cm-field-err">{errors.email}</p>}
      </div>

      <div className="cm-field">
        <label htmlFor="ap-msg">Conte um pouco da sua operação (opcional)</label>
        <textarea id="ap-msg" className="cm-input" rows={3} value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Quantos veículos, como controla hoje, o que mais incomoda..." />
      </div>

      <label className="cm-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>Aceito receber contato da LogCodex sobre minha operação. <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de privacidade</a></span>
      </label>
      {errors.consent && <p className="cm-field-err">{errors.consent}</p>}

      {TURNSTILE_SITE_KEY ? <div ref={turnstileRef} style={{ margin: '8px 0' }} /> : null}

      {/* O visitante não pode ficar sem caminho se a verificação não carregar:
          o envio segue permitido (o servidor decide), e o WhatsApp fica à mão. */}
      {turnstileDesistiu && !turnstileToken && (
        <div className="cm-send-err">
          <p>A verificação de segurança não carregou. Você pode tentar enviar mesmo assim ou falar direto com a gente.</p>
          <WhatsAppButton message="Olá! Quero agendar uma reunião sobre a minha operação." label="Falar no WhatsApp" />
        </div>
      )}

      {sendErr && (
        <div className="cm-send-err">
          <p>{sendErr}</p>
          <WhatsAppButton message="Olá! Tentei agendar uma reunião pelo site e não consegui. Pode me ajudar?" label="Falar no WhatsApp agora" />
        </div>
      )}

      {/* Desabilitar enquanto o desafio não termina evita o 422 silencioso:
          antes o clique rápido enviava token vazio e o visitante só via
          "Verificação de segurança falhou", sem entender o motivo. */}
      <button className="cm-email-btn" type="submit" disabled={loading || aguardandoTurnstile}>
        {loading ? 'Enviando…' : aguardandoTurnstile ? 'Verificando segurança…' : 'Confirmar horário'}
      </button>

      <style>{`
        /* Calendário em grade de mês, no espírito do date picker de referência
           (cabeçalho com mês + navegação, células circulares, seleção sólida),
           adaptado à paleta escura do modal e ao CSS próprio do projeto. */
        .ap-cal {
          margin-top: 8px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 14px;
          background: rgba(255,255,255,.03);
          padding: 14px 14px 12px;
        }
        .ap-cal-head { display: flex; align-items: center; gap: 4px; margin-bottom: 10px; }
        /* Sem text-transform:capitalize — ele maiusculiza TODA palavra e
           produzia "Agosto De 2026". ::first-letter capitaliza só a inicial. */
        .ap-cal-title {
          font-size: 13.5px; font-weight: 600; color: rgba(255,255,255,.9);
          margin-right: auto;
        }
        .ap-cal-title::first-letter { text-transform: uppercase; }
        .ap-cal-nav {
          width: 28px; height: 28px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,.12); border-radius: 8px;
          background: transparent; color: rgba(255,255,255,.75);
          font-size: 16px; line-height: 1; cursor: pointer; font-family: inherit;
          transition: background .15s, border-color .15s, opacity .15s;
        }
        .ap-cal-nav:hover:not(:disabled) { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.25); }
        .ap-cal-nav:disabled { opacity: .25; cursor: default; }

        .ap-cal-grid { width: 100%; border-collapse: separate; border-spacing: 0 4px; table-layout: fixed; }
        .ap-cal-grid th {
          font-size: 10.5px; font-weight: 500; padding-bottom: 4px;
          color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .06em;
        }
        .ap-cal-grid td { text-align: center; padding: 0; }
        .ap-cal-cell {
          position: relative;
          width: 34px; height: 34px;
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid transparent; border-radius: 50%;
          background: transparent; color: rgba(255,255,255,.85);
          font-size: 13px; font-family: inherit; cursor: pointer;
          transition: background .15s, color .15s, border-color .15s, transform .12s;
        }
        .ap-cal-cell:hover:not(:disabled) { background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.2); }
        .ap-cal-cell:active:not(:disabled) { transform: scale(.94); }
        .ap-cal-cell.active { background: #fff; color: #0c0d0f; font-weight: 700; border-color: #fff; }
        .ap-cal-cell.off { color: rgba(255,255,255,.2); cursor: default; }
        /* Ponto indicando dia com horário livre — sai quando a célula está
           selecionada, senão briga com o fundo branco. */
        .ap-cal-dot {
          position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
          width: 3px; height: 3px; border-radius: 50%; background: var(--accent, #6366f1);
        }
        .ap-cal-cell.active .ap-cal-dot { display: none; }

        .ap-times { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,.08); }
        /* Mesmo motivo do .ap-cal-title: capitalize fazia "Seg., 17 De Ago." */
        .ap-times-label {
          font-size: 11.5px; color: rgba(255,255,255,.45);
          margin: 0 0 8px;
        }
        .ap-times-label::first-letter { text-transform: uppercase; }
        .ap-times-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .ap-slot {
          padding: 9px 14px; border-radius: 999px; font-size: 13px; font-family: inherit;
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.85); cursor: pointer;
          transition: background .15s, border-color .15s, color .15s;
          white-space: nowrap;
        }
        .ap-slot:hover:not(:disabled) { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.28); }
        .ap-slot.active { background: #fff; color: #0c0d0f; border-color: #fff; font-weight: 700; }
        .ap-slot.busy { opacity: .32; cursor: default; text-decoration: line-through; }

        @media (max-width: 560px) {
          .ap-cal { padding: 12px 10px 10px; }
          .ap-cal-cell { width: 30px; height: 30px; font-size: 12.5px; }
          .ap-slot { padding: 8px 12px; font-size: 12.5px; }
        }
      `}</style>
    </form>
  )
}
