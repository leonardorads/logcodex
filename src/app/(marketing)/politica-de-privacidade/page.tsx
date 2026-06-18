import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade — LogCodex',
  description: 'Como a LogCodex coleta, usa e protege os dados pessoais informados nesta página.',
  robots: { index: false, follow: false },
}

// Stub inicial (Fase 1.7) — texto base, refinável. Destrava o checkbox de
// consentimento da landing /lancamento (LGPD). Estilo dark consistente com o site.
export default function PoliticaPrivacidadePage() {
  return (
    <main style={{ background: '#090b0f', color: '#f1f5f9', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '96px 24px 80px', lineHeight: 1.7 }}>
        <a href="/fleet" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← LogCodex Fleet</a>
        <h1 style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, letterSpacing: '-.02em', margin: '24px 0 8px' }}>Política de Privacidade</h1>
        <p style={{ color: '#475569', fontSize: '14px', marginBottom: '36px' }}>Última atualização: 18/06/2026</p>

        <Section title="1. Quem é o controlador dos dados">
          A <strong style={strong}>LogCodex</strong> é a controladora responsável pelo tratamento dos dados pessoais informados
          nesta página, nos termos da Lei nº 13.709/2018 (LGPD). Para qualquer assunto relativo à privacidade e aos seus dados,
          o contato do nosso encarregado (DPO) é{' '}
          <a href="mailto:leonardo.antunes@logcodex.com" style={link}>leonardo.antunes@logcodex.com</a>.
        </Section>

        <Section title="2. Quais dados coletamos">
          Ao se inscrever no acesso antecipado (Lote 1) do LogCodex Fleet, coletamos os dados que você nos informa:{' '}
          <strong style={strong}>nome</strong>, <strong style={strong}>WhatsApp</strong> e <strong style={strong}>e-mail</strong>,
          além das suas respostas sobre o porte da frota e a forma como você controla a operação hoje. Coletamos também,
          de forma automática, <strong style={strong}>parâmetros de origem da visita</strong> (UTM de campanha) quando presentes
          no link de acesso. Não coletamos dados sensíveis e não solicitamos informações de pagamento nesta etapa.
        </Section>

        <Section title="3. Para que usamos">
          Os dados são usados exclusivamente para: <strong style={strong}>entrar em contato com você sobre o LogCodex Fleet</strong>,
          organizar a fila de acesso do Lote 1, entender o perfil da sua operação para um atendimento adequado e enviar comunicações
          relacionadas ao produto. <strong style={strong}>Não vendemos nem compartilhamos seus dados com terceiros</strong> para
          fins de marketing.
        </Section>

        <Section title="4. Base legal">
          O tratamento se baseia no seu <strong style={strong}>consentimento</strong> (art. 7º, I, da LGPD), manifestado de forma
          livre e informada ao marcar a caixa de aceite no formulário. Você pode revogar esse consentimento a qualquer momento
          (ver seção 7).
        </Section>

        <Section title="5. Onde seus dados ficam armazenados">
          Seus dados são armazenados em ambiente seguro na infraestrutura do <strong style={strong}>Supabase</strong> (banco de
          dados gerenciado), com acesso restrito à equipe da LogCodex. Adotamos medidas técnicas e organizacionais para proteger
          seus dados contra acesso não autorizado, perda ou alteração indevida. Parte da infraestrutura pode operar em servidores
          fora do Brasil; nesses casos, a transferência observa as garantias previstas na LGPD.
        </Section>

        <Section title="6. Cookies e tecnologias de medição">
          Esta página pode utilizar cookies e identificadores para medir o desempenho da campanha e a origem das visitas
          (por exemplo, parâmetros UTM). Esses dados são usados de forma agregada para entender quais canais trazem interessados
          e não são usados para criar perfis individuais para venda a terceiros.
        </Section>

        <Section title="7. Seus direitos">
          Você pode, a qualquer momento e gratuitamente, solicitar <strong style={strong}>acesso, correção, portabilidade ou
          exclusão</strong> dos seus dados, bem como <strong style={strong}>revogar o consentimento</strong>, escrevendo para{' '}
          <a href="mailto:leonardo.antunes@logcodex.com" style={link}>leonardo.antunes@logcodex.com</a>. Atendida a solicitação
          de exclusão, seus dados são removidos definitivamente da nossa base.
        </Section>

        <Section title="8. Retenção">
          Mantemos os dados enquanto durar a relação da campanha de acesso antecipado ou até que você solicite a exclusão, o que
          ocorrer primeiro. Cumpridas essas finalidades, os dados são eliminados de forma segura.
        </Section>

        <Section title="9. Alterações desta política">
          Podemos atualizar esta política para refletir melhorias ou mudanças legais. A data de “última atualização” no topo
          desta página indica a versão vigente. Mudanças relevantes serão comunicadas pelos canais de contato informados.
        </Section>
      </div>
    </main>
  )
}

const link: React.CSSProperties = { color: '#818cf8', textDecoration: 'underline' }
const strong: React.CSSProperties = { color: '#f1f5f9' }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-.01em' }}>{title}</h2>
      <p style={{ color: '#94a3b8', fontSize: '15px' }}>{children}</p>
    </section>
  )
}
