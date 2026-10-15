'use client'

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { MotionConfig, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, BadgePercent, Globe, Bot, CalendarDays, Camera, ChevronDown, Eye, Gift, Inbox,
  CalendarCheck, MapPin, MessageCircle, Mountain, Rocket, Search, ShieldCheck, Smartphone, Sparkles, Sun, Video, Zap,
} from 'lucide-react'
import { ContactModalHome } from '../contato/ContactModalHome'
import { precarregarHorarios } from '../contato/AgendaPicker'
import { classeFontes } from './fontes'
import { CuboLogo } from './CuboLogo'
import { Marca } from './Marca'
import { Calculadora } from './Calculadora'
import { PlanoAnual } from './PlanoAnual'
import { PhoneDemo } from './PhoneDemo'
import { GoogleBusca, NoveEmDez } from './GoogleBusca'
import { Perguntas } from './Perguntas'
import { PreviaGratis } from './PreviaGratis'
import { WHATSAPP_LOGCODEX } from '@/lib/previa'

// Contato da frente de hospedagem: WhatsApp oficial da LogCodex (Fluke, Cloud API),
// no ar desde 14/10/2026 com a Lia + aprovação do Leo. Trocado do número pessoal
// do Leo em 14/10 (decisão dele no plano da prévia grátis).
const MSG = 'Olá! Vi a página da LogCodex e quero uma prévia do site da minha pousada.'
const LINK_ZAP = `https://wa.me/${WHATSAPP_LOGCODEX}?text=${encodeURIComponent(MSG)}`

const sobe = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}
const grupo = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }

function Revela({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={grupo} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      {children}
    </motion.div>
  )
}

// card com luz que segue o mouse
function Card({ icon, t, d }: { icon: ReactNode; t: string; d: string }) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <motion.div className="pz-card" variants={sobe} onMouseMove={onMove}>
      <span className="pz-card__icone">{icon}</span>
      <h3>{t}</h3>
      <p>{d}</p>
    </motion.div>
  )
}

// CTA principal: "falar com especialista" abre a agenda (mesmo padrão da home,
// grava no Google Calendar do Leo). Preço é sob consulta — decisão do Leo, 08/10.
function BotaoEspecialista({ onClick, grande = false, children = 'Falar com especialista' }: { onClick: () => void; grande?: boolean; children?: ReactNode }) {
  return (
    <button
      type="button"
      className={`pz-btn ${grande ? 'pz-btn--grande' : ''}`}
      onClick={onClick}
      onPointerEnter={() => { precarregarHorarios().catch(() => {}) }}
      onFocus={() => { precarregarHorarios().catch(() => {}) }}
    >
      <CalendarCheck size={18} />
      <span>{children}</span>
      <ArrowRight size={16} className="pz-btn__seta" />
    </button>
  )
}

const DORES = [
  { icon: <BadgePercent size={22} />, t: 'Comissão em cada reserva', d: 'A plataforma fica com uma parte de toda diária.' },
  { icon: <Eye size={22} />, t: 'Hóspede preso no anúncio', d: 'Ele compara você com a pousada do lado.' },
  { icon: <Inbox size={22} />, t: 'WhatsApp cheio de pergunta', d: '“Tem vaga? Quanto é? Aceita pet?” — o dia todo.' },
]

const PASSOS = [
  { n: '01', icon: <Camera size={22} />, t: 'Prévia com as suas fotos', d: 'Pronta em até 1 hora, em horário comercial, depois que as fotos chegam. Grátis.' },
  { n: '02', icon: <Gift size={22} />, t: 'Versão completa, cortesia', d: 'Ajustamos juntos até ficar com a sua cara.' },
  { n: '03', icon: <Rocket size={22} />, t: 'Você decide colocar no ar', d: 'Só investe quando aprovar. Sem surpresa.' },
]

