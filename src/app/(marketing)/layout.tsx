import Script from 'next/script'
import './marketing.css'

// Widget do Cloudflare Turnstile — carregado uma vez para todo o grupo (marketing).
// Sem este script, o <div class="cf-turnstile"> (ContactModalHome, ContactModal,
// LancamentoLanding) nunca renderiza o desafio e cf-turnstile-response fica vazio.
// TURNSTILE_SECRET_KEY já está provisionada (ver .env.local): sem este script,
// TODO envio de lead nas 3 páginas falha com 422 "Verificação de segurança falhou".
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
      {children}
    </>
  )
}
