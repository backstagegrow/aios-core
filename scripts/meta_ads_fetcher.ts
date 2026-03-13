import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const { resolveMetaAdsConfig, formatMetaApiError } = require('./lib/meta-ads-auth');

type MetaConfig = {
    accessToken: string;
    adAccountId: string;
    apiVersion: string;
    tokenSource: 'env' | 'file' | 'command';
};

type AdCreative = {
    id: string;
    name: string;
    primary_text: string;
    headline: string;
};

type AdReport = {
    account: string;
    account_id: string;
    campaign: string;
    campaign_id: string;
    objective: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: string;
    cpc: string;
    cpl: string;
    ads: AdCreative[];
};

type CreativeRanking = {
    rank: number;
    status: 'WINNER' | 'AVERAGE' | 'LOSER' | 'FATIGUED';
    campaign: string;
    ad_name: string;
    primary_text: string;
    headline: string;
    cpl: string;
    ctr: string;
    spend: number;
    conversions: number;
};

type CopyBrief = {
    recommended_angles: string[];
    kill_angles: string[];
    winning_hooks: string[];
    audience_signal: string;
    next_copy_directive: string;
};

type PerformanceReport = {
    generated_at: string;
    date_range: string;
    summary: {
        total_spend: number;
        total_conversions: number;
        avg_cpl: string;
        avg_ctr: string;
        top_campaign: string;
        worst_campaign: string;
        creative_fatigue_flags: string[];
    };
    campaigns: AdReport[];
    creative_ranking: CreativeRanking[];
    copy_brief: CopyBrief;
};

let META_CONFIG: MetaConfig;
try {
    META_CONFIG = resolveMetaAdsConfig(process.env);
} catch (error: any) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
}

const ACCESS_TOKEN = META_CONFIG.accessToken;
const AD_ACCOUNT_ID = META_CONFIG.adAccountId;
const API_VERSION = META_CONFIG.apiVersion;

async function fetchAdAccounts(token: string) {
    try {
        const url = `https://graph.facebook.com/${API_VERSION}/me/adaccounts`;
        const res = await axios.get(url, { params: { access_token: token, fields: 'name,account_id,id' } });
        return res.data.data;
    } catch (error: any) {
        console.error('❌ Error Ad Accounts:', formatMetaApiError(error, META_CONFIG));
        return [];
    }
}

function rankCreatives(campaigns: AdReport[]): CreativeRanking[] {
    const entries: CreativeRanking[] = [];

    for (const camp of campaigns) {
        const ctr = parseFloat(camp.ctr);
        const cpl = parseFloat(camp.cpl);

        for (const ad of camp.ads) {
            const status: CreativeRanking['status'] =
                cpl > 0 && cpl < 50 && ctr > 1.5 ? 'WINNER' :
                cpl > 200 ? 'LOSER' :
                ctr < 0.5 ? 'FATIGUED' : 'AVERAGE';

            entries.push({
                rank: 0,
                status,
                campaign: camp.campaign,
                ad_name: ad.name,
                primary_text: ad.primary_text.substring(0, 120),
                headline: ad.headline,
                cpl: camp.cpl,
                ctr: camp.ctr,
                spend: camp.spend,
                conversions: camp.conversions,
            });
        }
    }

    entries.sort((a, b) => {
        const order = { WINNER: 0, AVERAGE: 1, FATIGUED: 2, LOSER: 3 };
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
        return parseFloat(a.cpl) - parseFloat(b.cpl);
    });

    entries.forEach((e, i) => { e.rank = i + 1; });
    return entries;
}