const ENTREGA = [
  { icon: <CalendarDays size={22} />, t: 'Reserva com datas', d: 'O hóspede chega no WhatsApp já dizendo quando e quantos.' },
  { icon: <Smartphone size={22} />, t: 'Feito para o celular', d: 'Rápido e bonito onde o hóspede realmente olha.' },
  { icon: <Video size={22} />, t: 'Vídeo do lugar', d: 'As suas fotos ganham movimento.' },
  { icon: <Search size={22} />, t: 'Pronto para o Google', d: 'Para ser achado por quem busca a sua região.' },
  { icon: <ShieldCheck size={22} />, t: 'Sem comissão', d: 'A reserva direta é sua, do início ao fim.' },
  { icon: <Bot size={22} />, t: 'Atendimento humanizado com IA', d: 'Responde o hóspede com naturalidade, 24h, e entrega a reserva pronta para você.' },
]

// Destinos do Brasil inteiro (pedido do Leo, 09/10: atender todo o país, não só PR e SC)
const LUGARES = ['Gramado', 'Paraty', 'Ilha do Mel', 'Jericoacoara', 'Bonito', 'Chapada Diamantina', 'Monte Verde', 'Trancoso', 'Urubici', 'Pipa', 'Campos do Jordão', 'Maragogi', 'Morretes', 'Lençóis', 'Bombinhas']

// A agenda tem estado próprio, fora da landing (09/10/2026): com o estado na
// landing, cada clique em "Falar com especialista" redesenhava a página inteira
// (celular, Google, painel, animações) antes de a janela aparecer — meio segundo
// medido. Agora o botão só avisa por um evento e apenas a janela é desenhada.
const EVENTO_AGENDA = 'pz:abrir-agenda'
const abreAgenda = () => window.dispatchEvent(new Event(EVENTO_AGENDA))

function AgendaPousada() {
  const [aberta, setAberta] = useState(false)
  useEffect(() => {
    const abrir = () => setAberta(true)
    window.addEventListener(EVENTO_AGENDA, abrir)
    // Horários buscados assim que a página abre: ao clicar, a agenda já vem
    // pronta, sem aparecer segundos depois.
    precarregarHorarios().catch(() => {})
    return () => window.removeEventListener(EVENTO_AGENDA, abrir)
  }, [])
  return (
    <ContactModalHome open={aberta} onClose={() => setAberta(false)} nicho="hospedagem" classeExtra={classeFontes} marca={<CuboLogo size={34} />} />
  )
}

