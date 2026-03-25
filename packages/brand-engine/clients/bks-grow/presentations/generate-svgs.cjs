const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'carousel-svg');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

const W = 1080, H = 1350;
const GREEN = '#84CC16';
const GREEN_LIGHT = '#A3E635';
const BG = '#0A0A0A';
const SURFACE = '#1A1A1A';
const MUTED = '#A1A1AA';
const WHITE = '#FFFFFF';
const RED = '#EF4444';

// Helper: rounded rect
function rect(x,y,w,h,r,fill,stroke='none',sw=1,opacity=1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}"/>`;
}
function text(x,y,content,size,weight,fill,anchor='start',opacity=1) {
  return `<text x="${x}" y="${y}" font-family="Inter, Helvetica Neue, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}">${content}</text>`;
}
function wrap(x,y,lines,size,weight,fill,lineH=1.4) {
  return lines.map((l,i)=>text(x, y + i*size*lineH, l, size, weight, fill)).join('\n');
}

const slides = [];

// ─── SLIDE 1 — COVER ───────────────────────────────────────────────
slides.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="leftLine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${GREEN}"/>
      <stop offset="100%" stop-color="${GREEN}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0D0D0D"/>
      <stop offset="100%" stop-color="${BG}"/>
    </linearGradient>
  </defs>
  ${rect(0,0,W,H,0,'url(#bgGrad)')}
  <!-- Left accent line -->
  ${rect(0,0,4,H,0,'url(#leftLine)')}
  <!-- BG word faded -->
  <text x="-20" y="${H-20}" font-family="Inter, Arial, sans-serif" font-size="320" font-weight="900" fill="${GREEN}" opacity="0.04" letter-spacing="-16">SORTE</text>
  <!-- Top tag -->
  ${text(64, 96, 'Marketing Digital · BKS Grow', 12, 700, GREEN)}
  <!-- Overline -->
  ${text(64, 580, 'O erro que todo dono de negócio comete', 15, 500, MUTED)}
  <!-- Main title -->
  ${text(64, 660, 'Depender de', 76, 900, WHITE)}
  ${text(64, 750, 'indicação não', 76, 900, WHITE)}
  ${text(64, 840, 'é estratégia.', 76, 900, WHITE)}
  ${text(64, 930, 'É sorte.', 76, 900, GREEN)}
  <!-- Subtitle -->
  ${text(64, 1010, 'E negócio não pode depender', 22, 400, MUTED)}
  ${text(64, 1042, 'de sorte para crescer.', 22, 600, WHITE)}
  <!-- Swipe hint -->
  ${text(64, 1270, 'Arraste para continuar  →', 12, 500, WHITE, 'start', 0.3)}
  <!-- Slide num -->
  ${text(W-64, 96, '01 / 06', 11, 600, WHITE, 'end', 0.2)}
  <!-- Logo -->
  ${text(W-64, H-44, 'bksgrow.com.br', 11, 700, GREEN, 'end', 0.5)}
