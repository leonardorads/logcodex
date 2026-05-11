import Link from 'next/link'
import { Mail } from 'lucide-react'
import { CONTACT_EMAIL, contactHref } from '@/lib/contact'

function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.10)" />
      <path
        d="M9 8.5 V21.5 H15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.5 11.6 A5 5 0 0 0 18.5 11.6 V18.4 A5 5 0 0 0 23.5 18.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9 25 H23.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.28"
      />
      <circle cx="9" cy="25" r="0.9" fill="currentColor" opacity="0.5" />
      <circle cx="23.5" cy="25" r="0.9" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

const navLinks = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Trabalho', href: '#cases' },
  { label: 'Processo', href: '#processo' },
  { label: 'Sobre', href: '#sobre' },
]

const contactLinks = [
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, Icon: Mail },
  { label: 'Solicitar diagnóstico', href: contactHref.diagnostic, Icon: Mail },
]

export function Footer() {
  return (
    <footer className="bg-base border-t border-white/[0.055] pt-16 pb-9">
      <div className="max-w-7xl mx-auto px-6">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-12 mb-14">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 text-primary" aria-label="LogCodex">
              <LogoMark />
              <span className="font-medium text-sm tracking-tight">LogCodex</span>
            </Link>
            <p className="text-[13px] text-muted leading-[1.55] max-w-[32ch] mt-4">
              Engenharia de operação. Em código. Construímos sistemas que não dependem de improviso.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted mb-4 font-medium">
              Navegação
            </h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[13.5px] text-secondary hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted mb-4 font-medium">
              Contato
            </h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-[13.5px] text-secondary hover:text-primary transition-colors"
                    {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.Icon && <link.Icon className="w-3.5 h-3.5 shrink-0" />}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted mb-4 font-medium">
              Critério
            </h4>
            <p className="text-[13.5px] text-secondary leading-[1.6] max-w-[30ch]">
              Diagnóstico antes de escopo. Proposta antes de cobrança. Entrega com 30 dias de acompanhamento.
            </p>
          </div>
        </div>

        {/* Legal row */}
        <div className="pt-6 border-t border-white/[0.055] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-faint">
            © 2026 LogCodex. Curitiba, BR · Operação, automação e desenvolvimento digital.
          </p>
          <p className="font-mono text-[12px] text-faint">logcodex.com.br</p>
        </div>
      </div>
    </footer>
  )
}
