import { exec } from 'child_process';
import util from 'util';
import os from 'os';
import path from 'path';
import 'dotenv/config';

const execPromise = util.promisify(exec);
const NOTEBOOKLM_DEBUG_ENABLED = process.env.AIOS_DEBUG === 'true' || process.env.AIOS_RAG_DEBUG === 'true';

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function debugLog(message: string): void {
    if (NOTEBOOKLM_DEBUG_ENABLED) {
        console.log(message);
    }
}

export async function queryNotebookLM(query: string, _clientId?: string): Promise<string> {
    debugLog(`[RAG] Querying NotebookLM for: "${query}"`);

    // We should ideally pass a specific notebook ID if they belong to a specific client.
    // For now, if NotebookLM is generalized or handled underneath, we just run the script.

    const skillPath = path.join(process.env.USERPROFILE || os.homedir(), '.gemini', 'antigravity', 'skills', 'notebooklm');

    try {
        const { stdout } = await execPromise(`python scripts/run.py ask_question.py --question "${query}"`, {
            cwd: skillPath,
            env: { ...process.env, HEADLESS: 'true' }
        });

        debugLog('[RAG] NotebookLM returned data successfully.');
        return stdout;
    } catch (error: unknown) {
        if (NOTEBOOKLM_DEBUG_ENABLED) {
            console.error('[RAG] NotebookLM query failed:', getErrorMessage(error));
        }
        return 'Not available. Could not fetch from NotebookLM.';
    }
}
