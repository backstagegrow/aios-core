const token = "EAAdqdx9GvPIBRJ4xwrlivlQTyS89ezDP3cr9KXEOPtJ2fbFZCbUKxDYFHasYANQrTH6hCHAwLAdjjE7Vv1rvrNoZAFjM26DOlQZAsj6Kaf0zj4jzEiBmnRTiMPZBZCihjZAGYZBHmZBBvsRinkzubLYwMa4uXcRjnh10ZCHVUW3pAToGe5bW6ZCDLU5NJlN9uQ8QZDZD";

async function testBMs() {
    console.log(`Checking BMs for token...`);
    const url = `https://graph.facebook.com/v18.0/me/businesses?access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Result:", JSON.stringify(data, null, 2));
}

testBMs();
