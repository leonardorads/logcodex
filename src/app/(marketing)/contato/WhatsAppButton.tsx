const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

export function WhatsAppButton({ message, label = 'Falar pelo WhatsApp' }: { message: string; label?: string }) {
  if (!WA_NUMBER) return null

  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="cm-wa-btn">
      <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.47 1.65 6.35L3 29l6.85-1.6A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm6.45 18.1c-.27.76-1.58 1.46-2.16 1.52-.55.06-1.07.26-3.6-.75-3.02-1.2-4.96-4.27-5.11-4.47-.15-.2-1.22-1.63-1.22-3.1 0-1.47.77-2.2 1.04-2.5.27-.3.6-.37.8-.37l.57.01c.18 0 .43-.07.67.51l.87 2.1c.07.17.12.37.01.58l-.32.54-.48.5c-.15.15-.32.32-.14.63.18.3.8 1.31 1.72 2.12 1.18 1.05 2.18 1.38 2.49 1.53.3.15.47.13.65-.08l.43-.52c.18-.22.36-.18.6-.11l1.92.9c.22.1.37.15.42.24.05.33-.12 1.35-.39 2.11z" />
      </svg>
      {label}
    </a>
  )
}
