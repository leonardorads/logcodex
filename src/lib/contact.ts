export const CONTACT_EMAIL = 'contato@logcodex.com.br'

const mailto = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`

export const contactHref = {
  general: mailto('Contato LogCodex'),
  diagnostic: mailto('Diagnóstico operacional LogCodex'),
  availability: mailto('Janela de implantação LogCodex'),
  cases: mailto('Cases e projetos LogCodex'),
  partnership: mailto('Parceria contínua LogCodex'),
}
