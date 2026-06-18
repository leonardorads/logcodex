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
        <p style={{ color: '#475569', fontSize: '14px', marginBottom: '36px' }}>Última atualização: 17/06/2026</p>

        <Section title="1. Quem é o controlador dos dados">
          A LogCodex é responsável pelo tratamento dos dados pessoais informados nesta página. Contato:{' '}
          <a href="mailto:leonardo.antunes@logcodex.com" style={link}>leonardo.antunes@logcodex.com</a>.
        </Section>

        <Section title="2. Quais dados coletamos">
          Ao se inscrever no acesso antecipado (Lote 1) do LogCodex Fleet, coletamos: <strong style={strong}>nome</strong>,{' '}
          <strong style={strong}>WhatsApp</strong> e <strong style={strong}>e-mail</strong>, além das respostas sobre o porte e a forma
          de controle da sua frota. Também podem ser registrados dados de origem da visita (parâmetros de campanha/UTM).
        </Section>

        <Section title="3. Para que usamos">
          Os dados são usados exclusivamente para: entrar em contato sobre o LogCodex Fleet, organizar a fila de acesso do Lote 1
          e enviar comunicações relacionadas ao produto. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.
        </Section>

        <Section title="4. Base legal">
          O tratamento se baseia no seu <strong style={strong}>consentimento</strong> (art. 7º, I, da Lei nº 13.709/2018 — LGPD),
          manifestado ao marcar a caixa de aceite no formulário.
        </Section>

        <Section title="5. Seus direitos">
          Você pode, a qualquer momento, solicitar acesso, correção ou exclusão dos seus dados, bem como revogar o consentimento,
          escrevendo para <a href="mailto:leonardo.antunes@logcodex.com" style={link}>leonardo.antunes@logcodex.com</a>.
          Atendida a solicitação de exclusão, seus dados são removidos definitivamente da nossa base.
        </Section>

        <Section title="6. Retenção">
          Mantemos os dados enquanto durar a relação da campanha ou até que você solicite a exclusão.
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
