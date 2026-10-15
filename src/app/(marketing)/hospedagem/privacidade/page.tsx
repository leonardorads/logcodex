import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { classeFontes } from '../fontes'

// Política própria da LogCodex Hospedagem (pedido do Leo, 15/10/2026: a geral falava do Fleet).
// Base: seção de pedidos de prévia aprovada pelo Leo em 15/10 + os itens gerais da política do site
// adaptados ao atendimento de pousadas. A promessa de 30 dias é cumprida pela rotina diária do
// logcodex-wa + montar-fila.sh na VPS (projetos/hermes/docs/frentes/previa-gratis-formulario-plano.md).

export const metadata: Metadata = {
  title: 'Política de Privacidade — LogCodex Hospedagem',
  description: 'Como a LogCodex Hospedagem coleta, usa e protege os dados de quem pede uma prévia ou agenda uma conversa.',
  robots: { index: false, follow: false },
}

const EMAIL = 'leonardo.antunes@logcodex.com'

export default function PrivacidadeHospedagemPage() {
  return (
    <main className={classeFontes} style={pagina}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '88px 24px 80px', lineHeight: 1.7 }}>
        <Link href="/hospedagem" style={{ color: ouro, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          ← LogCodex Hospedagem
        </Link>
        <h1 style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 500, fontSize: 'clamp(30px,5vw,44px)', letterSpacing: '-.02em', margin: '24px 0 8px' }}>
          Política de Privacidade
        </h1>
        <p style={{ color: '#8b93a5', fontSize: '14px', marginBottom: '36px' }}>
          LogCodex Hospedagem · sites para pousadas · última atualização: 15/10/2026
        </p>

        <Secao titulo="1. Quem cuida dos seus dados">
          A <b style={forte}>LogCodex</b> é a controladora dos dados pessoais tratados no atendimento a pousadas e hospedagens,
          nos termos da Lei nº 13.709/2018 (LGPD). Para qualquer assunto sobre privacidade e os seus dados, o contato do nosso
          encarregado é <a href={`mailto:${EMAIL}`} style={link}>{EMAIL}</a>.
        </Secao>

        <Secao titulo="2. O que coletamos">
          <b style={forte}>Pedido de prévia grátis</b> (formulário da página /hospedagem): o nome da hospedagem, a cidade, o
          WhatsApp e, se você informar, um link (site, Instagram ou Booking).
          <br /><br />
          <b style={forte}>Agendamento de conversa</b> (botão “Falar com especialista”): o seu nome, o nome da pousada, o
          WhatsApp, o e-mail, o horário escolhido e, se você quiser, uma mensagem.
          <br /><br />
          <b style={forte}>WhatsApp da LogCodex:</b> as mensagens e as fotos que você enviar.
          <br /><br />
          Também registramos, de forma automática, a <b style={forte}>origem da visita</b> (parâmetros de campanha) quando ela
          vem no link. Não pedimos dados sensíveis nem dados de pagamento nesta etapa.
        </Secao>

        <Secao titulo="3. Para que usamos">
          Para montar uma <b style={forte}>prévia privada do site da sua hospedagem</b> (um vídeo do site no celular), marcar e
          conduzir a conversa que você agendou e falar com você sobre o site. A prévia não é publicada. As suas fotos não são
          usadas em portfólio nem em divulgação sem a sua autorização por escrito. <b style={forte}>Não vendemos nem
          compartilhamos seus dados com terceiros</b> para fins de marketing.
        </Secao>

        <Secao titulo="4. Fotos">
          Guardamos uma cópia nova de cada foto, sem os dados de localização (GPS) e da câmera. Ao marcar a caixa do formulário,
          você declara ser responsável pela hospedagem ou autorizado por ela.
        </Secao>

        <Secao titulo="5. Atendimento com apoio de IA">
          As respostas no WhatsApp são escritas com a ajuda de uma assistente virtual (a Lia) e revisadas pelo Leo antes de
          qualquer envio. Para isso, o texto das mensagens passa por um provedor de inteligência artificial (OpenAI). O Leo
          revisa as conversas pelo Telegram.
        </Secao>

        <Secao titulo="6. Onde os dados ficam">
          Os pedidos e agendamentos ficam no <b style={forte}>Supabase</b>; o horário marcado vira um evento na agenda da
          LogCodex (<b style={forte}>Google Agenda</b>). As mensagens e as fotos do WhatsApp ficam num servidor da LogCodex
          contratado na <b style={forte}>Hostinger</b>. O WhatsApp é operado pela <b style={forte}>Meta</b>. Parte desses
          serviços pode operar em servidores fora do Brasil; nesses casos, a transferência observa as garantias da LGPD. O acesso
          é restrito à LogCodex.
        </Secao>

        <Secao titulo="7. Base legal">
          O seu <b style={forte}>consentimento</b> (art. 7º, I, da LGPD), dado ao marcar a caixa do formulário, e o atendimento
          do seu pedido de prévia ou de conversa (art. 7º, V). Você pode revogar o consentimento a qualquer momento (seção 10).
        </Secao>

        <Secao titulo="8. Por quanto tempo guardamos">
          Se a hospedagem não fechar o site, as fotos, a prévia e o vídeo são apagados em até <b style={forte}>30 dias</b>
          depois da entrega da prévia. O pedido e o agendamento (nome, pousada, cidade, WhatsApp e e-mail) ficam guardados por
          até <b style={forte}>12 meses</b> como histórico de atendimento, ou até você pedir a exclusão. As mensagens que já
          chegaram ao seu WhatsApp ficam no seu aparelho.
        </Secao>

        <Secao titulo="9. Cookies e medição">
          Esta página pode usar cookies e identificadores para medir de onde vêm as visitas e o resultado das campanhas. Esses
          dados são usados de forma agregada e não servem para criar perfis individuais para venda a terceiros.
        </Secao>

        <Secao titulo="10. Seus direitos">
          Responda <b style={forte}>“SAIR”</b> no WhatsApp e não enviamos mais nada. A qualquer momento e sem custo, você pode
          pedir <b style={forte}>acesso, correção, portabilidade ou exclusão</b> dos seus dados, ou revogar o consentimento,
          escrevendo para <a href={`mailto:${EMAIL}`} style={link}>{EMAIL}</a>.
        </Secao>

        <Secao titulo="11. Mudanças nesta política">
          Podemos atualizar esta política para refletir melhorias ou mudanças na lei. A data no topo indica a versão em vigor.
        </Secao>
      </div>
    </main>
  )
}

const ouro = '#e8b46a'
const pagina: CSSProperties = {
  background: '#060912', color: '#eef1f7', minHeight: '100vh',
  fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
}
const link: CSSProperties = { color: ouro, textDecoration: 'underline', textUnderlineOffset: '3px' }
const forte: CSSProperties = { color: '#eef1f7', fontWeight: 600 }

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-.01em', color: '#f0cfa0' }}>{titulo}</h2>
      <p style={{ color: '#c2c9d6', fontSize: '15px' }}>{children}</p>
    </section>
  )
}