function buildCopyBrief(ranking: CreativeRanking[], campaigns: AdReport[]): CopyBrief {
    const winners = ranking.filter(r => r.status === 'WINNER');
    const losers = ranking.filter(r => r.status === 'LOSER' || r.status === 'FATIGUED');

    const winningHooks = winners.slice(0, 3).map(w =>
        `"${w.headline}" (CPL: R$${w.cpl}, CTR: ${w.ctr}%)`
    );

    const recommendedAngles = winners.length > 0
        ? winners.slice(0, 3).map(w => `${w.campaign}: ${w.primary_text.substring(0, 60)}...`)
        : ['No clear winners — test new angles'];

    const killAngles = losers.slice(0, 3).map(l =>
        `KILL: "${l.ad_name}" (CPL: R$${l.cpl}, CTR: ${l.ctr}%) — ${l.status}`
    );

    const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
    const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

    return {
        recommended_angles: recommendedAngles,
        kill_angles: killAngles,
        winning_hooks: winningHooks,
        audience_signal: totalConversions > 0
            ? `${totalConversions} conversions on R$${totalSpend.toFixed(2)} spend — avg CPL R$${(totalSpend / totalConversions).toFixed(2)}`
            : 'No conversions tracked — check event setup',
        next_copy_directive: winners.length > 0
            ? `Expand on winning angles. Kill fatigued ads. ${losers.length} creatives to replace.`
            : 'All angles underperforming — full creative refresh needed. Activate Clone Council for new angles.',
    };
}

function saveReport(report: PerformanceReport): string {
    const dir = path.join(process.cwd(), '.aios', 'performance');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0];
    const jsonPath = path.join(dir, `meta-ads-report-${date}.json`);
    const mdPath = path.join(dir, `meta-ads-report-${date}.md`);

    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    fs.writeFileSync(mdPath, buildMarkdownReport(report));

    return jsonPath;
}

function buildMarkdownReport(report: PerformanceReport): string {
    const { summary, creative_ranking, copy_brief } = report;

    const topRanking = creative_ranking.slice(0, 10).map(r =>
        `| ${r.rank} | ${r.status} | ${r.campaign.substring(0, 30)} | ${r.headline.substring(0, 40)} | R$${r.cpl} | ${r.ctr}% | ${r.conversions} |`
    ).join('\n');

    return `# Meta Ads Performance Report
**Generated:** ${report.generated_at}
**Period:** ${report.date_range}

## Summary
| Metric | Value |
|--------|-------|
| Total Spend | R$${summary.total_spend.toFixed(2)} |
| Total Conversions | ${summary.total_conversions} |
| Avg CPL | R$${summary.avg_cpl} |
| Avg CTR | ${summary.avg_ctr}% |
| Top Campaign | ${summary.top_campaign} |
| Worst Campaign | ${summary.worst_campaign} |

${summary.creative_fatigue_flags.length > 0 ? `## Creative Fatigue Alerts\n${summary.creative_fatigue_flags.map(f => `- ⚠️ ${f}`).join('\n')}` : ''}

## Creative Ranking (Top 10)
| Rank | Status | Campaign | Headline | CPL | CTR | Conversions |
|------|--------|----------|----------|-----|-----|-------------|
${topRanking}

## Copy Brief — Next Cycle Directives

### Winning Angles (expand these)
${copy_brief.winning_hooks.map(h => `- ✅ ${h}`).join('\n') || '- No winners yet'}

### Recommended Angles
${copy_brief.recommended_angles.map(a => `- ${a}`).join('\n')}

### Kill List
${copy_brief.kill_angles.map(a => `- ${a}`).join('\n') || '- None to kill'}

### Audience Signal
${copy_brief.audience_signal}

### Next Copy Directive
> ${copy_brief.next_copy_directive}

---
*Feed this report to \`nexus-revenue-ops/performance_feedback_agent\` for next copy cycle brief.*
`;
}

