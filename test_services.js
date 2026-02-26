/**
 * TEST SCRIPT: ClickUp Service Architecture
 */

const learning = require('./src/services/clickup/learning');
const factory = require('./src/services/clickup/factory');

async function test() {
    console.log("🚀 STARTING INTEGRATION TEST (SERVICES)...");

    try {
        // Test 1: Auto-Learning
        const syncStatus = await learning.syncAllClients();
        console.log("\n🧪 Test 1 Result (Learning):", syncStatus);

        // Test 2: Task Factory (Master Lane)
        const task = await factory.createForApproval(
            "AIOS CORE",
            "Refatoração de Serviços",
            "Testando a nova arquitetura de serviços centralizados (src/services/clickup/)."
        );
        console.log("🧪 Test 2 Result (Factory): Task ID", task.id);

        console.log("\n✅ ALL INTEGRATION TESTS PASSED!");
    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.message);
    }
}

test();
