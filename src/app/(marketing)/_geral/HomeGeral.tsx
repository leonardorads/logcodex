/* eslint-disable @next/next/no-img-element -- prints da vitrine: imagens estáticas (next.config: images.unoptimized) */
import { Emblema, Icone } from './Icone'
import { Cubo, MarcaCompleta } from './Marca'
import { fonteMarca } from './fonte-marca'
import { Mesa } from './Mesa'
import { FleetDemo } from './FleetDemo'
import { Duvidas } from './Duvidas'
import { Agenda, BotaoAgenda, Gaveta, MenuSetores, Movimento, NavRolagem, SCRIPT_MOVIMENTO } from './Interativos'
import { COMPROMISSOS, EMAIL, FAQ, LINKS_NAV, LINK_ZAP, PASSOS, SETORES, SOLUCOES } from './dados'

// Home geral da LogCodex: sistemas sob medida para pequenos e médios negócios.
// Roteiro e decisões: docs/briefing-home-geral-2026-10.md e docs/reports/.
// A página é estática (servidor); só as peças com clique ou animação de cena
// são de cliente (Interativos, Mesa, FleetDemo, Duvidas).

function Titulo({ icone, sobre, children, sub }: { icone: Parameters<typeof Emblema>[0]['nome']; sobre: string; children: React.ReactNode; sub?: string }) {
  return (
    <div className="hg-titulo">
      <span data-rev="" className="hg-titulo__emblema"><Emblema nome={icone} /></span>
      <p data-rev="" className="hg-sobre">{sobre}</p>
      <h2 data-rev="">{children}</h2>
      {sub && <p data-rev="" className="hg-titulo__sub">{sub}</p>}
    </div>
  )
}

function JanelaPrint({ src, alt, url }: { src: string; alt: string; url: string }) {
  return (
    <figure className="hg-print">
      <div className="hg-janela__barra">
        <i /><i /><i />
        <span>{url}</span>
      </div>
      <div className="hg-print__tela">
        <img src={src} alt={alt} width={1200} height={2400} loading="lazy" decoding="async" />
      </div>
    </figure>
  )
}

