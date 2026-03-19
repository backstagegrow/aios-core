#!/usr/bin/env node
/**
 * brevo-audit.js
 * Puxa todas as campanhas de email do Brevo e gera relatório de aprendizados.
 * Uso: node scripts/brevo-audit.js
 */

import 'dotenv/config';

const API_KEY = process.env.BREVO_API_KEY;
const BASE_URL = 'https://api.brevo.com/v3';

if (!API_KEY) {
  console.error('[Brevo Audit] BREVO_API_KEY não encontrada no .env');
  process.exit(1);
}

const headers = {
  'api-key': API_KEY,
  'Content-Type': 'application/json',
};

async function fetchAllCampaigns() {
  const campaigns = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const url = `${BASE_URL}/emailCampaigns?limit=${limit}&offset=${offset}&status=sent&statistics=globalStats`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Brevo API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const batch = data.campaigns || [];
    campaigns.push(...batch);

    if (campaigns.length >= data.count || batch.length < limit) break;
    offset += limit;
  }

  return campaigns;
}

async function fetchCampaignStats(id) {
  const res = await fetch(`${BASE_URL}/emailCampaigns/${id}`, { headers });
  if (!res.ok) return null;
  const data = await res.json();
  return data.statistics?.globalStats || null;
}

async function fetchLists() {
  const res = await fetch(`${BASE_URL}/contacts/lists?limit=50`, { headers });
  if (!res.ok) return [];
  const data = await res.json();
  return data.lists || [];
}

function calcRate(value, total) {
  if (!total) return '0.00%';
  return ((value / total) * 100).toFixed(2) + '%';
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

async function run() {
  console.log('\n[Brevo Audit] Buscando campanhas...\n');

  const [campaigns, lists] = await Promise.all([fetchAllCampaigns(), fetchLists()]);

  // Detecta se stats estão zeradas e busca individualmente
  const allZero = campaigns.every(c => !(c.statistics?.globalStats?.sent));
  if (allZero && campaigns.length > 0) {
    console.log('[Brevo Audit] Stats agregadas vazias — buscando individualmente...\n');
    const CONCURRENCY = 10;
    for (let i = 0; i < campaigns.length; i += CONCURRENCY) {
      const batch = campaigns.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map(c => fetchCampaignStats(c.id)));
      results.forEach((stats, j) => {
        if (stats) campaigns[i + j].statistics = { globalStats: stats };
      });
      process.stdout.write(`\r  Progresso: ${Math.min(i + CONCURRENCY, campaigns.length)}/${campaigns.length}`);
    }
    console.log('\n');
  }

  if (!campaigns.length) {
    console.log('Nenhuma campanha enviada encontrada.');
    return;
  }

  const listMap = Object.fromEntries(lists.map((l) => [l.id, l.name]));

  // --- Tabela geral ---
  console.log('='.repeat(90));
  console.log('RELATÓRIO DE CAMPANHAS — BREVO');
  console.log('='.repeat(90));
  console.log(`Total de campanhas enviadas: ${campaigns.length}`);
  console.log('');

  const rows = campaigns.map((c) => {
    const stats = c.statistics?.globalStats || {};
    const sent = stats.sent || 0;
    const delivered = stats.delivered || sent;
    const opens = stats.uniqueViews || 0;
    const clicks = stats.uniqueClicks || 0;
    const unsubs = stats.unsubscriptions || 0;
    const bounces = (stats.hardBounces || 0) + (stats.softBounces || 0);
    const recipientIds = c.recipients?.listIds || [];
    const listNames = recipientIds.map((id) => listMap[id] || `Lista ${id}`).join(', ');

    return {
      name: c.name,
      subject: c.subject,
      sentDate: formatDate(c.sentDate),
      listNames,
      sent,
      openRate: calcRate(opens, delivered),
      clickRate: calcRate(clicks, delivered),
      unsubRate: calcRate(unsubs, delivered),
      bounceRate: calcRate(bounces, sent),
      opens,
      clicks,
      unsubs,
      bounces,
    };
  });

  // Sort by open rate desc
  rows.sort((a, b) => parseFloat(b.openRate) - parseFloat(a.openRate));

  rows.forEach((r, i) => {
    console.log(`${i + 1}. ${r.name}`);
    console.log(`   Assunto  : ${r.subject}`);
    console.log(`   Enviado  : ${r.sentDate} → ${r.listNames}`);
    console.log(`   Enviados : ${r.sent} | Opens: ${r.openRate} | Clicks: ${r.clickRate} | Unsub: ${r.unsubRate} | Bounce: ${r.bounceRate}`);
    console.log('');
  });

  // --- Médias gerais ---
  const avg = (key) => {
    const vals = rows.map((r) => parseFloat(r[key]));
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) + '%';
  };

  console.log('='.repeat(90));
  console.log('MÉDIAS GERAIS');
  console.log('='.repeat(90));
  console.log(`Open Rate médio   : ${avg('openRate')}`);
  console.log(`Click Rate médio  : ${avg('clickRate')}`);
  console.log(`Unsub Rate médio  : ${avg('unsubRate')}`);
  console.log(`Bounce Rate médio : ${avg('bounceRate')}`);

  // --- Top performers ---
  console.log('\n' + '='.repeat(90));
  console.log('TOP 3 — MAIOR OPEN RATE');
  console.log('='.repeat(90));
  rows.slice(0, 3).forEach((r, i) => {
    console.log(`${i + 1}. [${r.openRate}] ${r.subject}`);
  });

  // --- Piores performers ---
  const bottom = [...rows].sort((a, b) => parseFloat(a.openRate) - parseFloat(b.openRate));
  console.log('\n' + '='.repeat(90));
  console.log('BOTTOM 3 — MENOR OPEN RATE');
  console.log('='.repeat(90));
  bottom.slice(0, 3).forEach((r, i) => {
    console.log(`${i + 1}. [${r.openRate}] ${r.subject}`);
  });

  // --- Alto unsub (alertas) ---
  const highUnsub = rows.filter((r) => parseFloat(r.unsubRate) > 0.5);
  if (highUnsub.length) {
    console.log('\n' + '='.repeat(90));
    console.log('ALERTAS — UNSUB RATE > 0.5%');
    console.log('='.repeat(90));
    highUnsub.forEach((r) => {
      console.log(`! [${r.unsubRate} unsub] ${r.subject} (${r.sentDate})`);
    });
  }

  console.log('\n[Brevo Audit] Concluído.\n');
}

run().catch((err) => {
  console.error('[Brevo Audit] Erro:', err.message);
  process.exit(1);
});
