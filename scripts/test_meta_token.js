const token = "EAAdqdx9GvPIBRJ4xwrlivlQTyS89ezDP3cr9KXEOPtJ2fbFZCbUKxDYFHasYANQrTH6hCHAwLAdjjE7Vv1rvrNoZAFjM26DOlQZAsj6Kaf0zj4jzEiBmnRTiMPZBZCihjZAGYZBHmZBBvsRinkzubLYwMa4uXcRjnh10ZCHVUW3pAToGe5bW6ZCDLU5NJlN9uQ8QZDZD";

async function testToken() {
    console.log("Fetching /me/adaccounts...");
    const acctRes = await fetch(`https://graph.facebook.com/v18.0/me/adaccounts?access_token=${token}&limit=100`);
    const acctData = await acctRes.json();
    console.log("Accounts Result:", JSON.stringify(acctData, null, 2));

    console.log("\nFetching /me/businesses...");
    const bmRes = await fetch(`https://graph.facebook.com/v18.0/me/businesses?access_token=${token}`);
    const bmData = await bmRes.json();
    console.log("Businesses Result:", JSON.stringify(bmData, null, 2));
}

testToken();