async function fetchMetaAdsDeepData(): Promise<void> {
    console.log(`\nStarting DEEP AUDIT FETCH...\n`);

    let targetAccounts: any[] = [];
    if (!AD_ACCOUNT_ID || AD_ACCOUNT_ID.trim() === '' || AD_ACCOUNT_ID.includes('your_ad_account')) {
        targetAccounts = await fetchAdAccounts(ACCESS_TOKEN!);
    } else {
        targetAccounts = [{ id: AD_ACCOUNT_ID, name: 'Configured Account' }];
    }

    const campaigns: AdReport[] = [];

    for (const account of targetAccounts) {
        console.log(`Processing: ${account.name}`);
        try {
            const campUrl = `https://graph.facebook.com/${API_VERSION}/${account.id}/campaigns`;
            const campsRes = await axios.get(campUrl, {
                params: { access_token: ACCESS_TOKEN, fields: 'id,name,status,objective', limit: 30 }
            });

            const activeCamps = campsRes.data.data.filter((c: any) => c.status === 'ACTIVE');

            for (const camp of activeCamps) {
                const insightsUrl = `https://graph.facebook.com/${API_VERSION}/${camp.id}/insights`;
                const insightsRes = await axios.get(insightsUrl, {
                    params: {
                        access_token: ACCESS_TOKEN,
                        fields: 'spend,impressions,clicks,actions',
                        date_preset: 'last_30d'
                    }
                });
                const stats = insightsRes.data.data[0] || {};

                const adsUrl = `https://graph.facebook.com/${API_VERSION}/${camp.id}/ads`;
                const adsRes = await axios.get(adsUrl, {
                    params: {
                        access_token: ACCESS_TOKEN,
                        fields: 'id,name,creative{id,name,body,title,object_story_spec}',
                        limit: 10
                    }
                });

                const ads: AdCreative[] = adsRes.data.data.map((ad: any) => ({
                    id: ad.id,
                    name: ad.name,
                    primary_text: ad.creative?.body || ad.creative?.object_story_spec?.link_data?.message || 'N/A',
                    headline: ad.creative?.title || ad.creative?.object_story_spec?.link_data?.name || 'N/A',
                }));

                const spend = parseFloat(stats.spend || '0');
                const impressions = parseInt(stats.impressions || '0');
                const clicks = parseInt(stats.clicks || '0');

                let convs = 0;
                if (stats.actions) {
                    const filtered = stats.actions.filter((a: any) =>
                        ['lead', 'onsite_conversion.messaging_conversation_started_7d', 'contact', 'submit_form'].includes(a.action_type)
                    );
                    convs = filtered.reduce((sum: number, a: any) => sum + parseInt(a.value), 0);
                }

                campaigns.push({
                    account: account.name,
                    account_id: account.id,
                    campaign: camp.name,
                    campaign_id: camp.id,
                    objective: camp.objective,
                    spend,
                    impressions,
                    clicks,
                    conversions: convs,
                    ctr: impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00',
                    cpc: clicks > 0 ? (spend / clicks).toFixed(2) : '0.00',
                    cpl: convs > 0 ? (spend / convs).toFixed(2) : '0.00',
                    ads,
                });
            }
        } catch (e: any) {
            console.error(`Error for ${account.name}:`, formatMetaApiError(e, META_CONFIG));
        }
    }

    const ranking = rankCreatives(campaigns);
    const copyBrief = buildCopyBrief(ranking, campaigns);

    const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
    const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
    const avgCtr = campaigns.length > 0
        ? (campaigns.reduce((s, c) => s + parseFloat(c.ctr), 0) / campaigns.length).toFixed(2)
        : '0.00';

    const sortedByCpl = campaigns.filter(c => c.conversions > 0).sort((a, b) => parseFloat(a.cpl) - parseFloat(b.cpl));
    const fatiguedCreatives = ranking.filter(r => r.status === 'FATIGUED').map(r => `${r.ad_name} (CTR: ${r.ctr}%)`);

    const report: PerformanceReport = {
        generated_at: new Date().toISOString(),
        date_range: 'last_30d',
        summary: {
            total_spend: totalSpend,
            total_conversions: totalConversions,
            avg_cpl: totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : '0.00',
            avg_ctr: avgCtr,
            top_campaign: sortedByCpl[0]?.campaign || 'N/A',
            worst_campaign: sortedByCpl[sortedByCpl.length - 1]?.campaign || 'N/A',
            creative_fatigue_flags: fatiguedCreatives,
        },
        campaigns,
        creative_ranking: ranking,
        copy_brief: copyBrief,
    };

    const outputPath = saveReport(report);
    console.log(`\n✅ Performance report saved to: ${outputPath}`);
    console.log(`📋 Markdown summary: ${outputPath.replace('.json', '.md')}`);
    console.log(`\n--- COPY BRIEF FOR NEXT CYCLE ---`);
    console.log(`Next directive: ${copyBrief.next_copy_directive}`);
    console.log(`Winning hooks: ${copyBrief.winning_hooks.length}`);
    console.log(`Creatives to kill: ${copyBrief.kill_angles.length}`);
    console.log(`\nSummary:\n`, JSON.stringify(report.summary, null, 2));
}

fetchMetaAdsDeepData();
