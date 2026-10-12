// Teste da home geral (skill site-entregue-sem-animacao: "meça, não ache").
// Uso: node scripts/testar_home_geral.cjs [url-base] [pasta-prints]
// Padrão: http://localhost:3000 e sem prints. Sai com código 1 se algo falhar.
const { chromium } = require('C:/Users/lantunes/aiprojects/node_modules/playwright-core')

const BASE = process.argv[2] || 'http://localhost:3000'
const PRINTS = process.argv[3] || ''
const CHROME = 'C:/Users/lantunes/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
const resultados = []
const ok = (nome, cond, detalhe = '') => { resultados.push({ nome, ok: !!cond, detalhe }); console.log(`${cond ? 'OK  ' : 'FALHA'} ${nome}${detalhe ? ' — ' + detalhe : ''}`) }
const espera = (ms) => new Promise((r) => setTimeout(r, ms))

async function rolarTudo(p) {
  const h = await p.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < h; y += 400) { await p.evaluate((y) => window.scrollTo(0, y), y); await espera(120) }
  await espera(1500)
}

;(async () => {
  const b = await chromium.launch({ headless: true, executablePath: CHROME })

  // ── Computador, com movimento ───────────────────────────────────────
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })
    const p = await ctx.newPage()
    const erros = []
    p.on('pageerror', (e) => erros.push(String(e)))
    p.on('console', (m) => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) erros.push(m.text()) })
    // Recurso com erro, menos o desafio anti-robô do Turnstile: ele recusa (400) o
    // navegador automático do teste também na /hospedagem, que já está no ar.
    p.on('response', (r) => { if (r.status() >= 400 && !r.url().startsWith('https://challenges.cloudflare.com/')) erros.push(`${r.status()} ${r.url()}`) })
    await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 120000 })

    // Logo: entrada desenha e acende os nós
    const anim = await p.evaluate(() => getComputedStyle(document.querySelector('.hg-nav .hg-logo__no')).animationName)
    ok('logo: os nós entram com animação', anim === 'hg-no', anim)

    // Mesa: anda até o fim sozinha
    const passos = []
    for (let i = 0; i < 24; i++) { passos.push(await p.evaluate(() => Number(document.querySelector('.hg-mesa').dataset.p))); await espera(500) }
    ok('mesa: a cena avança passo a passo', new Set(passos).size >= 8, passos.join(','))
    ok('mesa: termina no quadro final (14)', passos.at(-1) === 14)
    if (PRINTS) await p.locator('.hg-hero').screenshot({ path: `${PRINTS}/teste-topo-final.png` })
    ok('mesa: aparece o botão "Rever" no fim', await p.locator('.hg-mesa .hg-rever').isVisible())
    await p.locator('.hg-mesa .hg-rever').click()
    await espera(600)
    const depois = await p.evaluate(() => Number(document.querySelector('.hg-mesa').dataset.p))
    ok('mesa: "Rever" recomeça a cena', depois < 14, `passo ${depois}`)
    await espera(2600)
    if (PRINTS) await p.locator('.hg-mesa').screenshot({ path: `${PRINTS}/teste-mesa-site.png` })

    // Logo: hover acende os nós (transição) e as letras não piscam ao tirar o mouse
    await p.hover('.hg-nav__marca'); await espera(700)
    const escala = await p.evaluate(() => getComputedStyle(document.querySelector('.hg-nav .hg-logo__ponto')).transform)
    ok('logo: hover faz o sinal percorrer os nós', escala !== 'none', escala)
    await p.mouse.move(700, 500)
    const opac = []
    for (let i = 0; i < 8; i++) { opac.push(await p.evaluate(() => Math.min(...[...document.querySelectorAll('.hg-nav .hg-marca__nome > span')].map((s) => Number(getComputedStyle(s).opacity))))); await espera(60) }
    ok('logo: letras ficam firmes ao tirar o mouse', opac.every((o) => o === 1), opac.join(','))

    // Entrada das seções e ícones desenhados
    const antes = await p.evaluate(() => document.querySelectorAll('.hg [data-rev].in').length)
    await rolarTudo(p)
    const info = await p.evaluate(() => ({
      faltam: document.querySelectorAll('.hg [data-rev]:not(.in)').length,
      total: document.querySelectorAll('.hg [data-rev]').length,
      icones: [...document.querySelectorAll('.hg [data-rev].in .hg-emblema .hg-ic > *')].map((e) => getComputedStyle(e).strokeDashoffset),
      larg: document.documentElement.scrollWidth,
    }))
    ok('entrada: blocos aparecem conforme rola', antes < info.total && info.faltam === 0, `${antes} → ${info.total - info.faltam} de ${info.total}`)
    ok('ícones: todos os emblemas desenhados', info.icones.length > 20 && info.icones.every((v) => parseFloat(v) === 0), `${info.icones.length} traços`)
    ok('sem rolagem para o lado (1440)', info.larg === 1440, String(info.larg))

    // Demonstração do Fleet chega ao fim, com gráfico
    await p.locator('.hg-palco--fleet').scrollIntoViewIfNeeded(); await espera(7500)
    const fleet = await p.evaluate(() => ({ barras: document.querySelectorAll('.hg-grafico__col').length, chip: document.querySelector('.hg-demo__chip').classList.contains('hg-demo__chip--on') }))
    ok('Fleet: resposta com gráfico de 4 meses e selo final', fleet.barras === 4 && fleet.chip, JSON.stringify(fleet))
    if (PRINTS) await p.locator('.hg-palco--fleet').screenshot({ path: `${PRINTS}/teste-fleet-final.png` })

    // FAQ: abre e fecha com altura intermediária
    const d = p.locator('.hg-duvida').first()
    await d.scrollIntoViewIfNeeded(); await espera(400)
    await d.locator('summary').click()
    const abrindo = []
    for (let i = 0; i < 7; i++) { abrindo.push(await d.evaluate((el) => Math.round(el.querySelector('.hg-duvida__corpo').getBoundingClientRect().height))); await espera(60) }
    const meio = abrindo.filter((h) => h > 0 && h < Math.max(...abrindo))
    ok('FAQ: abre animado (altura intermediária)', meio.length >= 2, abrindo.join(' '))
    await espera(300)
    const aberta = await d.evaluate((el) => el.querySelector('.hg-duvida__corpo').getBoundingClientRect().height)
    await d.locator('summary').click(); await espera(110)
    const fechando = await d.evaluate((el) => el.querySelector('.hg-duvida__corpo').getBoundingClientRect().height)
    await espera(400)
    const fechou = await d.evaluate((el) => !el.open)
    ok('FAQ: fecha animado e termina fechada', fechando > 0 && fechando < aberta && fechou, `${Math.round(aberta)} → ${Math.round(fechando)} → fechada=${fechou}`)

    // Menu "Setores"
    await p.evaluate(() => window.scrollTo(0, 0)); await espera(300)
    await p.click('.hg-setores__botao'); await espera(300)
    const setores = await p.evaluate(() => [...document.querySelectorAll('.hg-setores__lista a')].filter((a) => a.offsetParent).map((a) => a.getAttribute('href')))
    ok('menu Setores abre com Logística e Pousadas', setores.join() === '/logistica,/hospedagem', setores.join())
    await p.keyboard.press('Escape'); await espera(200)

    // Agenda abre com os textos da home geral
    await p.click('.hg-hero .hg-btn--primario'); await espera(800)
    const modal = await p.evaluate(() => ({ abriu: !!document.querySelector('.cm--hg .cm-box'), titulo: document.querySelector('.cm--hg .cm-title')?.textContent, campo: document.querySelector('.cm--hg')?.textContent.includes('Seu negócio') }))
    ok('agenda abre com os textos da home', modal.abriu && modal.titulo === 'Fale com um especialista' && modal.campo, JSON.stringify(modal))
    if (PRINTS) await p.screenshot({ path: `${PRINTS}/teste-agenda-desk.png` })
    await p.keyboard.press('Escape'); await espera(300)
    ok('agenda fecha com Esc', !(await p.evaluate(() => !!document.querySelector('.cm--hg'))))

    // Links internos respondem
    const hrefs = await p.evaluate(() => [...new Set([...document.querySelectorAll('.hg a[href]')].map((a) => a.getAttribute('href')))])
    const internos = hrefs.filter((h) => h.startsWith('/'))
    const ancoras = hrefs.filter((h) => h.startsWith('#'))
    const status = []
    for (const h of internos) status.push(`${h} ${(await p.request.get(BASE + h)).status()}`)
    ok('links internos respondem 200', status.every((s) => s.endsWith(' 200')), status.join(' · '))
    const semAlvo = await p.evaluate((as) => as.filter((a) => !document.querySelector(a)), ancoras)
    ok('âncoras levam a uma seção que existe', semAlvo.length === 0, ancoras.join(' '))
    ok('sem erro no console', erros.length === 0, erros.slice(0, 3).join(' | '))
    await ctx.close()
  }

  // ── Celular 390 ─────────────────────────────────────────────────────
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'pt-BR', deviceScaleFactor: 2, hasTouch: true, isMobile: true })
    const p = await ctx.newPage()
    await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 120000 })
    // A barra do topo acompanha a rolagem, e o menu cobre a tela inteira por cima
    // do conteúdo, inclusive depois de rolar (lição de 12/10: abria por baixo).
    await p.evaluate(() => window.scrollTo(0, 1600)); await espera(500)
    const topo = await p.evaluate(() => Math.round(document.querySelector('.hg-nav').getBoundingClientRect().top))
    ok('celular: barra do topo acompanha a rolagem', topo === 0, `top=${topo}`)
    await p.click('.hg-nav__menu'); await espera(400)
    const cobre = await p.evaluate(() => {
      const g = document.getElementById('hg-gaveta').getBoundingClientRect()
      const meio = document.elementFromPoint(195, 600)
      return { altura: Math.round(g.height), porCima: !!meio?.closest('#hg-gaveta') }
    })
    ok('celular: menu cobre a tela, por cima do conteúdo', cobre.altura === 844 && cobre.porCima, JSON.stringify(cobre))
    const gaveta = await p.evaluate(() => ({ visivel: !document.getElementById('hg-gaveta').hidden, links: [...document.querySelectorAll('#hg-gaveta a')].map((a) => a.getAttribute('href')) }))
    ok('celular: menu abre com seções e setores', gaveta.visivel && gaveta.links.includes('/logistica') && gaveta.links.includes('#duvidas'), gaveta.links.join(' '))
    if (PRINTS) await p.screenshot({ path: `${PRINTS}/teste-menu-cel.png` })
    await p.click('.hg-gaveta__fechar'); await espera(300)
    await rolarTudo(p)
    const larg = await p.evaluate(() => document.documentElement.scrollWidth)
    ok('celular: sem rolagem para o lado (390)', larg === 390, String(larg))
    const pequenos = await p.evaluate(() => [...document.querySelectorAll('.hg a, .hg button, .hg summary')].filter((e) => e.offsetParent && !e.closest('.hg-gaveta')).map((e) => e.getBoundingClientRect()).filter((r) => r.height > 0 && r.height < 32).length)
    ok('celular: áreas de toque com 32 px ou mais', pequenos === 0, `${pequenos} pequenas`)
    await ctx.close()
  }

  // ── Reduzir movimento ───────────────────────────────────────────────
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', locale: 'pt-BR' })
    const p = await ctx.newPage()
    await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 120000 })
    await espera(600)
    const r = await p.evaluate(() => ({
      js: document.documentElement.classList.contains('hg-js'),
      escondidos: [...document.querySelectorAll('.hg [data-rev]')].filter((e) => getComputedStyle(e).opacity !== '1').length,
      logo: getComputedStyle(document.querySelector('.hg-nav .hg-logo__no')).animationName,
      mesa: document.querySelector('.hg-mesa').dataset.p,
    }))
    ok('reduzir movimento: nada escondido', !r.js && r.escondidos === 0, `${r.escondidos} escondidos`)
    ok('reduzir movimento: logo parada', r.logo === 'none', r.logo)
    ok('reduzir movimento: mesa já no quadro final', r.mesa === '14', `passo ${r.mesa}`)
    const d = p.locator('.hg-duvida').nth(1)
    await d.locator('summary').click(); await espera(30)
    const h = await d.evaluate((el) => el.open && el.querySelector('.hg-duvida__corpo').getBoundingClientRect().height)
    ok('reduzir movimento: FAQ abre na hora', h > 20, String(h))
    await ctx.close()
  }

  await b.close()
  const falhas = resultados.filter((r) => !r.ok)
  console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações passaram`)
  process.exit(falhas.length ? 1 : 0)
})()
