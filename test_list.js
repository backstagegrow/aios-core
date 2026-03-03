
const { clickupRequest } = require('./scripts/lib/clickup-env.js');
async function test() {
  const resList = await clickupRequest('GET', '/list/901313508311');
  console.log('List test:', resList.status);
  if (resList.status === 200) console.log(resList.data.name);
}
test();

