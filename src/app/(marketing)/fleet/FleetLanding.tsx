'use client'

import { useEffect, useState } from 'react'
import { ContactModal } from '../ContactModal'

const LogoMark = () => (
  <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
    <rect width="32" height="32" rx="7" fill="none" stroke="currentColor" strokeOpacity="0.45" />
    <path d="M9 8.5 V21.5 H15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23.5 11.6 A5 5 0 0 0 18.5 11.6 V18.4 A5 5 0 0 0 23.5 18.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="#22c55e" fillOpacity="0.15" />
    <path d="M5.5 9.5 L7.5 11.5 L12.5 6.5" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="#ef4444" fillOpacity="0.15" />
    <path d="M6 6 L12 12 M12 6 L6 12" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export function FleetLanding() {
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = (e: React.MouseEvent) => { e.preventDefault(); setModalOpen(true) }

  useEffect(() => {
    const nav = document.getElementById('fl-nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '-40px', threshold: 0.05 }
    )
    document.querySelectorAll('.fl-root .rev').forEach((el) => io.observe(el))
    const t = setTimeout(
      () => document.querySelectorAll('.fl-root .rev').forEach((el) => el.classList.add('in')),
      1400
    )

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      clearTimeout(t)
    }
  }, [])

  return (
    <div className="fl-root">
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <style>{`
        :root{--fl-bg:#090b0f;--fl-bg2:#0e1117;--fl-bg3:#131720;--fl-line:#1e2330;--fl-ink:#f1f5f9;--fl-ink2:#94a3b8;--fl-ink3:#475569;--fl-accent:#6366f1;--fl-green:#22c55e;--fl-amber:#f59e0b;--fl-red:#ef4444;--fl-ease:cubic-bezier(.16,1,.3,1);font-family:'Plus Jakarta Sans',system-ui,sans-serif}
        .fl-root{background:var(--fl-bg);color:var(--fl-ink);min-height:100vh}
        .fl-root *{box-sizing:border-box;margin:0;padding:0}
        /* NAV */
        #fl-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:18px 40px;transition:background .3s,backdrop-filter .3s}
        #fl-nav.scrolled{background:rgba(9,11,15,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--fl-line)}
        .fl-brand{display:flex;align-items:center;gap:9px;font-weight:700;font-size:15px;color:var(--fl-ink);text-decoration:none}
        .fl-nav-cta{background:var(--fl-accent);color:#fff;padding:10px 22px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none;letter-spacing:.01em}
        /* HERO */
        .fl-hero{padding:160px 40px 100px;text-align:center;max-width:900px;margin:0 auto}
        .fl-hero-label{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.3);color:#a5b4fc;padding:6px 16px;border-radius:100px;font-size:13px;font-weight:600;margin-bottom:32px;letter-spacing:.05em}
        .fl-hero-label .dot{width:7px;height:7px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .fl-hero h1{font-size:clamp(40px,7vw,80px);line-height:1.05;font-weight:800;letter-spacing:-.03em;margin-bottom:24px}
        .fl-hero h1 em{font-style:normal;color:var(--fl-ink2)}
        .fl-hero-sub{font-size:clamp(17px,2vw,21px);color:var(--fl-ink2);line-height:1.6;max-width:640px;margin:0 auto 40px;font-weight:400}
        /* CTA FORM */
        .fl-cta-form{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:20px}
        .fl-cta-form input{background:var(--fl-bg2);border:1.5px solid var(--fl-line);color:var(--fl-ink);padding:14px 20px;border-radius:10px;font-size:15px;width:300px;outline:none;transition:border-color .2s}
        .fl-cta-form input:focus{border-color:var(--fl-accent)}
        .fl-cta-form input::placeholder{color:var(--fl-ink3)}
        .fl-btn-cta{background:var(--fl-accent);color:#fff;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:700;border:none;cursor:pointer;transition:transform .15s,box-shadow .15s;white-space:nowrap;text-decoration:none;display:inline-block}
        .fl-btn-cta:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(99,102,241,.35)}
        .fl-cta-fine{font-size:13px;color:var(--fl-ink3);margin-top:6px}
        .fl-cta-done{color:var(--fl-green);font-size:15px;font-weight:600;padding:14px 0}
        .fl-cta-error{color:var(--fl-red);font-size:14px;padding:8px 0}
        /* STATS BAR */
        .fl-stats{display:flex;justify-content:center;gap:48px;flex-wrap:wrap;padding:40px 40px;border-top:1px solid var(--fl-line);border-bottom:1px solid var(--fl-line);background:var(--fl-bg2);margin-bottom:0}
        .fl-stat{text-align:center}
        .fl-stat-n{font-size:32px;font-weight:800;letter-spacing:-.03em;display:block}
        .fl-stat-n em{font-style:normal;color:var(--fl-accent)}
        .fl-stat-l{font-size:13px;color:var(--fl-ink3);margin-top:4px;display:block}
        /* SCREENSHOT */
        .fl-screen{padding:80px 40px;max-width:1100px;margin:0 auto}
        .fl-screen-title{text-align:center;font-size:clamp(22px,3vw,32px);font-weight:700;margin-bottom:12px;letter-spacing:-.02em}
        .fl-screen-sub{text-align:center;color:var(--fl-ink2);font-size:16px;margin-bottom:48px;max-width:560px;margin-left:auto;margin-right:auto}
        .fl-screen-wrap{border-radius:16px;overflow:hidden;border:1px solid var(--fl-line);box-shadow:0 32px 80px rgba(0,0,0,.6)}
        .fl-screen-wrap img{width:100%;display:block}
        .fl-screen-caption{text-align:center;margin-top:20px;font-size:13px;color:var(--fl-ink3)}
        /* DOR vs SOLUÇÃO */
        .fl-vs{padding:80px 40px;max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:32px}
        @media(max-width:768px){.fl-vs{grid-template-columns:1fr}}
        .fl-vs-card{background:var(--fl-bg2);border:1px solid var(--fl-line);border-radius:16px;padding:36px}
        .fl-vs-card.bad{border-color:rgba(239,68,68,.25)}
        .fl-vs-card.good{border-color:rgba(34,197,94,.25)}
        .fl-vs-label{font-size:12px;font-weight:700;letter-spacing:.1em;margin-bottom:24px;display:flex;align-items:center;gap:8px}
        .fl-vs-label.bad-l{color:var(--fl-red)}
        .fl-vs-label.good-l{color:var(--fl-green)}
        .fl-vs-item{display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-bottom:1px solid var(--fl-line)}
        .fl-vs-item:last-child{border-bottom:none}
        .fl-vs-item p{font-size:15px;color:var(--fl-ink2);line-height:1.5}
        .fl-vs-item strong{color:var(--fl-ink);display:block;font-size:15px;margin-bottom:2px}
        /* FEATURES CARDS */
        .fl-feat{padding:80px 40px;max-width:1100px;margin:0 auto}
        .fl-feat-title{font-size:clamp(26px,3.5vw,40px);font-weight:800;text-align:center;margin-bottom:12px;letter-spacing:-.02em}
        .fl-feat-sub{text-align:center;color:var(--fl-ink2);font-size:16px;margin-bottom:56px;max-width:560px;margin-left:auto;margin-right:auto;line-height:1.6}
        .fl-feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
        .fl-feat-card{background:var(--fl-bg2);border:1px solid var(--fl-line);border-radius:14px;padding:28px;transition:border-color .2s}
        .fl-feat-card:hover{border-color:rgba(99,102,241,.4)}
        .fl-feat-icon{font-size:28px;margin-bottom:16px}
        .fl-feat-card h3{font-size:17px;font-weight:700;margin-bottom:8px;letter-spacing:-.01em}
        .fl-feat-card p{font-size:14px;color:var(--fl-ink2);line-height:1.6}
        /* CHAT SCREENSHOT */
        .fl-chat{padding:80px 40px;max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
        @media(max-width:900px){.fl-chat{grid-template-columns:1fr}}
        .fl-chat-text h2{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.025em;margin-bottom:16px;line-height:1.1}
        .fl-chat-text h2 em{font-style:normal;color:var(--fl-ink2)}
        .fl-chat-text p{font-size:16px;color:var(--fl-ink2);line-height:1.7;margin-bottom:24px}
        .fl-chat-tag{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.25);color:#a5b4fc;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:16px}
        /* PROVA SOCIAL */
        .fl-proof{background:var(--fl-bg2);border-top:1px solid var(--fl-line);border-bottom:1px solid var(--fl-line);padding:80px 40px}
        .fl-proof-inner{max-width:800px;margin:0 auto;text-align:center}
        .fl-proof-label{font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--fl-green);margin-bottom:24px;display:block}
        .fl-proof blockquote{font-size:clamp(20px,2.5vw,28px);font-weight:600;line-height:1.4;letter-spacing:-.02em;color:var(--fl-ink);margin-bottom:32px;font-style:italic}
        .fl-proof-meta{display:flex;align-items:center;justify-content:center;gap:16px}
        .fl-proof-avatar{width:48px;height:48px;border-radius:50%;background:var(--fl-bg3);border:2px solid var(--fl-line);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;color:var(--fl-accent)}
        .fl-proof-who strong{display:block;font-size:15px;font-weight:700}
        .fl-proof-who span{font-size:13px;color:var(--fl-ink3)}
        .fl-proof-metrics{display:flex;justify-content:center;gap:48px;flex-wrap:wrap;margin-top:48px;padding-top:48px;border-top:1px solid var(--fl-line)}
        .fl-proof-m{text-align:center}
        .fl-proof-m .n{font-size:40px;font-weight:800;letter-spacing:-.04em;color:var(--fl-accent)}
        .fl-proof-m .l{font-size:13px;color:var(--fl-ink3);margin-top:4px}
        /* PLANOS */
        .fl-plans{padding:100px 40px;max-width:1100px;margin:0 auto}
        .fl-plans-title{font-size:clamp(26px,3.5vw,40px);font-weight:800;text-align:center;margin-bottom:12px;letter-spacing:-.02em}
        .fl-plans-sub{text-align:center;color:var(--fl-ink2);font-size:16px;margin-bottom:64px;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.6}
        .fl-plans-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;align-items:start}
        .fl-plan{background:var(--fl-bg2);border:1px solid var(--fl-line);border-radius:16px;padding:32px;position:relative}
        .fl-plan.hot{border-color:var(--fl-accent);background:linear-gradient(135deg,rgba(99,102,241,.08),var(--fl-bg2))}
        .fl-plan-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--fl-accent);color:#fff;font-size:12px;font-weight:700;padding:4px 16px;border-radius:100px;letter-spacing:.05em;white-space:nowrap}
        .fl-plan h3{font-size:20px;font-weight:700;margin-bottom:4px;letter-spacing:-.01em}
        .fl-plan .tagline{font-size:13px;color:var(--fl-ink3);margin-bottom:20px}
        .fl-plan .price{font-size:42px;font-weight:800;letter-spacing:-.04em;margin:20px 0 4px}
        .fl-plan .price span{font-size:16px;color:var(--fl-ink3);font-weight:400}
        .fl-plan .price-meta{font-size:13px;color:var(--fl-ink3);margin-bottom:24px}
        .fl-plan-items{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
        .fl-plan-items li{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:var(--fl-ink2)}
        .fl-plan-cta{display:block;text-align:center;padding:13px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;transition:all .2s}
        .fl-plan.hot .fl-plan-cta{background:var(--fl-accent);color:#fff}
        .fl-plan.hot .fl-plan-cta:hover{box-shadow:0 6px 20px rgba(99,102,241,.35);transform:translateY(-1px)}
        .fl-plan:not(.hot) .fl-plan-cta{background:var(--fl-bg3);color:var(--fl-ink);border:1px solid var(--fl-line)}
        .fl-plans-fine{text-align:center;margin-top:32px;font-size:13px;color:var(--fl-ink3)}
        /* URGÊNCIA CTA FINAL */
        .fl-final{padding:120px 40px;text-align:center;background:radial-gradient(ellipse 80% 60% at 50% 100%,rgba(99,102,241,.12),transparent)}
        .fl-final h2{font-size:clamp(36px,6vw,68px);font-weight:800;line-height:1.05;letter-spacing:-.04em;margin-bottom:20px}
        .fl-final h2 em{font-style:normal;color:var(--fl-ink2)}
        .fl-final p{font-size:18px;color:var(--fl-ink2);margin-bottom:40px;line-height:1.6}
        .fl-final .fl-cta-fine{margin-top:16px;font-size:13px;color:var(--fl-ink3)}
        /* FOOTER */
        .fl-footer{border-top:1px solid var(--fl-line);padding:48px 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;max-width:1100px;margin:0 auto}
        .fl-footer-brand{display:flex;align-items:center;gap:9px;font-weight:700;font-size:14px;color:var(--fl-ink);text-decoration:none}
        .fl-footer-links{display:flex;gap:24px}
        .fl-footer-links a{font-size:13px;color:var(--fl-ink3);text-decoration:none}
        .fl-footer-links a:hover{color:var(--fl-ink)}
        /* REVEAL */
        .fl-root .rev{opacity:0;transform:translateY(24px);transition:opacity .9s var(--fl-ease),transform .9s var(--fl-ease)}
        .fl-root .rev.in{opacity:1;transform:none}
        @media (prefers-reduced-motion:reduce){.fl-root .rev{opacity:1;transform:none;transition:none}}
        @media(max-width:600px){#fl-nav{padding:14px 20px}.fl-hero,.fl-screen,.fl-vs,.fl-feat,.fl-chat,.fl-proof,.fl-plans,.fl-final{padding-left:20px;padding-right:20px}.fl-cta-form input{width:100%}.fl-cta-form{flex-direction:column;align-items:stretch}.fl-stats{gap:24px}.fl-chat{gap:40px}.fl-footer{flex-direction:column;align-items:flex-start}}
      `}</style>

      {/* NAV */}
      <nav id="fl-nav">
        <a href="/" className="fl-brand">
          <LogoMark />
          LogCodex Fleet
        </a>
        <a href="#" className="fl-nav-cta" onClick={openModal}>Testar 7 dias grátis</a>
      </nav>

      {/* HERO */}
      <section className="fl-hero">
        <div className="rev">
          <div className="fl-hero-label">
            <span className="dot" />
            LOGCODEX FLEET · CONTROLE DE FROTA
          </div>
          <h1>
            Você sabe quanto<br />
            <em>ganhou esse mês?</em>
          </h1>
          <p className="fl-hero-sub">
            Gestores de frota perdem dinheiro sem saber — porque os custos somem entre planilhas, WhatsApp e papel. O Fleet fecha essa conta. Automaticamente.
          </p>

          <div className="fl-cta-form" style={{ justifyContent: 'center' }}>
            <a href="#" className="fl-btn-cta" onClick={openModal}>Começar grátis agora →</a>
          </div>
          <p className="fl-cta-fine">WhatsApp ou e-mail · 7 dias grátis · sem cartão</p>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="fl-stats rev">
        <div className="fl-stat">
          <span className="fl-stat-n"><em>−</em>12h</span>
          <span className="fl-stat-l">por semana no acerto</span>
        </div>
        <div className="fl-stat">
          <span className="fl-stat-n"><em>~</em>0</span>
          <span className="fl-stat-l">erros de acerto</span>
        </div>
        <div className="fl-stat">
          <span className="fl-stat-n">180</span>
          <span className="fl-stat-l">viagens/mês em produção</span>
        </div>
        <div className="fl-stat">
          <span className="fl-stat-n"><em>&lt;</em>5min</span>
          <span className="fl-stat-l">para registrar uma viagem</span>
        </div>
      </div>

      {/* SCREENSHOT — DASHBOARD */}
      <div className="fl-screen rev">
        <h2 className="fl-screen-title">Tudo que você precisa saber. Em uma tela.</h2>
        <p className="fl-screen-sub">Faturamento, custos, margem, viagens ativas e acertos pendentes — sem abrir planilha.</p>
        <div className="fl-screen-wrap">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/screenshots/dashboard.jpg`}
            alt="Dashboard LogCodex Fleet — visão geral da operação"
            style={{ width: '100%', display: 'block' }}
            onError={(e) => {
              const t = e.target as HTMLImageElement
              t.style.display = 'none'
              const p = t.parentElement!
              p.style.cssText = `background:#0e1117;padding:80px 40px;text-align:center;color:#475569;font-size:15px`
              p.innerHTML = '<div style="font-size:32px;margin-bottom:16px">📊</div><p>Dashboard · R$ 12.860 faturados · 79,9% de margem · Assistente Fleet ativo</p>'
            }}
          />
        </div>
        <p className="fl-screen-caption">JCLS Transportes · Paraná · 5 motoristas · 180 viagens/mês</p>
      </div>

      {/* DOR vs SOLUÇÃO */}
      <div className="fl-vs rev">
        <div className="fl-vs-card bad">
          <div className="fl-vs-label bad-l">
            <XIcon /> ANTES DO FLEET
          </div>
          <div className="fl-vs-item">
            <XIcon />
            <div>
              <strong>Custo invisível por viagem</strong>
              <p>Combustível, pedágio e manutenção somem entre notas e WhatsApp. Você fecha o mês sem saber se lucrou.</p>
            </div>
          </div>
          <div className="fl-vs-item">
            <XIcon />
            <div>
              <strong>Acerto vira discussão</strong>
              <p>Sem documento claro, o acerto com motorista é sempre tenso. Às vezes refaz três vezes na mesma semana.</p>
            </div>
          </div>
          <div className="fl-vs-item">
            <XIcon />
            <div>
              <strong>Decisão no achismo</strong>
              <p>Fecha o frete sem saber a margem real. Só descobre que perdeu dinheiro quando o caixa fecha no vermelho.</p>
            </div>
          </div>
        </div>

        <div className="fl-vs-card good">
          <div className="fl-vs-label good-l">
            <CheckIcon /> COM O FLEET
          </div>
          <div className="fl-vs-item">
            <CheckIcon />
            <div>
              <strong>Custo real por viagem</strong>
              <p>Cada despesa é registrada no momento. O custo total sai calculado automaticamente — sem abrir planilha.</p>
            </div>
          </div>
          <div className="fl-vs-item">
            <CheckIcon />
            <div>
              <strong>Acerto em 30 minutos</strong>
              <p>O sistema calcula: proposta − despesas = acerto. Motorista vê, confere e aprova. Sem discussão, sem retrabalho.</p>
            </div>
          </div>
          <div className="fl-vs-item">
            <CheckIcon />
            <div>
              <strong>Margem antes de fechar</strong>
              <p>Você vê o lucro estimado da rota antes de aceitar o frete. Decide com número, não com instinto.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SCREENSHOT — ASSISTENTE */}
      <div className="fl-chat rev">
        <div className="fl-chat-text">
          <span className="fl-chat-tag">Assistente Fleet · IA</span>
          <h2>Pergunta em português.<br /><em>Resposta em segundos.</em></h2>
          <p>
            "Quanto gastei com combustível em maio?" — O assistente consulta os dados reais da sua operação e responde com o contexto completo: despesas, viagens, motoristas.
          </p>
          <p>
            Sem relatório para abrir. Sem Excel para filtrar. Você pergunta como perguntaria para um gerente operacional.
          </p>
        </div>
        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e2330', boxShadow: '0 24px 60px rgba(0,0,0,.5)' }}>
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/screenshots/assistant.jpg`}
            alt="Assistente Fleet — chat com IA para consultas operacionais"
            style={{ width: '100%', display: 'block' }}
            onError={(e) => {
              const t = e.target as HTMLImageElement
              t.style.display = 'none'
              const p = t.parentElement!
              p.style.cssText = `background:#0e1117;padding:48px 32px;color:#94a3b8;font-size:14px;line-height:1.7`
              p.innerHTML = `
                <div style="background:#131720;border-radius:10px;padding:16px 20px;margin-bottom:12px;color:#f1f5f9">quanto eu gastei com combustivel em maio?</div>
                <div style="background:#1e2330;border-radius:10px;padding:16px 20px;color:#94a3b8">
                  Claro! Veja o resumo de maio:<br/>
                  <span style="color:#22c55e;font-weight:700">Combustível: R$ 2.000,00</span><br/>
                  Pedágio: R$ 240,00 · Limpeza: R$ 350,00<br/>
                  Comissões: R$ 2.266,00<br/>
                  <span style="color:#6366f1">Resultado: R$ 16.770,00</span>
                </div>
              `
            }}
          />
        </div>
      </div>

      {/* FEATURES */}
      <div className="fl-feat rev">
        <h2 className="fl-feat-title">Tudo que sua operação precisa. Nada que não usa.</h2>
        <p className="fl-feat-sub">Cada função foi construída com base em como transportadoras reais trabalham — não no que fica bonito num demo.</p>
        <div className="fl-feat-grid">
          {[
            { icon: '🚛', title: 'Viagens documentadas', desc: 'Origem, destino, km, valor do frete. Cada viagem com custo real calculado automaticamente.' },
            { icon: '💰', title: 'Acertos com motoristas', desc: 'Proposta − despesas = acerto. Documento claro, sem discussão, aprovado pelo motorista.' },
            { icon: '⛽', title: 'Despesas e combustível', desc: 'Diesel, ARLA, pedágio, manutenção. Custo por veículo e por viagem, no detalhe.' },
            { icon: '📊', title: 'Dashboard em tempo real', desc: 'Faturamento, margem, viagens ativas, acertos pendentes — visão completa da operação.' },
            { icon: '🤖', title: 'Assistente Fleet (IA)', desc: 'Consulte dados da frota por chat. Resposta com contexto real, sem filtrar relatório.' },
            { icon: '📋', title: 'Propostas e clientes', desc: 'Da cotação ao fechamento. Proposta com rota e validade, amarrada à viagem.' },
          ].map((f) => (
            <div className="fl-feat-card" key={f.title}>
              <div className="fl-feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROVA SOCIAL — JCLS */}
      <div className="fl-proof rev">
        <div className="fl-proof-inner">
          <span className="fl-proof-label">CLIENTE EM PRODUÇÃO · JCLS TRANSPORTES · PARANÁ</span>
          <blockquote>
            "Antes do Fleet, todo acerto com motorista virava uma tarde perdida. Agora fechamos em 30 minutos. O sistema calcula, o motorista vê e confirma."
          </blockquote>
          <div className="fl-proof-meta">
            <div className="fl-proof-avatar">J</div>
            <div className="fl-proof-who">
              <strong>Junior Rodrigo</strong>
              <span>Gestor · JCLS Transportes</span>
            </div>
          </div>
          <div className="fl-proof-metrics">
            <div className="fl-proof-m">
              <div className="n">−12h</div>
              <div className="l">por semana no acerto</div>
            </div>
            <div className="fl-proof-m">
              <div className="n">~0</div>
              <div className="l">erros de acerto</div>
            </div>
            <div className="fl-proof-m">
              <div className="n">180</div>
              <div className="l">viagens/mês</div>
            </div>
            <div className="fl-proof-m">
              <div className="n">5</div>
              <div className="l">motoristas ativos</div>
            </div>
          </div>
        </div>
      </div>

      {/* PLANOS */}
      <div className="fl-plans" id="planos">
        <h2 className="fl-plans-title rev">Comece grátis. Pague quando valer.</h2>
        <p className="fl-plans-sub rev">7 dias com tudo liberado, sem cartão. Depois, escolha o plano pelo volume. Cancela quando quiser.</p>
        <div className="fl-plans-grid rev">
          <div className="fl-plan">
            <h3>Starter</h3>
            <p className="tagline">Até 50 viagens/mês</p>
            <p className="price">R$ 99<span>/mês</span></p>
            <p className="price-meta">5 motoristas incluídos</p>
            <ul className="fl-plan-items">
              {['Viagens, despesas e acertos', 'Painel operacional', 'Assistente Fleet (IA)', 'Suporte por e-mail'].map(i => (
                <li key={i}><CheckIcon />{i}</li>
              ))}
            </ul>
            <a href="#" className="fl-plan-cta" onClick={openModal}>Testar grátis 7 dias</a>
          </div>

          <div className="fl-plan hot">
            <span className="fl-plan-badge">MAIS ESCOLHIDO</span>
            <h3>Profissional</h3>
            <p className="tagline">Até 300 viagens/mês</p>
            <p className="price">R$ 299<span>/mês</span></p>
            <p className="price-meta">Motoristas ilimitados</p>
            <ul className="fl-plan-items">
              {['Tudo do Starter', 'Relatórios e fluxo financeiro', 'Propostas e clientes', 'Suporte prioritário'].map(i => (
                <li key={i}><CheckIcon />{i}</li>
              ))}
            </ul>
            <a href="#" className="fl-plan-cta" onClick={openModal}>Testar grátis 7 dias</a>
          </div>

          <div className="fl-plan">
            <h3>Sob demanda</h3>
            <p className="tagline">Acima de 300 viagens/mês</p>
            <p className="price" style={{ fontSize: '28px' }}>Sob consulta</p>
            <p className="price-meta">Integração e SLA garantido</p>
            <ul className="fl-plan-items">
              {['Tudo do Profissional', 'Integrações customizadas', 'SLA garantido', 'Suporte dedicado'].map(i => (
                <li key={i}><CheckIcon />{i}</li>
              ))}
            </ul>
            <a href="mailto:leonardo.antunes@logcodex.com" className="fl-plan-cta">Falar com a gente</a>
          </div>
        </div>
        <p className="fl-plans-fine rev">Sem cobrança automática · seus dados exportáveis em Excel · cancela quando quiser</p>
      </div>

      {/* CTA FINAL */}
      <div className="fl-final rev">
        <h2>Pronto pra sair<br /><em>do achismo?</em></h2>
        <p>Teste grátis por 7 dias. Cadastre sua frota, registre as primeiras viagens e veja o número real aparecer. Sem cartão, sem compromisso.</p>
        <a href="#" className="fl-btn-cta" onClick={openModal} style={{ fontSize: '18px', padding: '18px 40px' }}>Começar agora →</a>
        <p className="fl-cta-fine">WhatsApp ou e-mail · 7 dias grátis · sem cartão · sem contrato</p>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #1e2330', padding: '40px', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <a href="/" className="fl-footer-brand">
          <LogoMark />
          LogCodex Fleet
        </a>
        <div className="fl-footer-links">
          <a href="/">logcodex.com</a>
          <a href="mailto:leonardo.antunes@logcodex.com">Contato</a>
          <a href="#planos">Planos</a>
        </div>
        <span style={{ fontSize: '13px', color: '#475569' }}>© 2026 LogCodex</span>
      </footer>
    </div>
  )
}
