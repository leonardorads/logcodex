// ── Tracking de conversão da landing /lancamento ──
// Fonte única para disparar o evento de lead em todos os provedores ativos.
// Cada disparo é defensivo: só roda se a tag correspondente existir no window.
// Chamado no envio bem-sucedido do formulário (LancamentoLanding).
//
// Provedores:
//   1. GA4 / dataLayer        → event 'lead_lote1' (já marcável como conversão no GA4)
//   2. Meta Pixel             → fbq('track', 'Lead')   [se NEXT_PUBLIC_FB_PIXEL_ID setado]
//   3. Google Ads             → gtag('event','conversion', {send_to})
//                               [se NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL setado]

// Label de conversão do Google Ads no formato "AW-XXXXXXXXX/AbC-D_efGh"
// (criado em Google Ads → Conversões; até existir, o disparo do Ads é no-op).
const GOOGLE_ADS_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL

type GtagFn = (...args: unknown[]) => void
type FbqFn = (...args: unknown[]) => void

export function trackLeadConversion(eventName: string, segmentoHint?: string): void {
  if (typeof window === 'undefined') return

  const w = window as unknown as {
    dataLayer?: unknown[]
    gtag?: GtagFn
    fbq?: FbqFn
  }

  // 1. GA4 / dataLayer — nome do evento é o parâmetro recebido (cada funil
  //    dispara o seu: lead_lote1, lead_diagnostico, lead_agendamento...)
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: eventName, ...(segmentoHint ? { segmento_hint: segmentoHint } : {}) })
  }

  // 2. Meta Pixel — evento padrão 'Lead'
  if (typeof w.fbq === 'function') {
    w.fbq('track', 'Lead', { content_name: eventName, ...(segmentoHint ? { segmento_hint: segmentoHint } : {}) })
  }

  // 3. Google Ads — conversão (precisa do label da ação de conversão)
  if (typeof w.gtag === 'function' && GOOGLE_ADS_CONVERSION_LABEL) {
    w.gtag('event', 'conversion', { send_to: GOOGLE_ADS_CONVERSION_LABEL })
  }
}
