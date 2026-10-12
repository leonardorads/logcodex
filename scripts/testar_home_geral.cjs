// Teste da home geral (skill site-entregue-sem-animacao: "meça, não ache").
// Uso: node scripts/testar_home_geral.cjs [url-base] [pasta-prints]
// Padrão: http://localhost:3000 e sem prints. Sai com código 1 se algo falhar.
// v2 (12/10/2026): logo do cubo, cenas em looping (sem "Rever"), ícones vivos,
// cartões fluidos e a demonstração nova do Fleet. Leva uns 3 minutos: as cenas
// são longas e o teste espera cada uma acontecer de verdade.
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

    // Logo (cubo da /hospedagem): as peças entram com animação
    const anim = await p.evaluate(() => getComputedStyle(document.querySelector('.hg-nav .hg-cubo__peca')).animationName)
    ok('logo: o cubo monta peça por peça', anim === 'hg-peca', anim)

    // Cena do topo: anda sozinha, chega ao fim e recomeça (looping, sem "Rever")
    const passos = []
    let ia = null
    for (let i = 0; i < 70; i++) {
      const e = await p.evaluate(() => ({
        p: Number(document.querySelector('.hg-mesa').dataset.p),
        respostas: document.querySelectorAll('.hg-wa-in .hg-wa-bolha:not(.hg-wa-digitando)').length,
        selos: document.querySelectorAll('.hg-wa-in .hg-wa-bolha:not(.hg-wa-digitando) .hg-wa-ia').length,
      }))
      passos.push(e.p)
      if (e.p >= 17 && e.p <= 19 && !ia) ia = { respostas: e.respostas, selos: e.selos }
      await espera(500)
    }
    const fim = passos.indexOf(27)
    ok('cena: avança passo a passo', new Set(passos).size >= 20, `${new Set(passos).size} passos diferentes`)
    ok('cena: chega à ficha da cliente (27)', fim >= 0)
    ok('cena: recomeça sozinha depois do fim', fim >= 0 && passos.slice(fim).some((x) => x < 5), passos.slice(-12).join(','))
    ok('cena: sem botão "Rever"', (await p.locator('.hg-rever').count()) === 0)
    ok('cena: cada resposta do WhatsApp leva o selo "IA"', !!ia && ia.respostas >= 3 && ia.respostas === ia.selos, JSON.stringify(ia))
    if (PRINTS) await p.locator('.hg-hero').screenshot({ path: `${PRINTS}/teste-topo.png` })

    // Logo: hover separa as faces (transição) e as letras não piscam ao tirar o mouse
    await p.hover('.hg-nav__marca'); await espera(700)
    const face = await p.evaluate(() => getComputedStyle(document.querySelector('.hg-nav .hg-cubo__peca--f2 .hg-cubo__face')).transform)
    ok('logo: hover faz o cubo "respirar"', face !== 'none', face)
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
    // (o "check" do escudo se redesenha de tempos em tempos: um traço pode estar no meio)
    ok('ícones: todos os emblemas desenhados', info.icones.length > 20 && info.icones.filter((v) => parseFloat(v) < 0.99).length >= info.icones.length - 1, `${info.icones.length} traços`)
    const vivos = await p.evaluate(() => [...document.querySelectorAll('.hg-emblema .hg-ic, .hg-emblema .hg-ic > *')].filter((e) => getComputedStyle(e).animationName.startsWith('hg-a-')).length)
    ok('ícones: cada emblema tem um gesto próprio', vivos >= 20, `${vivos} animados`)
    ok('sem rolagem para o lado (1440)', info.larg === 1440, String(info.larg))

    // Cartões fluidos: o hover sobe o cartão e acende a luz que segue o mouse
    const card = p.locator('.hg-solucao--verde')
    await card.scrollIntoViewIfNeeded(); await espera(300)
    const bb = await card.boundingBox()
    await p.mouse.move(bb.x + bb.width * 0.7, bb.y + bb.height * 0.4, { steps: 6 }); await espera(800)
    const fluido = await card.evaluate((el) => ({ t: getComputedStyle(el).transform, luz: getComputedStyle(el).getPropertyValue('--hg-luz').trim(), mx: el.style.getPropertyValue('--mx') }))
    ok('cartões: hover sobe e a luz segue o mouse', fluido.t !== 'none' && fluido.luz === '1' && fluido.mx !== '', JSON.stringify(fluido))
    await p.mouse.move(10, 10)
    // fluido = a subida passa por posições intermediárias (antes, a regra de entrada
    // apagava a transição e o cartão pulava de 0 para -6 px)
    await espera(900)
    const passo = p.locator('.hg-passo').nth(1)
    await passo.scrollIntoViewIfNeeded(); await espera(300)
    const pb = await passo.boundingBox()
    await p.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2)
    const subida = []
    for (let i = 0; i < 8; i++) { subida.push(await passo.evaluate((el) => Math.round(new DOMMatrix(getComputedStyle(el).transform).m42 * 10) / 10)); await espera(50) }
    ok('cartões: a subida é suave (passa por posições intermediárias)', subida.filter((y) => y < 0 && y > -6).length >= 2, subida.join(' '))
    await p.mouse.move(10, 10)

    // Fleet: menu → cadastro manual → a IA cadastra a planilha → relatório em PDF
    await p.locator('.fd').scrollIntoViewIfNeeded()
    const vistos = {}
    for (let i = 0; i < 110; i++) {
      const e = await p.evaluate(() => ({
        p: Number(document.querySelector('.fd').dataset.p),
        linhas: document.querySelectorAll('.fd-mot .fd-tr:not(.fd-tr--cab)').length,
        dialogo: !!document.querySelector('.fd-dialogo'),
        sucesso: !!document.querySelector('.fd-sucesso'),
        pdf: document.querySelector('.fd-pdf').classList.contains('fd-pdf--on'),
        baixado: document.querySelector('.fd-baixado').classList.contains('fd-baixado--on'),
      }))
      if (e.dialogo) vistos.dialogo = true
      if (e.p >= 13 && e.p < 27 && e.linhas === 6) vistos.manual = true
      if (e.sucesso && e.linhas === 9) vistos.ia = true
      if (e.pdf) vistos.pdf = true
      if (e.baixado) vistos.baixado = true
      if (e.p >= 39 && PRINTS && !vistos.print) { vistos.print = true; await p.locator('.hg-palco--fleet').screenshot({ path: `${PRINTS}/teste-fleet-pdf.png` }) }
      if (vistos.baixado && vistos.ia && vistos.manual) break
      await espera(500)
    }
    ok('Fleet: abre "Novo Motorista" e o cadastro entra na lista (6)', vistos.dialogo && vistos.manual, JSON.stringify(vistos))
    ok('Fleet: o assistente cadastra os 3 da planilha (9)', !!vistos.ia)
    ok('Fleet: o relatório vira PDF e baixa', vistos.pdf && vistos.baixado)
    const logo = await p.evaluate(() => document.querySelector('.fd-menu .fd-logo__aqui')?.textContent)
    ok('Fleet: menu com logo fictícia e "[sua logo aqui]"', logo === '[sua logo aqui]', String(logo))

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
    await d.locator('summary').click(); await espera(600)
    await p.locator('.hg-duvida').nth(2).locator('summary').click(); await espera(600)
    const abertas = await p.evaluate(() => [...document.querySelectorAll('.hg-duvida')].map((x, i) => (x.open ? i : -1)).filter((i) => i >= 0))
    ok('FAQ: abre uma por vez (abrir outra fecha a anterior)', abertas.join() === '2', `abertas: ${abertas.join() || 'nenhuma'}`)

    // "Início" no topo e o link da seção atual aceso
    await p.evaluate(() => window.scrollTo(0, 0)); await espera(500)
    const inicio = await p.evaluate(() => { const a = document.querySelector('.hg-nav__links a[href="#topo"]'); return { existe: !!a, texto: a?.textContent, aceso: a?.getAttribute('aria-current') } })
    ok('topo: botão "Início" no cabeçalho, aceso no começo da página', inicio.existe && inicio.texto === 'Início' && inicio.aceso === 'true', JSON.stringify(inicio))
    await p.evaluate(() => document.querySelector('#como').scrollIntoView()); await espera(1500)
    const aceso = await p.evaluate(() => document.querySelector('.hg-nav__links a[aria-current="true"]')?.getAttribute('href'))
    ok('topo: o link da seção em que a pessoa está fica aceso', aceso === '#como', String(aceso))

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
    const caixa = await p.evaluate(() => ({ larg: Math.round(document.querySelector('.cm--hg .cm-box').getBoundingClientRect().width), colunas: getComputedStyle(document.querySelector('.cm--hg .cm-form')).gridTemplateColumns.split(' ').length }))
    ok('agenda: no computador, calendário e dados lado a lado (como na /hospedagem)', caixa.larg >= 800 && caixa.colunas === 2, JSON.stringify(caixa))
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
    await p.evaluate(() => window.scrollTo(0, 0)); await espera(300)
    await p.click('.hg-hero .hg-btn--primario'); await espera(900)
    const folha = await p.evaluate(() => { const r = document.querySelector('.cm--hg .cm-box').getBoundingClientRect(); return { larg: Math.round(r.width), fundo: Math.round(r.bottom), alt: window.innerHeight, pagina: document.documentElement.scrollWidth } })
    ok('celular: agenda abre como folha de baixo, na largura da tela', folha.larg === 390 && folha.fundo === folha.alt && folha.pagina === 390, JSON.stringify(folha))
    if (PRINTS) await p.screenshot({ path: `${PRINTS}/teste-agenda-cel.png` })
    await p.keyboard.press('Escape'); await espera(300)
    const modos = await p.evaluate(() => ({ mesa: document.querySelector('.hg-mesa').dataset.modo, fleet: document.querySelector('.fd').dataset.modo }))
    ok('celular: as cenas usam o desenho de celular', modos.mesa === 'cel' && modos.fleet === 'cel', JSON.stringify(modos))
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
    await p.locator('.fd').scrollIntoViewIfNeeded(); await espera(600)
    const r = await p.evaluate(() => ({
      js: document.documentElement.classList.contains('hg-js'),
      escondidos: [...document.querySelectorAll('.hg [data-rev]')].filter((e) => getComputedStyle(e).opacity !== '1').length,
      logo: getComputedStyle(document.querySelector('.hg-nav .hg-cubo__peca')).animationName,
      mesa: document.querySelector('.hg-mesa').dataset.p,
      fleet: document.querySelector('.fd').dataset.p,
    }))
    ok('reduzir movimento: nada escondido', !r.js && r.escondidos === 0, `${r.escondidos} escondidos`)
    ok('reduzir movimento: logo parada', r.logo === 'none', r.logo)
    ok('reduzir movimento: cenas paradas no quadro que explica', r.mesa === '27' && r.fleet === '39', `topo ${r.mesa}, Fleet ${r.fleet}`)
    if (PRINTS) await p.locator('.hg-palco--fleet').screenshot({ path: `${PRINTS}/teste-fleet-reduzido.png` })
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
