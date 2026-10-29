#!/usr/bin/env node
'use strict';
/* clic-troncature.cjs — preuve que Chromium tronque les coordonnées fractionnaires d'un MouseEvent (clientX 10,7 donne 10).
 * Essai Playwright autonome (page factice, aucune donnée, aucun ESV). Sortie 0 si la troncature est confirmée, 1 sinon. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const p = await b.newPage();
  await p.setContent('<div id="c" style="width:300px;height:300px"></div>');
  const lu = await p.evaluate(() => {
    const out = [], el = document.getElementById('c');
    el.addEventListener('click', e => out.push([e.clientX, e.clientY]));
    for (const [x, y] of [[10.7, 20.2], [10.2, 20.9], [11.5, 21.5], [0.99, 0.01]]) el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }));
    return out;
  });
  await b.close();
  const attendu = [[10, 20], [10, 20], [11, 21], [0, 0]];
  const ok = JSON.stringify(lu) === JSON.stringify(attendu);
  console.log(JSON.stringify({ lu, attendu, tronque: ok, navigateur: 'Chromium de Playwright' }));
  process.exitCode = ok ? 0 : 1;
})();
