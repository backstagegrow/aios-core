import axios from 'axios';
import 'dotenv/config';

/**
 * Meta Ads Data Fetcher (Deep Audit: Campaign + Creative Level)
 */

const ACCESS_TOKEN = process.env.META_ADS_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
const API_VERSION = 'v19.0';

if (!ACCESS_TOKEN) {
    console.error('❌ Missing META_ADS_ACCESS_TOKEN in .env');
    process.exit(1);
}

async function fetchAdAccounts(token: string) {
    try {
        const url = `https://graph.facebook.com/${API_VERSION}/me/adaccounts`;
        const res = await axios.get(url, { params: { access_token: token, fields: 'name,account_id,id' } });
        return res.data.data;
    } catch (error: any) {
        console.error('❌ Error Ad Accounts:', error.response?.data || error.message);
        return [];
    }
}

async function fetchMetaAdsDeepData() {
    console.log(`\nStarting DEEP AUDIT FETCH...\n`);

    let targetAccounts = [];
    if (!AD_ACCOUNT_ID || AD_ACCOUNT_ID.trim() === '' || AD_ACCOUNT_ID.includes('your_ad_account')) {
        targetAccounts = await fetchAdAccounts(ACCESS_TOKEN!);
    } else {
        targetAccounts = [{ id: AD_ACCOUNT_ID, name: 'Configured Account' }];
    }

    const auditData: any[] = [];

    for (const account of targetAccounts) {
        console.log(`Processing: ${account.name}`);
        try {
            const campUrl = `https://graph.facebook.com/${API_VERSION}/${account.id}/campaigns`;
            const campsRes = await axios.get(campUrl, {
                params: { access_token: ACCESS_TOKEN, fields: 'id,name,status,objective', limit: 30 }
            });

            const activeCamps = campsRes.data.data.filter((c: any) => c.status === 'ACTIVE');

            for (const camp of activeCamps) {
                // Get Insights
                const insightsUrl = `https://graph.facebook.com/${API_VERSION}/${camp.id}/insights`;
                const insightsRes = await axios.get(insightsUrl, {
                    params: { access_token: ACCESS_TOKEN, fields: 'spend,impressions,clicks,actions', date_preset: 'last_30d' }
                });
                const stats = insightsRes.data.data[0] || {};

                // Get Ads (creatives)
                const adsUrl = `https://graph.facebook.com/${API_VERSION}/${camp.id}/ads`;
                const adsRes = await axios.get(adsUrl, {
                    params: { access_token: ACCESS_TOKEN, fields: 'id,name,creative{id,name,body,title,object_story_spec}', limit: 10 }
                });

                const ads = adsRes.data.data.map((ad: any) => ({
                    name: ad.name,
                    primary_text: ad.creative?.body || ad.creative?.object_story_spec?.link_data?.message || 'N/A',
                    headline: ad.creative?.title || ad.creative?.object_story_spec?.link_data?.name || 'N/A'
                }));

                let convs = 0;
                if (stats.actions) {
                    const filtered = stats.actions.filter((a: any) => ['lead', 'onsite_conversion.messaging_conversation_started_7d', 'contact', 'submit_form'].includes(a.action_type));
                    convs = filtered.reduce((sum: number, a: any) => sum + parseInt(a.value), 0);
                }

                auditData.push({
                    account: account.name,
                    campaign: camp.name,
                    objective: camp.objective,
                    spend: parseFloat(stats.spend || '0'),
                    conversions: convs,
                    cpl: convs > 0 ? (parseFloat(stats.spend) / convs).toFixed(2) : '0.00',
                    ads: ads
                });
            }
        } catch (e: any) {
            console.error(`Error for ${account.name}:`, e.message);
        }
    }

    console.log('\n--- AUDIT DATA READY ---');
    console.log(JSON.stringify(auditData, null, 2));
}

fetchMetaAdsDeepData();
