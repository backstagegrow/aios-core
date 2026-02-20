const http = require('http');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 3001);
const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL || '';

function sanitize(value) {
  return String(value || '').trim();
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 256 * 1024) {
        reject(new Error('Payload muito grande'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('JSON invalido'));
      }
    });
    req.on('error', reject);
  });
}

function validateLead(body) {
  const name = sanitize(body.name);
  const email = sanitize(body.email).toLowerCase();
  const company = sanitize(body.company);
  const eventType = sanitize(body.event_type);
  const attendees = sanitize(body.attendees);

  if (name.length < 3) return 'Nome invalido';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Email invalido';
  if (company.length < 2) return 'Empresa invalida';
  if (!eventType) return 'Tipo de evento obrigatorio';
  if (!attendees) return 'Quantidade de participantes obrigatoria';
  return null;
}

function normalizePayload(body) {
  return {
    name: sanitize(body.name),
    email: sanitize(body.email).toLowerCase(),
    company: sanitize(body.company),
    event_type: sanitize(body.event_type),
    attendees: sanitize(body.attendees),
    utm_source: sanitize(body.utm_source),
    utm_medium: sanitize(body.utm_medium),
    utm_campaign: sanitize(body.utm_campaign),
    utm_content: sanitize(body.utm_content),
    page: sanitize(body.page),
    timestamp: sanitize(body.timestamp) || new Date().toISOString()
  };
}

async function maybeSendToCRM(payload) {
  if (!CRM_WEBHOOK_URL) return;
  await fetch(CRM_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, { status: 'ok', service: 'gthouse-leads-api' });
  }

  if (req.method === 'POST' && url.pathname === '/api/leads') {
    try {
      const body = await parseBody(req);
      const validationError = validateLead(body);
      if (validationError) {
        return sendJson(res, 400, { success: false, message: validationError });
      }

      const payload = normalizePayload(body);
      await maybeSendToCRM(payload);
      console.log('[GT House] Lead capturado:', payload.email, payload.company, payload.event_type);
      return sendJson(res, 200, { success: true, message: 'Lead recebido com sucesso.' });
    } catch (error) {
      return sendJson(res, 502, { success: false, message: `Erro no processamento do lead: ${error.message}` });
    }
  }

  return sendJson(res, 404, { success: false, message: 'Rota nao encontrada' });
});

server.listen(PORT, () => {
  console.log(`[GT House] API rodando na porta ${PORT}`);
});
