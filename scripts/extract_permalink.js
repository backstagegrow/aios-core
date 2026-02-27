const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/001Gravity/aios-core/scripts/page_full_details.json', 'utf8'));
console.log('Permalink:', data.permalink);
