'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Camera, CheckCircle2, Clock, Loader2, MessageCircle, Send } from 'lucide-react'
import { useTurnstileWidget } from '../contato/AgendaPicker'
import { trackLeadConversion } from '@/lib/track'
import { CONSENT_TEXTO, linkWhatsapp, mensagemPedido } from '@/lib/previa'

// Seção "Quer receber uma prévia grátis?" (plano aprovado pelo Leo em 14/10/2026,
// projetos/hermes/docs/frentes/previa-gratis-formulario-plano.md). Só 4 campos:
// as fotos chegam depois, pelo WhatsApp, onde o próprio app já deixa as imagens
// leves. O pedido só começa quando a pousada ENVIA a mensagem (regra da Meta:
// clicar no link não abre a conversa), por isso o 2º passo é um botão grande.

const TEM_TURNSTILE = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const sobe = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const PASSOS = [
  { icon: <Send size={18} />, t: 'Preencha 4 campos', d: 'Nome, cidade, WhatsApp e, se tiver, um link da pousada.' },
  { icon: <MessageCircle size={18} />, t: 'Envie a mensagem pronta', d: 'Ela abre o nosso WhatsApp já com o seu pedido.' },
  { icon: <Camera size={18} />, t: 'Mande as fotos por lá', d: 'De 10 a 20 fotos. A prévia fica pronta em até 1 hora, em horário comercial.' },
]

function utm(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  const r: Record<string, string> = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const v = p.get(k)
    if (v) r[k] = v
  }
  return r
}

