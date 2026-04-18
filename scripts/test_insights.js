const token = "EAAdqdx9GvPIBRJ4xwrlivlQTyS89ezDP3cr9KXEOPtJ2fbFZCbUKxDYFHasYANQrTH6hCHAwLAdjjE7Vv1rvrNoZAFjM26DOlQZAsj6Kaf0zj4jzEiBmnRTiMPZBZCihjZAGYZBHmZBBvsRinkzubLYwMa4uXcRjnh10ZCHVUW3pAToGe5bW6ZCDLU5NJlN9uQ8QZDZD";
const adId = "act_411851407962178"; // GT House

async function testInsights() {
    console.log(`Fetching insights for ${adId} (last_30d)...`);
    const url = `https://graph.facebook.com/v18.0/${adId}/insights?date_preset=last_30d&fields=spend,actions,clicks,cpc&access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Result:", JSON.stringify(data, null, 2));
}

testInsights();
