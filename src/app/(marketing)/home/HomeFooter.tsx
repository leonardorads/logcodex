import { LogoMark } from './LogoMark'

export function HomeFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <a href="#" className="brand">
              <LogoMark />
              LogCodex
            </a>
            <p className="ftag">Transformação operacional para logística. Diagnóstico, integração, implantação e suporte — de ponta a ponta.</p>
          </div>
          <div>
            <h5>Solução</h5>
            <ul>
              <li><a href="#diagnostico">Diagnóstico</a></li>
              <li><a href="#metodo">Como entregamos</a></li>
              <li><a href="#incluso">O que está incluso</a></li>
              <li><a href="#capacidades">Capacidades</a></li>
            </ul>
          </div>
          <div>
            <h5>Contato</h5>
            <ul>
              <li><a href="mailto:leonardo.antunes@logcodex.com">leonardo.antunes@logcodex.com</a></li>
              <li><a href="#contato">Falar com especialista</a></li>
              <li><a href="/fleet">Conhecer o Fleet</a></li>
              <li><a href="/politica-de-privacidade">Política de privacidade</a></li>
            </ul>
          </div>
          <div>
            <h5>Critério</h5>
            <p className="ftag" style={{ marginTop: 0 }}>Operação primeiro, tecnologia depois. Cada projeto nasce do diagnóstico, não de um catálogo de módulos.</p>
          </div>
        </div>
        <div className="flegal">
          <span>© 2026 LogCodex · BR</span>
          <span>Diagnóstico · integração · implantação · suporte</span>
          <span>logcodex.com</span>
        </div>
      </div>
    </footer>
  )
}
