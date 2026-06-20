import Script from 'next/script'

// ── Pixels de marketing (Meta + Google Ads) ──
// Mesmo padrão do GA4 no layout: next/script com strategy="afterInteractive"
// (recomendado pelo doc do Next 16 para tags de marketing/analytics).
// Cada pixel só é injetado se a env correspondente existir — sem ID configurado,
// nada carrega, então não há risco para produção enquanto as contas não existem.
//
// Envs (todas NEXT_PUBLIC_, pois rodam no browser):
//   NEXT_PUBLIC_FB_PIXEL_ID        → Meta Pixel (ex: 1234567890)
//   NEXT_PUBLIC_GOOGLE_ADS_ID      → Google Ads tag (ex: AW-123456789)
//
// Os disparos de conversão (Lead) ficam em src/lib/track.ts, chamados no envio
// do formulário da /lancamento — aqui só inicializamos as tags.

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

export function MarketingPixels() {
  return (
    <>
      {FB_PIXEL_ID && (
        <>
          <Script id="fb-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              alt=""
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {GOOGLE_ADS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`}
          </Script>
        </>
      )}
    </>
  )
}
