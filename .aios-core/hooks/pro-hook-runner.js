/**
 * AIOS Pro Hook Runner
 * 
 * This script serves as the extension point for AIOS Pro features within the Core framework.
 * It detects if the Pro module is available and executes the corresponding hook.
 */
const fs = require('fs');
const path = require('path');

async function run() {
    const hookEvent = process.argv[2]; // e.g., PreCompact, Stop, PostToolUseFailure
    const rootPath = process.cwd();
    const proPath = path.join(rootPath, 'pro');

    // Check if Pro is available
    if (!fs.existsSync(proPath)) {
        // Graceful exit if Pro is not available
        process.exit(0);
    }

    try {
        // Relative path to the hook handler in Pro
        const hookHandlerPath = path.join(proPath, 'memory', 'hooks', `${hookEvent.toLowerCase()}.js`);

        if (fs.existsSync(hookHandlerPath)) {
            const handler = require(hookHandlerPath);
            if (typeof handler.run === 'function') {
                await handler.run(process.env);
            }
        }
    } catch (error) {
        // Non-blocking failure for hooks
        console.error(`[AIOS-Hooks] Error running Pro hook ${hookEvent}:`, error.message);
    }
}

run();
