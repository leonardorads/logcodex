'use client'

import { useState } from 'react'
import { LogoMark } from './LogoMark'

interface Integracao {
  id: string
  label: string
  category: string
  title: string
  desc: string
  accent: string
  iconSlug: string
}

// Logo real de marca (Simple Icons, via jsDelivr). O SVG original vem com a cor
// oficial da marca embutida no fill — em fundo escuro várias ficam sem contraste
// (ex.: preto/roxo escuro). `.integ-node-icon img` aplica filter para branco puro,
// deixando o traçado sempre legível; a cor de acento (--accent) fica só no hover/
// card, não no ícone em si.
const INTEGRACOES: Integracao[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    category: 'Atendimento & agentes',
    title: 'Agentes de IA atendendo pelo WhatsApp',
    desc: 'Notificações automáticas, atendimento respondido por bot e consultas aos seus sistemas — no canal que sua equipe e seus clientes já usam, sem instalar nada.',
    accent: '#25d366',
    iconSlug: 'whatsapp',
  },
  {
    id: 'gmail',
    label: 'Gmail',
    category: 'Notificações',
    title: 'Avisos e relatórios automáticos',
    desc: 'Alertas, resumos e pendências disparados pela automação no momento certo — sem depender de alguém lembrar de enviar.',
    accent: '#ea4335',
    iconSlug: 'gmail',
  },
  {
    id: 'teams',
    label: 'Microsoft Teams',
    category: 'Comunicação corporativa',
    title: 'Alertas no canal onde o time decide',
    desc: 'Eventos dos seus processos entregues no Teams, no canal certo. A informação chega até a equipe — não o contrário.',
    accent: '#6264a7',
    iconSlug: 'microsoftteams',
  },
  {
    id: 'slack',
    label: 'Slack',
    category: 'Comunicação corporativa',
    title: 'Automação dentro do workspace',
    desc: 'Resumos e avisos no Slack que a equipe já acompanha, acionando pessoas só quando existe algo que exige decisão.',
    accent: '#4a154b',
    iconSlug: 'slack',
  },
  {
    id: 'googlesheets',
    label: 'Google Sheets',
    category: 'Ponto de partida',
    title: 'A planilha atual vira ponto de partida',
    desc: 'Os dados que já existem nas suas planilhas são importados e passam a alimentar a solução. Ninguém recomeça o cadastro do zero.',
    accent: '#0f9d58',
    iconSlug: 'googlesheets',
  },
  {
    id: 'n8n',
    label: 'n8n',
    category: 'Automação',
    title: 'Fluxos automatizados sob medida',
    desc: 'As regras específicas do seu processo viram automação orquestrada — do gatilho à ação, sem etapa manual no meio do caminho.',
    accent: '#ea4b71',
    iconSlug: 'n8n',
  },
  {
    id: 'zapier',
    label: 'Zapier',
    category: 'Automação',
    title: 'Conectado ao que você já automatiza',
    desc: 'A solução entra nos fluxos que sua empresa já mantém, ligando sistemas que hoje não conversam entre si.',
    accent: '#ff4a00',
    iconSlug: 'zapier',
  },
  {
    id: 'supabase',
    label: 'Supabase',
    category: 'Infraestrutura',
    title: 'Base de dados sólida — e sua',
    desc: 'Infraestrutura escalável, com acesso controlado por perfil e os dados pertencendo sempre à sua empresa.',
    accent: '#3ecf8e',
    iconSlug: 'supabase',
  },
  {
    id: 'hubspot',
    label: 'HubSpot',
    category: 'CRM',
    title: 'Comercial e operação na mesma linha',
    desc: 'Contatos, propostas e histórico sincronizados com o CRM que a equipe comercial já usa todo dia.',
    accent: '#ff7a59',
    iconSlug: 'hubspot',
  },
  {
    id: 'sap',
    label: 'SAP',
    category: 'ERP',
    title: 'Integração com o ERP existente',
    desc: 'Leitura e escrita nos principais ERPs do mercado, eliminando o lançamento duplicado entre sistemas.',
    accent: '#0faaff',
    iconSlug: 'sap',
  },
  {
    id: 'claude',
    label: 'Claude (MCP)',
    category: 'IA & MCP',
    title: 'Seus dados dentro do assistente de IA',
    desc: 'Via MCP, o Claude consulta e aciona os sistemas da sua empresa — perguntar em português substitui abrir relatório.',
    accent: '#d97757',
    iconSlug: 'anthropic',
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT (MCP)',
    category: 'IA & MCP',
    title: 'Processos acessíveis pelo ChatGPT',
    desc: 'Conecte dados e automações ao ChatGPT via MCP para consultar processos e disparar ações pela conversa.',
    accent: '#10a37f',
    iconSlug: 'openai',
  },
]

