import { Fraunces, Quicksand } from 'next/font/google'

// Fontes da página /hospedagem num módulo próprio: a página (servidor) aplica as
// variáveis no conteúdo, e a landing (cliente) as repassa à janela da agenda,
// que abre num portal no <body> e por isso não herda as variáveis da página.
export const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', weight: ['300', '400', '600'], style: ['normal', 'italic'] })

// Quicksand: a mais próxima do logotipo oficial "logcodex" (minúsculas, arredondada)
export const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand', display: 'swap', weight: ['600', '700'] })

export const classeFontes = `${fraunces.variable} ${quicksand.variable}`