</svg>`);

// ─── SLIDE 2 — O PROBLEMA ──────────────────────────────────────────
function painCard(y, icon, label, desc, iconBg='rgba(239,68,68,0.1)', iconBorder='rgba(239,68,68,0.25)') {
  return `
  ${rect(64, y, W-128, 140, 16, SURFACE, 'rgba(239,68,68,0.25)', 1)}
  <!-- icon circle -->
  <rect x="96" y="${y+50}" width="44" height="44" rx="10" fill="${iconBg}" stroke="${iconBorder}" stroke-width="1"/>
  <text x="118" y="${y+79}" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif" font-size="20" text-anchor="middle">${icon}</text>
  <!-- label -->
  ${text(160, y+72, label, 15, 700, WHITE)}
  ${text(160, y+94, desc, 12, 400, MUTED)}`;
}

slides.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${rect(0,0,W,H,0,BG)}
  ${text(64, 96, 'O PROBLEMA', 11, 700, GREEN)}
  ${text(64, 160, 'Você reconhece', 50, 800, WHITE)}
  ${text(64, 220, 'algum desses', 50, 800, WHITE)}
  ${text(64, 280, 'cenários?', 50, 800, GREEN)}
  ${painCard(360, '📉', 'Mês bom, mês ruim — sem previsibilidade', 'O faturamento oscila. Quando indicações param, a receita some.')}
  ${painCard(524, '📲', 'Posta nas redes, mas ninguém compra', 'Investe tempo em conteúdo, acumula likes, não converte em clientes.')}
  ${painCard(688, '🔄', 'Depende das mesmas pessoas de sempre', 'Os mesmos 5 clientes indicando os mesmos perfis. Zero crescimento.')}
  ${text(64, 900, 'Se você se identificou com pelo menos 1 desses...', 16, 500, MUTED)}
  ${text(64, 928, 'o próximo slide é para você.', 16, 700, WHITE)}
  ${text(W-64, 96, '02 / 06', 11, 600, WHITE, 'end', 0.2)}
  ${text(W-64, H-44, 'bksgrow.com.br', 11, 700, GREEN, 'end', 0.5)}
</svg>`);

// ─── SLIDE 3 — OS DADOS ────────────────────────────────────────────
slides.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${rect(0,0,W,H,0,BG)}
  ${text(64, 96, 'A REALIDADE', 11, 700, GREEN)}
  ${text(64, 160, 'Os números', 50, 800, WHITE)}
  ${text(64, 220, 'não mentem', 50, 800, GREEN)}

  <!-- Stat 1 -->
  ${rect(64, 300, 464, 260, 20, SURFACE, GREEN, 1)}
  <rect x="64" y="300" width="464" height="260" rx="20" fill="none" stroke="${GREEN}" stroke-width="1" opacity="0.3"/>
  <text x="96" y="420" font-family="Inter, Arial, sans-serif" font-size="80" font-weight="900" fill="${GREEN}">73%</text>
  ${text(96, 456, 'das PMEs fecham em 5 anos', 15, 600, WHITE)}
  ${text(96, 480, 'Por falta de aquisição consistente', 12, 400, MUTED)}
  ${text(96, 498, 'de novos clientes', 12, 400, MUTED)}

  <!-- Stat 2 -->
  ${rect(576, 300, 440, 260, 20, SURFACE, 'rgba(255,255,255,0.07)', 1)}
  <text x="608" y="420" font-family="Inter, Arial, sans-serif" font-size="80" font-weight="900" fill="${GREEN_LIGHT}">8×</text>
  ${text(608, 456, 'mais barato reter', 15, 600, WHITE)}
  ${text(608, 480, 'Mas você precisa ter', 12, 400, MUTED)}
  ${text(608, 498, 'clientes para reter', 12, 400, MUTED)}

  <!-- Stat full width -->
  ${rect(64, 596, 952, 220, 20, SURFACE, 'rgba(255,255,255,0.07)', 1)}
  <text x="96" y="700" font-family="Inter, Arial, sans-serif" font-size="60" font-weight="900" fill="${GREEN_LIGHT}">R$ 0</text>
  ${text(96, 740, 'de faturamento previsível sem sistema de aquisição', 15, 600, WHITE)}
  ${text(96, 766, 'Indicação é canal passivo. Negócio saudável precisa de canal ativo, escalável', 13, 400, MUTED)}
  ${text(96, 786, 'e mensurável.', 13, 400, MUTED)}

  <!-- Quote -->
  ${rect(64, 856, 952, 100, 16, 'rgba(132,204,22,0.06)', GREEN, 1, 0.3)}
  ${text(96, 912, '"Quem não tem sistema de aquisição, tem reza. E reza não paga boleto."', 16, 600, WHITE)}

  ${text(W-64, 96, '03 / 06', 11, 600, WHITE, 'end', 0.2)}
  ${text(W-64, H-44, 'bksgrow.com.br', 11, 700, GREEN, 'end', 0.5)}
