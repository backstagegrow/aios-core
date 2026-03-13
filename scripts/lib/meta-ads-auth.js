const fs = require('fs');
const { execFileSync } = require('child_process');

const { resolveCommandSpec } = require('./command-utils');

const DEFAULT_META_GRAPH_API_VERSION = 'v19.0';

function normalizeSecretValue(value) {
  if (value === undefined || value === null) {
    return '';
  }

  let normalized = String(value).trim();
  if (normalized.length >= 2) {
    const first = normalized[0];
    const last = normalized[normalized.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      normalized = normalized.slice(1, -1).trim();
    }
  }

  return normalized;
}

function readTokenFromFile(filePath) {
  const normalizedPath = normalizeSecretValue(filePath);
  if (!normalizedPath) {
    throw new Error('META_ADS_ACCESS_TOKEN_FILE is empty');
  }

  if (!fs.existsSync(normalizedPath)) {
    throw new Error(`Meta token file not found: ${normalizedPath}`);
  }

  const token = normalizeSecretValue(fs.readFileSync(normalizedPath, 'utf8'));
  if (!token) {
    throw new Error(`Meta token file is empty: ${normalizedPath}`);
  }

  return token;
}

function readTokenFromCommand(commandSpec, env = process.env) {
  const normalizedSpec = normalizeSecretValue(commandSpec);
  if (!normalizedSpec) {
    throw new Error('META_ADS_ACCESS_TOKEN_COMMAND is empty');
  }

  const resolved = resolveCommandSpec(normalizedSpec);
  const output = execFileSync(resolved.command, resolved.args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 15000,
  });
  const token = normalizeSecretValue(output);

  if (!token) {
    throw new Error('Meta token command returned an empty value');
  }

  return token;
}

function resolveMetaAdsConfig(env = process.env) {
  const commandSource = normalizeSecretValue(env.META_ADS_ACCESS_TOKEN_COMMAND);
  const fileSource = normalizeSecretValue(env.META_ADS_ACCESS_TOKEN_FILE);
  const envSource = normalizeSecretValue(env.META_ADS_ACCESS_TOKEN);

  let accessToken = '';
  let tokenSource = null;

  if (commandSource) {
    accessToken = readTokenFromCommand(commandSource, env);
    tokenSource = 'command';
  } else if (fileSource) {
    accessToken = readTokenFromFile(fileSource);
    tokenSource = 'file';
  } else if (envSource) {
    accessToken = envSource;
    tokenSource = 'env';
  }

  if (!accessToken) {
    throw new Error(
      'Missing Meta Ads token. Configure META_ADS_ACCESS_TOKEN, META_ADS_ACCESS_TOKEN_FILE, or META_ADS_ACCESS_TOKEN_COMMAND.'
    );
  }

  return {
    accessToken,
    tokenSource,
    tokenFile: fileSource || null,
    tokenCommand: commandSource || null,
    adAccountId: normalizeSecretValue(env.META_AD_ACCOUNT_ID),
    apiVersion: normalizeSecretValue(env.META_GRAPH_API_VERSION) || DEFAULT_META_GRAPH_API_VERSION,
  };
}

function extractMetaApiError(error) {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.error && typeof error.error === 'object') {
    return error.error;
  }

  return null;
}

function formatMetaApiError(error, context = {}) {
  const metaError = extractMetaApiError(error);
  if (!metaError) {
    return error?.message || 'Unknown Meta API error';
  }

  const source = context.tokenSource ? ` (token source: ${context.tokenSource})` : '';
  const baseMessage = `${metaError.message || 'Meta API request failed'}${source}`;

  if (metaError.code === 190 && metaError.error_subcode === 463) {
    return `${baseMessage}. This repository resolved an expired token. If another app keeps the credential fresh, point this repo to the shared source via META_ADS_ACCESS_TOKEN_FILE or META_ADS_ACCESS_TOKEN_COMMAND.`;
  }

  return baseMessage;
}

module.exports = {
  DEFAULT_META_GRAPH_API_VERSION,
  formatMetaApiError,
  normalizeSecretValue,
  readTokenFromCommand,
  readTokenFromFile,
  resolveMetaAdsConfig,
};
