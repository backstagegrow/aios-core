const learning = require('./src/services/clickup/learning');

(async () => {
    try {
        await learning.syncAllClients();
    } catch (err) {
        console.error("Critical Failure:", err);
    }
})();
