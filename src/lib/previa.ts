// Pedido de "prévia grátis" (/hospedagem → /api/previa). Compartilhado entre o
// formulário e o servidor para o texto mostrado ser exatamente o texto gravado.

// Texto exato da caixa do formulário. Mudou o texto → nova versão (fica gravado
// em cada pedido, junto com a data).
export const CONSENT_VERSAO = 'v1-2026-10-14'
export const CONSENT_TEXTO =
  'Sou responsável pela pousada (ou autorizado) e quero receber a prévia pelo WhatsApp da LogCodex.'

// WhatsApp oficial da LogCodex (Fluke, Cloud API; atendimento da Lia + fila de aprovação).
export const WHATSAPP_LOGCODEX = '5541936184727'

// Mensagem que a pousada envia. O "[ref: pedido-<código>]" é o que a fila do
// WhatsApp usa para achar o pedido (regex [a-z0-9-] no logcodex-wa).
export function mensagemPedido(codigo: string, pousada: string, cidade: string, link: string | null): string {
  const partes = [`Olá! Quero a prévia grátis do site da ${pousada} (${cidade}).`]
  if (link) partes.push(`Link: ${link}`)
  partes.push(`[ref: pedido-${codigo}]`)
  return partes.join('\n')
}

export function linkWhatsapp(texto: string): string {
  return `https://wa.me/${WHATSAPP_LOGCODEX}?text=${encodeURIComponent(texto)}`
}
