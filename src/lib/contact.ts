export const CONTACT_EMAIL = 'contato@logcodex.com.br'
export const WHATSAPP_NUMBER = '5541999283590'

const wa = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

export const contactHref = {
  general:      wa('Olá! Gostaria de saber mais sobre a LogCodex.'),
  diagnostic:   wa('Olá! Gostaria de fazer um diagnóstico operacional gratuito.'),
  availability: wa('Olá! Gostaria de saber sobre a janela de implantação.'),
  cases:        wa('Olá! Gostaria de ver os cases e projetos da LogCodex.'),
  partnership:  wa('Olá! Gostaria de conversar sobre uma parceria contínua.'),
}
