'use client'

import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { bp } from '@/lib/basePath'

const stack = [
  'Next.js', 'TypeScript', 'Postgres', 'Supabase', 'Stripe',
  'Claude API', 'GPT-4o', 'n8n', 'Vercel', 'Tailwind', 'Resend', 'Sanity',
]

const credentials = [
  { label: 'CMG · Global Talents Program', sub: 'Shenzhen, China · 2025', dotClass: 'bg-accent' },
  { label: 'Huawei HQ',  sub: 'Shenzhen · China', dotClass: 'bg-[#ee0000]' },
  { label: 'Tencent HQ', sub: 'Shenzhen · China', dotClass: 'bg-[#07c160]' },
]

function PhotoMosaic() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

      {/* Main: CMG Shenzhen */}
      <div className="relative sm:col-span-2 rounded-2xl overflow-hidden border border-white/[0.07] aspect-[4/3]">
        <Image
          src={`${bp}/images/leonardo-cmg-china-visit.jpg`}
          alt="Leonardo Antunes na CMG em Shenzhen, China"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[18%_55%]"
        />

        {/* Location chip */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#08080a]/85 backdrop-blur-sm border border-white/[0.15] rounded-full px-2.5 py-1.5">
          <MapPin className="w-3 h-3 text-accent shrink-0" strokeWidth={2} />
          <span className="font-mono text-[11px] text-white font-medium">Shenzhen · China</span>
        </div>

        <div className="absolute top-3 right-3 bg-[#08080a]/85 backdrop-blur-sm border border-white/[0.15] rounded-full px-2.5 py-1.5">
          <span className="font-mono text-[11px] text-white/90">CMG · 2025</span>
        </div>

        {/* Bottom identity — pill on dark strip */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 about-photo-strip-main">
          <div className="inline-flex items-center gap-1.5 bg-white/[0.08] border border-white/[0.12] rounded-full px-2.5 py-1 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <span className="font-mono text-[10.5px] text-white uppercase tracking-[0.09em]">10 anos · Logística &amp; Setor Privado</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-[17px] font-medium tracking-[-0.018em] text-white">Leonardo Antunes</p>
            <p className="text-[12px] text-white/60">Fundador · LogCodex</p>
          </div>
        </div>
      </div>

      {/* Huawei */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.07] aspect-[4/3]">
        <Image
          src={`${bp}/images/leonardo-huawei.jpeg`}
          alt="Leonardo Antunes na Huawei em Shenzhen"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[center_58%]"
        />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 about-photo-strip">
          <p className="font-mono text-[11px] font-semibold tracking-[0.02em] text-[#ff5555]">Huawei HQ</p>
          <p className="text-[11px] text-white/70 mt-0.5">Shenzhen · China</p>
        </div>
      </div>

      {/* Tencent */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.07] aspect-[4/3]">
        <Image
          src={`${bp}/images/leonardo-tencent.jpeg`}
          alt="Leonardo Antunes na Tencent em Shenzhen"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[center_25%]"
        />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 about-photo-strip">
          <p className="font-mono text-[11px] font-semibold tracking-[0.02em] text-[#07c160]">Tencent HQ</p>
          <p className="text-[11px] text-white/70 mt-0.5">Shenzhen · China</p>
        </div>
      </div>

    </div>
  )
}

export function About() {
  return (
    <section id="sobre" className="py-24 bg-base">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — photo mosaic */}
          <AnimatedSection>
            <PhotoMosaic />
          </AnimatedSection>

          {/* Right — text */}
          <AnimatedSection delay={0.15}>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-5">
              [ 03 ] Sobre
            </p>
            <h2 className="text-[clamp(28px,3.2vw,42px)] font-medium leading-[1.05] tracking-[-0.028em] text-primary mb-7">
              Operação primeiro.
              <br />
              <span className="text-muted font-normal">Código depois.</span>
            </h2>

            <div className="space-y-4 text-[15px] text-secondary leading-[1.7]">
              <p>
                A LogCodex nasce de 10 anos lidando com operação real: logística portuária,
                setor privado, rotina crítica, processo quebrando no detalhe. Tecnologia aqui
                não é enfeite. É estrutura para reduzir ruído, retrabalho e dependência do dono.
              </p>
              <p>
                Em 2025, participei do{' '}
                <strong className="text-primary font-medium">Programa Global Talents da CMG</strong>{' '}
                em <strong className="text-primary font-medium">Shenzhen, China</strong>. Também visitei a{' '}
                <strong className="text-primary font-medium">sede da Huawei</strong> e a{' '}
                <strong className="text-primary font-medium">sede da Tencent</strong>: empresas onde tecnologia,
                processo e escala não são discurso, são disciplina operacional.
              </p>
              <p>
                Esse olhar é o que trazemos para negócios locais: site que captura demanda,
                automação que responde no tempo certo e sistemas simples o suficiente para
                virarem rotina. Sem template inflado. Sem ferramenta procurando problema.
              </p>
            </div>

            {/* Quote callout */}
            <div className="my-7 relative pl-5 border-l-2 border-accent">
              <p className="text-[18px] font-medium text-primary tracking-[-0.015em] leading-[1.35] italic">
                &ldquo;Time is money, efficient is life!&rdquo;
              </p>
              <span className="font-mono text-[11px] text-muted mt-1.5 block">
                — Lema aprendido em Shenzhen, China
              </span>
            </div>

            {/* Credential chips */}
            <div className="mt-7 space-y-2">
              {credentials.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl border border-white/[0.055] bg-white/[0.015]"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${c.dotClass}`} />
                  <div>
                    <span className="text-[13.5px] font-medium text-primary">{c.label}</span>
                    <span className="font-mono text-[11px] text-muted ml-2">{c.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stack */}
            <div className="mt-8 pt-7 border-t border-white/[0.055]">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted mb-3">
                Ferramentas quando fazem sentido
              </p>
              <div className="flex flex-wrap gap-1.5">
                {stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[11px] text-secondary border border-white/[0.055] bg-white/[0.012] px-2.5 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  )
}