export function HomeGeral() {
  return (
    <div className={`hg ${fonteMarca.variable}`} id="topo">
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_MOVIMENTO }} />
      <div className="hg-fundo" aria-hidden="true">
        <span className="hg-fundo__grade" />
        <span className="hg-fundo__luz hg-fundo__luz--a" />
        <span className="hg-fundo__luz hg-fundo__luz--b" />
      </div>

      <header className="hg-nav">
        <a href="#topo" className="hg-nav__marca" aria-label="LogCodex, voltar ao início">
          <MarcaCompleta />
        </a>
        <nav className="hg-nav__links" aria-label="Seções da página">
          {LINKS_NAV.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <MenuSetores setores={SETORES} />
        </nav>
        <div className="hg-nav__acoes">
          <BotaoAgenda variante="nav" />
          <Gaveta links={LINKS_NAV} setores={SETORES} linkZap={LINK_ZAP} />
        </div>
      </header>
      <NavRolagem />

      <main>
        {/* ── TOPO ─────────────────────────────────────────── */}
        <section className="hg-hero">
          <div className="hg-hero__texto">
            <p data-rev="" className="hg-selo"><span className="hg-selo__ponto" /> LogCodex · sistemas sob medida</p>
            <h1 data-rev="">
              Sistemas <span className="hg-grad">sob medida</span> para o seu negócio.
            </h1>
            <p data-rev="" className="hg-hero__sub">
              Site para ser encontrado, WhatsApp com IA para atender e um sistema para organizar seus clientes.
              Você fala direto com quem constrói e vê uma prévia grátis antes de decidir.
            </p>
            <div data-rev="" className="hg-acoes">
              <BotaoAgenda />
              <a className="hg-btn hg-btn--fantasma" href="#projetos">Ver o que construímos</a>
            </div>
            <p data-rev="" className="hg-hero__zap">
              Prefere WhatsApp?{' '}
              <a href={LINK_ZAP} target="_blank" rel="noopener noreferrer">Chame a gente por lá</a>.
            </p>
            <ul data-rev="" className="hg-hero__provas">
              <li><Icone nome="olho" /> Prévia grátis antes de decidir</li>
              <li><Icone nome="aperto" /> Fala direto com quem constrói</li>
              <li><Icone nome="mapa" /> Atendemos todo o Brasil</li>
            </ul>
          </div>
          <div data-rev="" className="hg-hero__mesa">
            <Mesa />
          </div>
        </section>

        {/* ── O QUE A GENTE CONSTRÓI ───────────────────────── */}
        <section className="hg-secao" id="solucoes">
          <Titulo icone="blocos" sobre="O que a gente constrói" sub="Cada negócio precisa de uma combinação diferente. A gente monta a sua a partir de três frentes.">
            Do primeiro clique <span className="hg-grad">ao cliente organizado.</span>
          </Titulo>
          <div className="hg-solucoes">
            {SOLUCOES.map((s) => (
              <article key={s.n} data-rev="" className={`hg-solucao hg-solucao--${s.cor} hg-luz`}>
                <div className="hg-solucao__topo">
                  <Emblema nome={s.icone} />
                  <span className="hg-solucao__n">{s.n}</span>
                </div>
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
                <ul className="hg-chips">
                  {s.servicos.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ── PROJETOS ─────────────────────────────────────── */}
        <section className="hg-secao" id="projetos">
          <Titulo icone="camadas" sobre="Projetos" sub="Projetos no ar. Cada um diz o que é de verdade.">
            Veja o que <span className="hg-grad">construímos.</span>
          </Titulo>

          <div className="hg-projetos">
            <article className="hg-projeto hg-projeto--largo">
              <div className="hg-projeto__texto hg-projeto__texto--largo" data-rev="">
                <div>
                  <span className="hg-etiqueta hg-etiqueta--uso">Sistema em uso por uma transportadora</span>
                  <h3>Fleet: a frota num sistema só, com assistente</h3>
                </div>
                <div>
                  <p>Viagens, despesas, acertos com motoristas e relatórios no mesmo lugar. Dá para cadastrar pelo menu ou pedir ao assistente com IA, e o relatório sai em PDF num clique.</p>
                  <ul className="hg-chips">
                    <li>Sistema sob medida</li><li>Assistente com IA</li><li>Relatórios</li>
                  </ul>
                  <a className="hg-link-seta" href="/fleet">Conhecer o Fleet <Icone nome="seta" /></a>
                </div>
              </div>
              <div className="hg-palco hg-palco--fleet" data-rev="">
                <FleetDemo />
              </div>
            </article>

            <article className="hg-projeto hg-projeto--inverso">
              <div className="hg-projeto__texto" data-rev="">
                <span className="hg-etiqueta">Página da LogCodex</span>
                <h3>Sites para pousadas</h3>
                <p>A página da nossa frente de hospedagem: simulador de comissões, demonstração de reserva pelo WhatsApp e agenda de conversa com especialista.</p>
                <ul className="hg-chips">
                  <li>Site</li><li>Página de venda</li><li>Agenda online</li>
                </ul>
                <a className="hg-link-seta" href="/hospedagem">Ver a página <Icone nome="seta" /></a>
              </div>
              <div className="hg-palco hg-palco--pousadas" data-rev="">
                <JanelaPrint src="/vitrine/hospedagem.webp" url="logcodex.com.br/hospedagem" alt="Página Sites para pousadas da LogCodex, com o título Mais hóspedes reservando direto com você." />
              </div>
            </article>

            <article className="hg-projeto">
              <div className="hg-projeto__texto" data-rev="">
                <span className="hg-etiqueta">Página da LogCodex</span>
                <h3>Tecnologia para transportadoras</h3>
                <p>A página da nossa frente de logística: diagnóstico da operação, integração com o que a empresa já usa e o assistente do Fleet em ação.</p>
                <ul className="hg-chips">
                  <li>Site</li><li>Diagnóstico</li><li>Integração</li>
                </ul>
                <a className="hg-link-seta" href="/logistica">Ver a página <Icone nome="seta" /></a>
              </div>
              <div className="hg-palco hg-palco--logistica" data-rev="">
                <JanelaPrint src="/vitrine/logistica.webp" url="logcodex.com.br/logistica" alt="Página de logística da LogCodex, com o título Sua operação logística, automatizada." />
              </div>
            </article>
          </div>
        </section>

        {/* ── COMO FUNCIONA ────────────────────────────────── */}
        <section className="hg-secao" id="como">
          <Titulo icone="caneta" sobre="Como funciona">
            Primeiro você vê. <span className="hg-grad">Depois decide.</span>
          </Titulo>
          <ol className="hg-passos">
            {PASSOS.map((p) => (
              <li key={p.n} data-rev="" className="hg-passo hg-luz">
                <div className="hg-passo__topo">
                  <Emblema nome={p.icone} />
                  <span className="hg-passo__n">{p.n}</span>
                </div>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
                {p.extra && (
                  <ul>
                    {p.extra.map((x) => <li key={x}><Icone nome="check" /> {x}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* ── COMPROMISSOS ─────────────────────────────────── */}
        <section className="hg-secao hg-secao--faixa">
          <Titulo icone="escudo" sobre="Como a gente trabalha">
            Quatro compromissos <span className="hg-grad">com você.</span>
          </Titulo>
          <ul className="hg-compromissos">
            {COMPROMISSOS.map((c) => (
              <li key={c.titulo} data-rev="">
                <Emblema nome={c.icone} />
                <h3>{c.titulo}</h3>
                <p>{c.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── SETORES ──────────────────────────────────────── */}
        <section className="hg-secao" id="setores">
          <Titulo icone="bussola" sobre="Setores">
            Tem uma página feita <span className="hg-grad">para o seu setor.</span>
          </Titulo>
          <div className="hg-setores-grade">
            <a className="hg-setor hg-setor--logistica hg-luz" href="/logistica" data-rev="">
              <Emblema nome="caminhao" />
              <span className="hg-setor__texto">
                <b>Logística</b>
                <span>Para transportadoras: diagnóstico da operação, integração e o Fleet.</span>
              </span>
              <Icone nome="setaDiag" className="hg-setor__seta" />
            </a>
            <a className="hg-setor hg-setor--pousadas hg-luz" href="/hospedagem" data-rev="">
              <Emblema nome="cama" />
              <span className="hg-setor__texto">
                <b>Pousadas</b>
                <span>Site à altura da pousada, com reserva direta pelo WhatsApp.</span>
              </span>
              <Icone nome="setaDiag" className="hg-setor__seta" />
            </a>
            <div className="hg-setor hg-setor--outro hg-luz" data-rev="">
              <Emblema nome="brilho" />
              <span className="hg-setor__texto">
                <b>Outro setor?</b>
                <span>Clínica, loja, escritório, salão… A gente desenha o sistema do seu negócio.</span>
              </span>
              <BotaoAgenda variante="claro">Conversar</BotaoAgenda>
            </div>
          </div>
        </section>

        {/* ── DÚVIDAS ──────────────────────────────────────── */}
        <section className="hg-secao hg-secao--estreita" id="duvidas">
          <Titulo icone="conversa" sobre="Dúvidas">
            Perguntas que <span className="hg-grad">sempre aparecem.</span>
          </Titulo>
          <Duvidas itens={FAQ} />
        </section>

        {/* ── FECHAMENTO ───────────────────────────────────── */}
        <section className="hg-fecho">
          <div className="hg-fecho__palco">
            <span data-rev="" className="hg-fecho__logo"><Cubo className="hg-cubo--grande" /></span>
            <h2 data-rev="">Vamos desenhar o sistema <span className="hg-grad">do seu negócio?</span></h2>
            <p data-rev="">Conte o que você precisa numa conversa rápida. A prévia é grátis e você só decide depois de ver.</p>
            <div data-rev="" className="hg-acoes hg-acoes--centro">
              <BotaoAgenda />
              <a className="hg-link-zap" href={LINK_ZAP} target="_blank" rel="noopener noreferrer">
                <Icone nome="conversa" /> Conversar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="hg-rodape">
        <div className="hg-rodape__grade">
          <div className="hg-rodape__marca">
            <MarcaCompleta animar={false} />
            <p>Sistemas sob medida para pequenos e médios negócios. Atendemos todo o Brasil.</p>
          </div>
          <div>
            <h4>Página</h4>
            {LINKS_NAV.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <div>
            <h4>Setores</h4>
            {SETORES.map((s) => <a key={s.href} href={s.href}>{s.label}</a>)}
            <a href="/fleet">Fleet</a>
          </div>
          <div>
            <h4>Contato</h4>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={LINK_ZAP} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="/politica-de-privacidade">Política de privacidade</a>
          </div>
        </div>
        <div className="hg-rodape__legal">
          <span>© 2026 LogCodex</span>
          <span>logcodex.com.br</span>
        </div>
      </footer>

      <a className="hg-zap-fixo" href={LINK_ZAP} target="_blank" rel="noopener noreferrer" aria-label="Conversar no WhatsApp">
        <Icone nome="conversa" />
      </a>

      <Agenda />
      <Movimento />
    </div>
  )
}
