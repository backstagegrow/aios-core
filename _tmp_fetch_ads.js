const fs = require('fs');

const ACCESS_TOKEN = 'EAARMR8e4yrQBQ9Jl5zX9kZA4YVq5xK07QsMKrbeXSi7C0SvTmnzCMmsz5bde2UJ5dHMKxBftRm8XcoBIyZATTwkguuWunZCVwpGSiWysDJJzE3AjdXfyGwCTVVAmJ6r1pZBDHhlCHmrHz2LDIdFnDtryh0ga8F9A45LVMLNIchhEtyLqUk8u5O46SrRPeMBysYhrpjagKphxZBzrxZBYZAfBHLxaTWruhoO';

async function fetchAdsData() {
    console.log('Fetching accessible ad accounts...');
    const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_status&limit=100&access_token=${ACCESS_TOKEN}`);
    const accountsData = await accountsRes.json();

    if (accountsData.error) {
        console.error('Error fetching accounts:', accountsData.error);
        return;
    }

    const accounts = accountsData.data || [];
    console.log(`Found ${accounts.length} ad accounts.`);

    const allInsights = {};

    for (const account of accounts) {
        if (account.account_status !== 1) { // 1 = ACTIVE
            console.log(`Skipping inactive account: ${account.name} (${account.id})`);
            continue;
        }

        console.log(`Fetching insights for ${account.name} (${account.id})...`);
        const insightsRes = await fetch(`https://graph.facebook.com/v19.0/${account.id}/insights?fields=campaign_name,spend,impressions,clicks,cpc,ctr,actions,cost_per_action_type&date_preset=last_30d&level=campaign&limit=100&access_token=${ACCESS_TOKEN}`);
        const insightsData = await insightsRes.json();

        if (insightsData.error) {
            console.error(`Error fetching insights for ${account.name}:`, insightsData.error);
            continue;
        }

        allInsights[account.name || account.id] = insightsData.data;
    }

    fs.writeFileSync('C:\\Users\\User\\.gemini\\antigravity\\brain\\89bc1439-7d42-443c-bc51-f19e8fdafb19\\meta_ads_data.json', JSON.stringify(allInsights, null, 2));
    console.log('Data successfully saved to meta_ads_data.json');
}

fetchAdsData().catch(console.error);
