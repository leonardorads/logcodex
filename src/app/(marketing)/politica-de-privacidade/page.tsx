import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Política de Privacidade — LogCodex',
  description: 'Como a LogCodex coleta, usa e protege os dados pessoais de quem fala com a empresa pelo site e pelo WhatsApp.',
  robots: { index: false, follow: false },
}

// Política geral da LogCodex (reescrita em 15/10/2026, pedido do Leo: "precisamos abordar de uma maneira
// geral da empresa"; a versão anterior era o stub do Fleet, Fase 1.7). Vale para a home, /logistica,
// /fleet e /lancamento. A LogCodex Hospedagem tem política própria em /hospedagem/privacidade.
export default function PoliticaPrivacidadePage() {
  return (
    <main style={{ background: '#090b0f', color: '#f1f5f9', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '96px 24px 80px', lineHeight: 1.7 }}>
        <Link href="/" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← LogCodex</Link>
        <h1 style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, letterSpacing: '-.02em', margin: '24px 0 8px' }}>Política de Privacidade</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '36px' }}>Última atualização: 15/10/2026</p>

        <Section title="1. Quem somos">
          A <strong style={strong}>LogCodex</strong> desenvolve sistemas e sites sob medida, como soluções para operações
          logísticas (entre elas o LogCodex Fleet) e sites para pousadas e hospedagens. A LogCodex é a controladora dos dados
          pessoais tratados no site e no atendimento, nos termos da Lei nº 13.709/2018 (LGPD). Para qualquer assunto sobre
          privacidade e os seus dados, o contato do nosso encarregado é{' '}
          <a href={`mailto:${EMAIL}`} style={link}>{EMAIL}</a>.
        </Section>

        <Section title="2. Quais dados coletamos">
          Os que você nos informa nos formulários do site (contato, diagnóstico, agendamento de conversa ou lista de espera de
          um produto): <strong style={strong}>nome</strong>, <strong style={strong}>WhatsApp</strong>,{' '}
          <strong style={strong}>e-mail</strong>, nome da empresa, o horário escolhido e a mensagem que você escrever. Em
          algumas páginas, também pedimos respostas rápidas sobre a sua operação (por exemplo, o tamanho da frota e como você a
          controla hoje). Pelo WhatsApp da LogCodex, recebemos as mensagens que você enviar.
          <br /><br />
          Registramos ainda, de forma automática, a <strong style={strong}>origem da visita</strong> (parâmetros de campanha)
          quando ela vem no link. Não pedimos dados sensíveis nem dados de pagamento nos formulários do site.
        </Section>

        <Section title="3. Para que usamos">
          Para <strong style={strong}>responder ao seu contato</strong>, marcar e conduzir a conversa que você agendou, entender
          a sua necessidade para preparar uma proposta e enviar informações sobre o produto ou serviço que você pediu.{' '}
          <strong style={strong}>Não vendemos nem compartilhamos seus dados com terceiros</strong> para fins de marketing.
        </Section>

        <Section title="4. Atendimento com apoio de IA">
          No WhatsApp oficial da LogCodex, as respostas podem ser escritas com a ajuda de uma assistente virtual e são revisadas
          pelo Leo antes de qualquer envio. Para isso, o texto das mensagens passa por um provedor de inteligência artificial
          (OpenAI).
        </Section>

        <Section title="5. Base legal">
          O seu <strong style={strong}>consentimento</strong> (art. 7º, I, da LGPD), dado ao marcar a caixa do formulário, e o
          atendimento do seu pedido de contato ou de proposta (art. 7º, V). Você pode revogar o consentimento a qualquer
          momento (seção 9).
        </Section>

        <Section title="6. Onde os dados ficam">
          Os contatos dos formulários ficam no <strong style={strong}>Supabase</strong> (banco de dados gerenciado); os horários
          agendados viram eventos na agenda da LogCodex (<strong style={strong}>Google Agenda</strong>); o site é hospedado na{' '}
          <strong style={strong}>Vercel</strong>; as conversas do WhatsApp oficial ficam num servidor da LogCodex contratado na{' '}
          <strong style={strong}>Hostinger</strong>, e o WhatsApp é operado pela <strong style={strong}>Meta</strong>. O acesso
          é restrito à LogCodex. Parte desses serviços pode operar em servidores fora do Brasil; nesses casos, a transferência
          observa as garantias da LGPD.
        </Section>

        <Section title="7. Cookies e medição">
          O site pode usar cookies e identificadores para medir de onde vêm as visitas e o resultado das campanhas. Esses dados
          são usados de forma agregada e não servem para criar perfis individuais para venda a terceiros.
        </Section>

        <Section title="8. Por quanto tempo guardamos">
          Os dados de contato ficam guardados por até <strong style={strong}>12 meses</strong> depois da última conversa, ou até
          você pedir a exclusão, o que acontecer primeiro. Se você se tornar cliente, os dados necessários ao contrato ficam
          guardados enquanto ele durar e pelo prazo exigido por lei.
        </Section>

        <Section title="9. Seus direitos">
          A qualquer momento e sem custo, você pode pedir <strong style={strong}>acesso, correção, portabilidade ou
          exclusão</strong> dos seus dados, ou <strong style={strong}>revogar o consentimento</strong>, escrevendo para{' '}
          <a href={`mailto:${EMAIL}`} style={link}>{EMAIL}</a>. No WhatsApp da LogCodex, basta responder “SAIR” para não
          receber mais mensagens.
        </Section>

        <Section title="10. LogCodex Hospedagem">
          Pedidos de prévia de site, agendamentos pela página /hospedagem e o envio de fotos pelo WhatsApp seguem a{' '}
          <Link href="/hospedagem/privacidade" style={link}>política de privacidade da LogCodex Hospedagem</Link>, que detalha
          como cuidamos das fotos e por quanto tempo as guardamos.
        </Section>

        <Section title="11. Mudanças nesta política">
          Podemos atualizar esta política para refletir melhorias ou mudanças na lei. A data no topo indica a versão em vigor.
        </Section>
      </div>
    </main>
  )
}

const EMAIL = 'leonardo.antunes@logcodex.com'
const link: CSSProperties = { color: '#818cf8', textDecoration: 'underline' }
const strong: CSSProperties = { color: '#f1f5f9' }

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-.01em' }}>{title}</h2>
      <p style={{ color: '#94a3b8', fontSize: '15px' }}>{children}</p>
    </section>
  )
}