function IntegIcon({ item }: { item: Integracao }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- logo de marca externo (Simple Icons/jsDelivr), não otimizável pelo next/image
    <img
      src={`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${item.iconSlug}.svg`}
      alt=""
      width={26}
      height={26}
      loading="lazy"
    />
  )
}

export function SecIntegracoes() {
  const [active, setActive] = useState<Integracao>(INTEGRACOES[0])
  const [paused, setPaused] = useState(false)

  return (
    <section className="services" id="integracoes">
      <div className="wrap">
        <div className="services-head reveal">
          <div>
            <p className="eyebrow">Integrações · 04</p>
            <h2 className="section-title">Conectado ao que a sua<br /><em>operação já usa.</em></h2>
          </div>
          <p className="section-sub">
            A implantação não pede pra você trocar tudo de uma vez. Toque ou passe o mouse em cada ponto para ver como a LogCodex se conecta às ferramentas que já rodam na sua empresa.
          </p>
        </div>

        <div className="integ-layout">
          {/* Wrappers próprios para o reveal, separados dos elementos cuja
              className é recalculada a cada render (paused/active mudando via
              template string). O IntersectionObserver global adiciona `.in`
              direto no DOM (classList.add), fora do controle do React — se
              essa classe estivesse na MESMA tag que o React reconcilia a cada
              hover/clique, o React apagaria o `.in` ao re-renderizar (volta a
              bater com o que o JSX descreve) e a seção sumia para sempre no
              primeiro hover. Isolar o reveal num wrapper que nunca re-renderiza
              (não depende de `paused`/`active`) resolve isso. */}
          <div className="reveal-zoom">
            <div
              className={`integ-ring${paused ? ' paused' : ''}`}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="integ-spin">
                {INTEGRACOES.map((item, i) => {
                  const angle = (360 / INTEGRACOES.length) * i - 90
                  const isActive = active.id === item.id
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`integ-node${isActive ? ' active' : ''}`}
                      style={{
                        '--angle': `${angle}deg`,
                        '--accent': item.accent,
                      } as React.CSSProperties}
                      onMouseEnter={() => setActive(item)}
                      onFocus={() => setActive(item)}
                      onClick={() => setActive(item)}
                    >
                      <span className={`integ-node-counter-spin${paused ? ' paused' : ''}`}>
                        <span className="integ-node-icon">
                          <IntegIcon item={item} />
                        </span>
                        <span className="integ-node-label">{item.label}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="integ-center">
                <LogoMark />
                <span>LogCodex</span>
              </div>
            </div>
          </div>

          <div className="reveal-right">
            <div className="integ-card" style={{ '--accent': active.accent } as React.CSSProperties}>
              <p className="integ-card-cat">{active.category}</p>
              <h3 className="integ-card-title">{active.title}</h3>
              <p className="integ-card-desc">{active.desc}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .integ-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          margin-top: 48px;
        }
        .integ-layout > div { width: 100%; }
        .integ-ring {
          position: relative;
          width: 100%;
          max-width: 520px;
          aspect-ratio: 1;
          margin: 0 auto;
        }
        .integ-ring::before {
          content: '';
          position: absolute;
          inset: 10%;
          border: 1px dashed var(--line);
          border-radius: 50%;
        }
        .integ-spin {
          position: absolute;
          inset: 0;
          animation: integ-rotate 60s linear infinite;
        }
        .integ-ring.paused .integ-spin { animation-play-state: paused; }
        @keyframes integ-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .integ-spin { animation: none; }
        }
        .integ-center {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 30%; height: 30%;
          border-radius: 50%;
          background: var(--bg-2);
          border: 1px solid var(--line-strong);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 6px;
          text-align: center;
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          color: var(--ink-2);
          font-weight: 500;
          z-index: 2;
        }
        /* A logo é o elemento principal do centro; o nome vem abaixo,
           menor, só para ancorar a leitura. */
        .integ-center svg { width: 38px; height: 38px; color: var(--silver); }
        .integ-node {
          position: absolute;
          top: 50%; left: 50%;
          width: 82px; height: 82px;
          margin: -41px 0 0 -41px;
          transform: rotate(var(--angle)) translate(196px) rotate(calc(-1 * var(--angle)));
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-2);
          border: 1px solid var(--line);
          border-radius: 16px;
          cursor: pointer;
          transition: border-color .2s, background .2s, transform .2s;
          font-family: inherit;
          color: var(--ink-3);
        }
        /* .integ-spin gira o anel inteiro (posição dos nós). Cada nó, por sua vez,
           gira o conteúdo (ícone+label) na direção oposta, na MESMA duração —
           cancela a rotação do pai ao longo do tempo, mantendo ícone/texto eretos. */
        .integ-node-counter-spin {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 6px;
          animation: integ-rotate-reverse 60s linear infinite;
        }
        .integ-node-counter-spin.paused { animation-play-state: paused; }
        @keyframes integ-rotate-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .integ-node-counter-spin { animation: none; }
        }
        .integ-node-icon {
          display: flex; align-items: center; justify-content: center;
          width: 26px; height: 26px;
        }
        /* Força os SVGs de marca (fill embutido, cores variadas) para branco puro,
           garantindo contraste no fundo escuro independente da cor original. */
        .integ-node-icon img {
          width: 100%; height: 100%; object-fit: contain; display: block;
          filter: brightness(0) invert(1);
          opacity: 0.82;
          transition: opacity .2s;
        }
        .integ-node:hover .integ-node-icon img,
        .integ-node.active .integ-node-icon img {
          opacity: 1;
        }
        .integ-node-label {
          font-size: 9px;
          letter-spacing: 0.01em;
          text-align: center;
          line-height: 1.15;
          padding: 0 4px;
          color: var(--ink-3);
        }
        .integ-node:hover,
        .integ-node.active {
          border-color: var(--accent);
          background: var(--bg);
          transform: rotate(var(--angle)) translate(196px) rotate(calc(-1 * var(--angle))) scale(1.1);
        }
        .integ-node:hover .integ-node-label, .integ-node.active .integ-node-label {
          color: var(--accent);
        }

        .integ-card {
          background: var(--bg-2);
          border: 1px solid var(--line);
          border-left: 3px solid var(--accent);
          border-radius: 14px;
          padding: 32px;
          min-height: 176px;
          transition: border-color .2s;
        }
        .integ-card-cat {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 14px;
        }
        .integ-card-title {
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -0.015em;
          color: var(--ink);
          margin-bottom: 10px;
          line-height: 1.25;
        }
        .integ-card-desc {
          font-size: 14.5px;
          color: var(--ink-2);
          line-height: 1.6;
          font-weight: 300;
        }

        @media (max-width: 900px) {
          .integ-layout { grid-template-columns: 1fr; gap: 40px; }
          .integ-ring { max-width: 380px; }
          .integ-node { width: 68px; height: 68px; margin: -34px 0 0 -34px; transform: rotate(var(--angle)) translate(152px) rotate(calc(-1 * var(--angle))); }
          .integ-node:hover, .integ-node.active { transform: rotate(var(--angle)) translate(152px) rotate(calc(-1 * var(--angle))) scale(1.1); }
          .integ-node-icon { width: 21px; height: 21px; }
          .integ-node-label { font-size: 7.5px; }
          .integ-center svg { width: 30px; height: 30px; }
          .integ-center { font-size: 9px; gap: 5px; }
        }
        @media (max-width: 480px) {
          .integ-ring { max-width: 300px; }
          .integ-node { width: 56px; height: 56px; margin: -28px 0 0 -28px; transform: rotate(var(--angle)) translate(118px) rotate(calc(-1 * var(--angle))); }
          .integ-node:hover, .integ-node.active { transform: rotate(var(--angle)) translate(118px) rotate(calc(-1 * var(--angle))) scale(1.1); }
          .integ-node-icon { width: 18px; height: 18px; }
          .integ-node-label { display: none; }
          .integ-card { padding: 22px 20px; min-height: 150px; }
          .integ-card-title { font-size: 18px; }
          .integ-card-desc { font-size: 13.5px; }
          .integ-center svg { width: 24px; height: 24px; }
          .integ-center { font-size: 8px; gap: 4px; letter-spacing: 0.04em; }
        }
      `}</style>
    </section>
  )
}
