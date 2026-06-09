import { Hero } from '@/components/sections/Hero'
import { MiniPortfolio } from '@/components/sections/MiniPortfolio'
import { Pain } from '@/components/sections/Pain'
import { Differentials } from '@/components/sections/Differentials'
import { About } from '@/components/sections/About'
import { Services } from '@/components/sections/Services'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing } from '@/components/sections/Pricing'
import { Guarantee } from '@/components/sections/Guarantee'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'

export default function Home() {
  return (
    <main>
      {/* 1. Big promise */}
      <Hero />

      {/* 2. Proof it works — local cases */}
      <MiniPortfolio />

      {/* 3. Emotional resonance — problem */}
      <Pain />

      {/* 4. Our method — how it's different */}
      <Differentials />

      {/* 5. Who we are */}
      <About />

      {/* 6. What we offer */}
      <Services />

      {/* 7. Results */}
      <Testimonials />

      {/* 8. Quick request */}
      <Pricing />

      {/* 9. Risk removal */}
      <Guarantee />

      {/* 10. Questions */}
      <FAQ />

      {/* 11. Final push */}
      <FinalCTA />
    </main>
  )
}
