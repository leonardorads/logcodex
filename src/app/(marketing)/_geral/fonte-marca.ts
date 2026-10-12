import { Quicksand } from 'next/font/google'

// Quicksand: a mais próxima do logotipo oficial "logcodex" (minúsculas,
// arredondada). Mesma escolha da marca da /hospedagem (hospedagem/fontes.ts),
// aqui só com o peso do nome, para a home não baixar o resto.
export const fonteMarca = Quicksand({ subsets: ['latin'], variable: '--font-quicksand', display: 'swap', weight: ['700'] })
