#!/usr/bin/env node

require('dotenv').config();

const { resolveMetaAdsConfig, formatMetaApiError } = require('./lib/meta-ads-auth');

async function main() {
  let config;
  try {
    config = resolveMetaAdsConfig(process.env);
  } catch (error) {
    console.error(`FAIL Meta API validation: ${error.message}`);
    process.exit(1);
  }

  const endpoint = config.adAccountId
    ? `https://graph.facebook.com/${config.apiVersion}/${config.adAccountId}?fields=id,account_id,name&access_token=${encodeURIComponent(config.accessToken)}`
    : `https://graph.facebook.com/${config.apiVersion}/me/adaccounts?fields=name,account_id,id&limit=1&access_token=${encodeURIComponent(config.accessToken)}`;

  try {
    const response = await fetch(endpoint);
    const bodyText = await response.text();
    const body = bodyText ? JSON.parse(bodyText) : {};

    if (!response.ok) {
      throw { response: { data: body } };
    }

    const summary = config.adAccountId
      ? `account=${body.id || config.adAccountId}`
      : `accounts=${Array.isArray(body.data) ? body.data.length : 0}`;

    console.log(
      `PASS Meta API validation: source=${config.tokenSource} apiVersion=${config.apiVersion} ${summary}`
    );
  } catch (error) {
    console.error(`FAIL Meta API validation: ${formatMetaApiError(error, config)}`);
    process.exit(1);
  }
}

main();