</svg>`);

// ─── SLIDE 4 — A VIRADA (VS) ───────────────────────────────────────
function vsItem(x, y, w, txt, type) {
  const border = type === 'bad' ? 'rgba(239,68,68,0.2)' : 'rgba(132,204,22,0.3)';
  const bg = type === 'bad' ? SURFACE : 'rgba(132,204,22,0.05)';
  const icon = type === 'bad' ? '✗' : '✓';
  const iconColor = type === 'bad' ? '#EF4444' : GREEN;
  const textColor = type === 'bad' ? MUTED : WHITE;
  return `
  ${rect(x, y, w, 76, 12, bg, border, 1)}
  <text x="${x+20}" y="${y+45}" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="${iconColor}">${icon}</text>
  <text x="${x+42}" y="${y+45}" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="500" fill="${textColor}">${txt}</text>`;
}

slides.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${rect(0,0,W,H,0,BG)}
  ${text(64, 96, 'A VIRADA', 11, 700, GREEN)}
  ${text(64, 160, 'Indicação', 50, 800, WHITE)}
  ${text(64, 220, 'vs. Sistema', 50, 800, GREEN)}

  <!-- Col headers -->
  ${text(64+232, 300, 'Depender de indicação', 11, 700, RED, 'middle', 0.7)}
  ${text(576+220, 300, 'Ter um sistema', 11, 700, GREEN, 'middle')}

  <!-- VS items -->
  ${vsItem(64,  320, 464, 'Resultado imprevisível', 'bad')}
  ${vsItem(576, 320, 440, 'Meta de clientes todo mês', 'good')}

  ${vsItem(64,  412, 464, 'Não sabe de onde vem o cliente', 'bad')}
  ${vsItem(576, 412, 440, 'Sabe qual canal converte', 'good')}

  ${vsItem(64,  504, 464, 'Crescimento limitado pela rede', 'bad')}
  ${vsItem(576, 504, 440, 'Escala sem depender de ninguém', 'good')}

  ${vsItem(64,  596, 464, 'Preço negociado na pressão', 'bad')}
  ${vsItem(576, 596, 440, 'Cliente chega pronto pra comprar', 'good')}

  ${vsItem(64,  688, 464, 'Pico e vale todo mês', 'bad')}
  ${vsItem(576, 688, 440, 'Crescimento constante e previsível', 'good')}

  <!-- Divider line between cols -->
  <line x1="540" y1="300" x2="540" y2="780" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

  <!-- Bottom message -->
  ${rect(64, 840, 952, 120, 16, 'rgba(132,204,22,0.06)', GREEN, 1, 0.25)}
  ${text(540, 892, 'A diferença não é sorte.', 20, 800, WHITE, 'middle')}
  ${text(540, 924, 'É método.', 20, 800, GREEN, 'middle')}

  ${text(W-64, 96, '04 / 06', 11, 600, WHITE, 'end', 0.2)}
  ${text(W-64, H-44, 'bksgrow.com.br', 11, 700, GREEN, 'end', 0.5)}
</svg>`);

// ─── SLIDE 5 — O MÉTODO BKS ────────────────────────────────────────
function step(y, num, label, desc, highlight=false) {
  const border = highlight ? GREEN : 'rgba(255,255,255,0.07)';
  const numBg = 'rgba(132,204,22,0.1)';
  return `
  ${rect(64, y, 952, 110, 16, SURFACE, border, 1)}
  ${rect(96, y+33, 44, 44, 12, numBg, 'rgba(132,204,22,0.3)', 1)}
  <text x="118" y="${y+62}" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="900" fill="${GREEN}" text-anchor="middle">${num}</text>
  ${text(162, y+57, label, 16, 700, WHITE)}
  ${text(162, y+79, desc, 12, 400, MUTED)}`;
}