export function PousadasLanding() {
  const reduz = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yPhone = useTransform(scrollYProgress, [0, 1], [0, reduz ? 0 : 90])
  const passosRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: pPassos } = useScroll({ target: passosRef, offset: ['start 80%', 'end 60%'] })
  const linha = useTransform(pPassos, [0, 1], [0, 1])

  return (
    <MotionConfig reducedMotion="user">
    <div className="pz">
      <div className="pz-aurora" aria-hidden>
        <span /><span /><span />
      </div>
      <div className="pz-grao" aria-hidden />

      <header className="pz-nav">
        <Marca />
        <BotaoEspecialista onClick={abreAgenda} />
      </header>

      <main id="topo">
        {/* ── HERO ─────────────────────────────── */}
        <section className="pz-hero" ref={heroRef}>
          <motion.div className="pz-hero__texto" variants={grupo} initial="hidden" animate="show">
            <motion.p className="pz-selo" variants={sobe}>
              <Sparkles size={14} /> Sites para pousadas de todo o Brasil
            </motion.p>
            <motion.h1 variants={sobe}>
              Mais hóspedes <br />
              reservando <span className="pz-brilho">direto com você.</span>
            </motion.h1>
            <motion.p className="pz-hero__sub" variants={sobe}>
              Um site à altura da sua pousada, que leva o hóspede do encanto à reserva no WhatsApp — sem depender só das plataformas.
            </motion.p>
            <motion.div className="pz-hero__acoes" variants={sobe}>
              <BotaoEspecialista onClick={abreAgenda} grande />
              <a className="pz-link" href="#como">
                Como funciona <ChevronDown size={16} />
              </a>
            </motion.div>
            <motion.p className="pz-dica" variants={sobe}>
              Preço sob consulta, numa conversa rápida e sem compromisso. Prefere sem conversa?{' '}
              <a href="#previa">Peça a sua prévia grátis</a> em 1 minuto.
            </motion.p>
            <motion.ul className="pz-hero__provas" variants={sobe}>
              <li><Gift size={15} /> Prévia sem custo</li>
              <li><Camera size={15} /> Com as suas fotos</li>
              <li><ShieldCheck size={15} /> Sem compromisso</li>
            </motion.ul>
          </motion.div>

          <motion.div
            className="pz-hero__visual"
            style={{ y: yPhone }}
            initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pz-halo" aria-hidden />
            <PhoneDemo />
            <motion.div className="pz-flutua pz-flutua--a" animate={reduz ? undefined : { y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
              <Bot size={16} /> Atendimento humanizado com IA, 24h
            </motion.div>
            <motion.div className="pz-flutua pz-flutua--b" animate={reduz ? undefined : { y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }}>
              <BadgePercent size={16} /> Zero comissão
            </motion.div>
          </motion.div>
        </section>

        {/* ── LUGARES ──────────────────────────── */}
        <div className="pz-faixa" aria-label="Destinos de todo o Brasil">
          <div className="pz-faixa__trilho">
            {[...LUGARES, ...LUGARES].map((l, i) => (
              <span key={i}>
                {i % 3 === 0 ? <Sun size={14} /> : i % 3 === 1 ? <Mountain size={14} /> : <MapPin size={14} />} {l}
              </span>
            ))}
          </div>
        </div>

        {/* ── DOR ──────────────────────────────── */}
        <section className="pz-secao">
          <Revela className="pz-titulo">
            <motion.p className="pz-sobretitulo" variants={sobe}>O que trava a sua reserva hoje</motion.p>
            <motion.h2 variants={sobe}>
              Sua pousada é linda. <br />
              <span className="pz-brilho">O caminho até a reserva, nem tanto.</span>
            </motion.h2>
          </Revela>
          <Revela className="pz-grade pz-grade--3">
            {DORES.map((c) => <Card key={c.t} {...c} />)}
          </Revela>
        </section>

        {/* ── GOOGLE ───────────────────────────── */}
        <section className="pz-secao">
          <div className="pz-google-grade">
            <Revela className="pz-google-texto">
              <motion.p className="pz-sobretitulo" variants={sobe}>Ser encontrado</motion.p>
              <motion.h2 variants={sobe}>
                Quem procura no Google <span className="pz-brilho">precisa achar você.</span>
              </motion.h2>
              <motion.div className="pz-stat" variants={sobe}>
                <NoveEmDez />
                <p>
                  Quase 9 em cada 10 buscas no Brasil são feitas no Google.
                  <small>StatCounter, 2026</small>
                </p>
              </motion.div>
              <motion.ul className="pz-lista" variants={sobe}>
                <li><Globe size={18} /> Sem site próprio, quem aparece é a plataforma — e os seus concorrentes ao lado.</li>
                <li><MapPin size={18} /> Com site, a sua pousada ganha nome, endereço e fotos do jeito que o Google lê.</li>
                <li><ShieldCheck size={18} /> “Site oficial” passa confiança e leva a reserva direto para você.</li>
              </motion.ul>
            </Revela>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
              <GoogleBusca />
            </motion.div>
          </div>
        </section>

        {/* ── CALCULADORA ──────────────────────── */}
        <section className="pz-secao" id="comissao">
          <Revela className="pz-titulo">
            <motion.p className="pz-sobretitulo" variants={sobe}>Faça a conta</motion.p>
            <motion.h2 variants={sobe}>
              Quanto fica <span className="pz-brilho">em comissões?</span>
            </motion.h2>
            <motion.p className="pz-titulo__sub" variants={sobe}>Simule quanto deixaria de pagar se parte das reservas viesse direto para você.</motion.p>
          </Revela>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
            <Calculadora acao={<BotaoEspecialista onClick={abreAgenda}>Quero mais reservas diretas</BotaoEspecialista>} />
          </motion.div>
        </section>

        {/* ── COMO FUNCIONA ────────────────────── */}
        <section className="pz-secao" id="como">
          <Revela className="pz-titulo">
            <motion.p className="pz-sobretitulo" variants={sobe}>Como funciona</motion.p>
            <motion.h2 variants={sobe}>
              Você vê antes. <span className="pz-brilho">Decide depois.</span>
            </motion.h2>
            <motion.p className="pz-rapido" variants={sobe}>
              <Zap size={15} />
              <span>Rápido: sua prévia grátis fica pronta <b>em até 1 hora</b>, em horário comercial, depois que recebemos as suas fotos.</span>
            </motion.p>
          </Revela>
          <div className="pz-passos" ref={passosRef}>
            <motion.div className="pz-passos__linha" style={{ scaleX: linha }} aria-hidden />
            <Revela className="pz-grade pz-grade--3">
              {PASSOS.map((p) => (
                <motion.div key={p.n} className="pz-passo" variants={sobe}>
                  <span className="pz-passo__n">{p.n}</span>
                  <span className="pz-passo__icone">{p.icon}</span>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </motion.div>
              ))}
            </Revela>
          </div>
        </section>

        {/* ── PRÉVIA GRÁTIS (formulário) ───────── */}
        <PreviaGratis />

        {/* ── ENTREGA ──────────────────────────── */}
        <section className="pz-secao">
          <Revela className="pz-titulo">
            <motion.p className="pz-sobretitulo" variants={sobe}>O que você recebe</motion.p>
            <motion.h2 variants={sobe}>
              Feito para <span className="pz-brilho">virar reserva.</span>
            </motion.h2>
          </Revela>
          <Revela className="pz-grade pz-grade--3 pz-grade--lista">
            {ENTREGA.map((c) => <Card key={c.t} {...c} />)}
          </Revela>
        </section>

        {/* ── PLANO DE 12 MESES ────────────────── */}
        <section className="pz-secao">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
            <PlanoAnual />
          </motion.div>
        </section>

        {/* ── PERGUNTAS ────────────────────────── */}
        <section className="pz-secao pz-secao--estreita">
          <Revela className="pz-titulo">
            <motion.p className="pz-sobretitulo" variants={sobe}>Perguntas rápidas</motion.p>
          </Revela>
          <Revela>
            <motion.div variants={sobe}>
              <Perguntas />
            </motion.div>
          </Revela>
        </section>

        {/* ── FECHAMENTO ───────────────────────── */}
        <section className="pz-fecho">
          <Revela>
            <motion.div variants={sobe} className="pz-fecho__cubo">
              <CuboLogo size={64} />
            </motion.div>
            <motion.h2 variants={sobe}>
              Veja a sua pousada <span className="pz-brilho">num site de verdade.</span>
            </motion.h2>
            <motion.p variants={sobe}>A prévia é grátis e fica pronta com as suas fotos. Escolha um horário e converse com um especialista.</motion.p>
            <motion.div variants={sobe}>
              <BotaoEspecialista onClick={abreAgenda} grande />
            </motion.div>
            <motion.p variants={sobe} className="pz-dica pz-dica--centro">
              Ou, se preferir, <a href={LINK_ZAP} target="_blank" rel="noopener noreferrer">chame no WhatsApp</a>.
            </motion.p>
          </Revela>
        </section>
      </main>

      <footer className="pz-rodape">
        <CuboLogo size={20} animar={false} />
        <span><span className="pz-logo-nome">logcodex</span> · sites e soluções sob medida · atendemos todo o Brasil</span>
        <a href="/politica-de-privacidade">Privacidade</a>
      </footer>

      <AgendaPousada />

      <a className="pz-zap-fixo" href={LINK_ZAP} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
        <MessageCircle size={24} />
      </a>
    </div>
    </MotionConfig>
  )
}
