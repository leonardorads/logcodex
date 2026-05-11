import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://logcodex.com.br'),
  title: 'LogCodex | Automação, IA e Desenvolvimento Digital',
  description:
    'Tecnologia que resolve. Operação que escala. Combinamos estratégia operacional, automação e desenvolvimento digital para empresas que precisam de resultado real.',
  keywords: [
    'automação de processos',
    'integrações com IA',
    'desenvolvimento SaaS',
    'landing pages',
    'dashboards',
    'consultoria tecnológica',
    'LogCodex',
  ],
  authors: [{ name: 'LogCodex', url: 'https://logcodex.com.br' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://logcodex.com.br',
    siteName: 'LogCodex',
    title: 'LogCodex | Automação, IA e Desenvolvimento Digital',
    description:
      'Tecnologia que resolve. Operação que escala. Automação, IA aplicada e desenvolvimento digital orientados a resultado real.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LogCodex — Tecnologia que resolve. Operação que escala.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LogCodex | Automação, IA e Desenvolvimento Digital',
    description: 'Tecnologia que resolve. Operação que escala.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-base text-primary antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