slides.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${rect(0,0,W,H,0,BG)}
  ${text(64, 96, 'NOSSO MÉTODO', 11, 700, GREEN)}
  ${text(64, 160, 'Como a BKS Grow', 50, 800, WHITE)}
  ${text(64, 220, 'resolve isso', 50, 800, GREEN)}

  ${step(300, '01', 'Diagnóstico do negócio', 'Mapeamos canais, ticket médio e onde está travando a aquisição hoje.', true)}
  ${step(428, '02', 'Estratégia de tráfego pago', 'Meta Ads + Google Ads calibrados para o seu público. Sem desperdício.')}
  ${step(556, '03', 'Conteúdo que converte', 'Gestão de redes sociais com copy persuasiva e identidade visual premium.')}
  ${step(684, '04', 'Otimização contínua', 'Acompanhamos os números semanalmente e ajustamos até bater a meta.')}

  <!-- Result box -->
  ${rect(64, 840, 952, 130, 16, 'rgba(132,204,22,0.05)', GREEN, 1, 0.3)}
  ${text(96, 892, 'Resultado médio dos nossos clientes:', 13, 600, MUTED)}
  ${text(96, 928, '+40% de novos clientes em 90 dias com método BKS.', 18, 700, WHITE)}

  ${text(W-64, 96, '05 / 06', 11, 600, WHITE, 'end', 0.2)}
  ${text(W-64, H-44, 'bksgrow.com.br', 11, 700, GREEN, 'end', 0.5)}
</svg>`);

// ─── SLIDE 6 — CTA ─────────────────────────────────────────────────
slides.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="100%" r="60%">
      <stop offset="0%" stop-color="${GREEN}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${GREEN}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${rect(0,0,W,H,0,BG)}
  ${rect(0,0,W,H,0,'url(#glow)')}
  <!-- Large BG glyph -->
  <text x="700" y="1100" font-family="Inter, Arial, sans-serif" font-size="600" font-weight="900" fill="${GREEN}" opacity="0.025">→</text>

  ${text(64, 96, 'PRÓXIMO PASSO', 11, 700, GREEN)}

  ${text(64, 500, 'Chega de torcer para o telefone tocar.', 14, 500, MUTED)}
  ${text(64, 580, 'Vamos construir', 68, 900, WHITE)}
  ${text(64, 660, 'seu sistema', 68, 900, GREEN)}
  ${text(64, 740, 'de clientes.', 68, 900, WHITE)}

  ${text(64, 820, 'Diagnóstico gratuito — entendemos seu negócio,', 18, 400, MUTED)}
  ${text(64, 848, 'mapeamos os gargalos e mostramos onde o', 18, 400, MUTED)}
  ${text(64, 876, 'dinheiro está sendo deixado na mesa.', 18, 400, MUTED)}

  <!-- CTA Button -->
  ${rect(64, 940, 440, 68, 12, GREEN)}
  <text x="284" y="983" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="800" fill="#0A0A0A" text-anchor="middle" letter-spacing="1">QUERO MEU DIAGNÓSTICO  ↗</text>

  ${text(64, 1060, 'Link na bio ·', 14, 500, WHITE, 'start', 0.35)}
  ${text(184, 1060, '@bksgrow', 14, 600, GREEN, 'start', 0.7)}

  ${text(W-64, 96, '06 / 06', 11, 600, WHITE, 'end', 0.2)}
  ${text(W-64, H-44, 'bksgrow.com.br', 11, 700, GREEN, 'end', 0.5)}
</svg>`);

// ─── WRITE FILES ───────────────────────────────────────────────────
slides.forEach((svg, i) => {
  const filename = path.join(OUT, `slide-0${i+1}.svg`);
  fs.writeFileSync(filename, svg, 'utf8');
  console.log(`✓ ${filename}`);
});
console.log(`\nDone! ${slides.length} SVGs in: ${OUT}`);
