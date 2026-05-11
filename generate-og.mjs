/**
 * Generates public/og-image.png (1200x630) using sharp.
 * Run once: node generate-og.mjs
 */
import sharp from 'sharp'
import { writeFileSync } from 'fs'

const W = 1200
const H = 630

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Grid pattern -->
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>
    </pattern>
    <!-- Radial glow -->
    <radialGradient id="glow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <!-- Top line gradient -->
    <linearGradient id="topline" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0"/>
      <stop offset="50%" stop-color="#6366f1" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#09090b"/>

  <!-- Grid overlay -->
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <!-- Glow -->
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Top accent line -->
  <rect x="260" y="0" width="680" height="1" fill="url(#topline)"/>

  <!-- Logo box -->
  <rect x="568" y="200" width="64" height="64" rx="14" fill="#6366f1"/>
  <text x="600" y="241" font-family="ui-monospace, monospace" font-size="20" font-weight="700" fill="white" text-anchor="middle">LC</text>

  <!-- Brand name -->
  <text x="${W / 2}" y="310" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700" fill="#f4f4f5" text-anchor="middle" letter-spacing="-1.5">LogCodex</text>

  <!-- Tagline -->
  <text x="${W / 2}" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#a1a1aa" text-anchor="middle">Tecnologia que resolve. Operação que escala.</text>

  <!-- Divider -->
  <line x1="440" y1="415" x2="760" y2="415" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- Domain -->
  <text x="${W / 2}" y="450" font-family="ui-monospace, monospace" font-size="15" font-weight="400" fill="#52525b" text-anchor="middle">logcodex.com.br</text>
</svg>`

const buffer = Buffer.from(svg)

try {
  const png = await sharp(buffer).png({ quality: 95 }).toBuffer()
  writeFileSync('public/og-image.png', png)
  console.log('✓ public/og-image.png gerado (1200x630)')
} catch (err) {
  console.error('Erro ao gerar OG image:', err)
  process.exit(1)
}