export function PreviaGratis() {
  const [pousada, setPousada] = useState('')
  const [cidade, setCidade] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [link, setLink] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot
  const [token, setToken] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [pronto, setPronto] = useState<{ href: string } | null>(null)

  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  useTurnstileWidget(turnstileRef, setToken, widgetIdRef)

  const bloqueado = enviando || (TEM_TURNSTILE && !token)

  // Sem token depois de alguns segundos = a verificação não carregou (bloqueador
  // de anúncio, rede ruim, domínio fora da lista do Cloudflare). O botão fica
  // travado; então a pessoa precisa saber por quê e ter uma saída (WhatsApp).
  // Erro de 14/10: no endereço de teste o botão ficava cinza sem explicação.
  const [verifDemorou, setVerifDemorou] = useState(false)
  useEffect(() => {
    if (!TEM_TURNSTILE || token) return
    const t = setTimeout(() => setVerifDemorou(true), 12000)
    return () => { clearTimeout(t); setVerifDemorou(false) }
  }, [token])

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (bloqueado) return
    setErro(null)
    setEnviando(true)
    try {
      const res = await fetch('/api/previa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pousada, cidade, whatsapp, link, consent, website, turnstile_token: token, ...utm() }),
      })
      const json = (await res.json().catch(() => ({}))) as { data?: { codigo: string }; error?: { message: string } }
      if (!res.ok || !json.data) {
        setErro(json.error?.message ?? 'Não conseguimos registrar seu pedido agora. Tente de novo ou chame no WhatsApp.')
        if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current)
        setToken(null)
        return
      }
      const linkLimpo = link.trim() || null
      const texto = mensagemPedido(json.data.codigo, pousada.trim(), cidade.trim(), linkLimpo)
      setPronto({ href: linkWhatsapp(texto) })
      trackLeadConversion('lead_previa')
    } catch {
      setErro('Sem conexão agora. Confira a internet e tente de novo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="pz-secao" id="previa">
      <div className="pz-previa">
        <motion.div className="pz-previa__texto" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}>
          <motion.p className="pz-sobretitulo" variants={sobe}>Prévia grátis</motion.p>
          <motion.h2 variants={sobe}>
            Quer receber uma <span className="pz-brilho">prévia grátis?</span>
          </motion.h2>
          <motion.p className="pz-previa__sub" variants={sobe}>
            Veja a sua pousada num site de verdade, com as suas fotos, antes de decidir qualquer coisa.
          </motion.p>
          <motion.ol className="pz-previa__passos" variants={sobe}>
            {PASSOS.map((p, i) => (
              <li key={p.t}>
                <span className="pz-previa__n">{i + 1}</span>
                <div>
                  <strong>{p.icon} {p.t}</strong>
                  <p>{p.d}</p>
                </div>
              </li>
            ))}
          </motion.ol>
        </motion.div>

        <motion.div className="pz-previa__cartao" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
          {pronto ? (
            <div className="pz-previa__pronto" role="status">
              <CheckCircle2 size={40} className="pz-previa__ok" />
              <h3>Falta só 1 passo</h3>
              <p>Toque no botão e <b>envie a mensagem</b> que já está pronta. É ela que inicia a sua prévia.</p>
              <a className="pz-btn pz-btn--grande pz-previa__zap" href={pronto.href} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={20} />
                <span>Enviar mensagem para receber minha prévia</span>
                <ArrowRight size={16} className="pz-btn__seta" />
              </a>
              <p className="pz-previa__nota">
                <Camera size={15} /> <span>Depois, mande de 10 a 20 fotos da pousada por lá. Envie como <b>foto</b>, não como documento: o WhatsApp já deixa as imagens leves.</span>
              </p>
              <p className="pz-previa__nota">
                <Clock size={15} /> <span>A prévia fica pronta em até 1 hora, em horário comercial, depois que as fotos chegam.</span>
              </p>
            </div>
          ) : (
            <form className="pz-form" onSubmit={enviar} noValidate>
              <label>
                <span>Nome da pousada</span>
                <input value={pousada} onChange={(e) => setPousada(e.target.value)} maxLength={120} required autoComplete="organization" placeholder="Ex.: Pousada Recanto do Rio" />
              </label>
              <label>
                <span>Cidade e estado</span>
                <input value={cidade} onChange={(e) => setCidade(e.target.value)} maxLength={80} required autoComplete="address-level2" placeholder="Ex.: Morretes/PR" />
              </label>
              <label>
                <span>WhatsApp com DDD</span>
                <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={20} required inputMode="tel" autoComplete="tel" placeholder="(41) 99999-9999" />
              </label>
              <label>
                <span>Link da pousada <em>(opcional)</em></span>
                <input value={link} onChange={(e) => setLink(e.target.value)} maxLength={500} inputMode="url" placeholder="Site, Instagram ou Booking" />
              </label>
              {/* honeypot: escondido de quem usa a página; robô preenche */}
              <input className="pz-form__mel" tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} name="website" />
              <label className="pz-form__caixa">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
                <span>
                  {CONSENT_TEXTO} <a href="/hospedagem/privacidade" target="_blank" rel="noopener noreferrer">Privacidade</a>
                </span>
              </label>
              {TEM_TURNSTILE && <div ref={turnstileRef} className="pz-form__turnstile" />}
              {erro && <p className="pz-form__erro" role="alert">{erro}</p>}
              {TEM_TURNSTILE && !token && !enviando && (
                verifDemorou ? (
                  <p className="pz-form__erro" role="alert">
                    A verificação de segurança não carregou. Recarregue a página ou{' '}
                    <a href={linkWhatsapp(`Olá! Quero a prévia grátis do site da minha pousada${pousada.trim() ? ` (${pousada.trim()})` : ''}.`)} target="_blank" rel="noopener noreferrer">peça pelo WhatsApp</a>.
                  </p>
                ) : (
                  <p className="pz-form__aviso"><Loader2 size={14} className="pz-roda" /> Verificando que você não é um robô…</p>
                )
              )}
              <button type="submit" className="pz-btn pz-btn--grande pz-form__enviar" disabled={bloqueado}>
                {enviando ? <Loader2 size={18} className="pz-roda" /> : <Send size={18} />}
                <span>{enviando ? 'Registrando…' : 'Quero minha prévia grátis'}</span>
              </button>
              <p className="pz-form__rodape">Sem custo e sem compromisso. Você só investe se decidir colocar o site no ar.</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
