// Monograma da LogCodex — "LC" com leitura de IA.
//
// O "L" fica em traço sólido (a base, a operação). O "C" é construído como um
// arco de NÓS CONECTADOS em vez de uma curva contínua: a mesma linguagem de
// rede neural do ícone do Fleet, o que cria família visual entre a marca e o
// produto sem repetir o desenho.
//
// Herda `currentColor` (o CSS `.brand svg` já define cor e tamanho), então o
// mesmo componente serve nav e rodapé sem duplicação — e o nó de destaque usa
// o índigo da home (--accent) como acento fixo.

// Nós do arco em "C": começam no alto à direita, contornam pela esquerda e
// voltam à direita embaixo — a abertura do C fica à direita, como na letra.
// O arco é largo e o miolo fica VAZIO de propósito: nós demais ou linhas
// cruzando o centro fazem o C perder a forma de letra e virar uma mancha.
const C_NODES: [number, number][] = [
  [24.0, 11.0],
  [20.0, 8.6],
  [16.6, 12.0],
  [16.6, 18.0],
  [20.0, 21.4],
  [24.0, 19.0],
]

export const LogoMark = () => (
  <svg viewBox="0 0 32 32" fill="none">
    {/* Moldura do badge, no traço leve original */}
    <rect width="32" height="32" rx="7" fill="none" stroke="currentColor" strokeOpacity="0.45" />

    {/* L — sólido: a base operacional */}
    <path
      d="M9 8.5 V21.5 H13.6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* C — arestas do arco, ligando nó a nó. É o traço que carrega a letra. */}
    <path
      d="M24.0 11.0 L20.0 8.6 L16.6 12.0 L16.6 18.0 L20.0 21.4 L24.0 19.0"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Nós do C — pequenos, só o suficiente para ler como rede.
        O primeiro (ponta superior) recebe o índigo da home como acento. */}
    {C_NODES.map(([cx, cy], i) => (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={i === 0 ? 1.7 : 1.25}
        fill={i === 0 ? 'var(--accent)' : 'currentColor'}
      />
    ))}
  </svg>
)
