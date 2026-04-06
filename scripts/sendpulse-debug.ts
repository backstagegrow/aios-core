import 'dotenv/config';

const key = process.env.SENDPULSE_API_KEY || '';

const [info, balance] = await Promise.all([
    fetch('https://api.sendpulse.com/user/info', { headers: { Authorization: `Bearer ${key}` } }).then(r => r.json()),
    fetch('https://api.sendpulse.com/user/balance/detail', { headers: { Authorization: `Bearer ${key}` } }).then(r => r.json()),
]);

console.log('USER:', JSON.stringify(info, null, 2));
console.log('BALANCE:', JSON.stringify(balance, null, 2));
