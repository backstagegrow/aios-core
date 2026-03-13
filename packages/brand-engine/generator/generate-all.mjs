import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const rootDir = process.cwd();
const clientsDir = path.join(rootDir, "packages/brand-engine/clients");
const generatorPath = path.join(rootDir, "packages/brand-engine/generator/generate.mjs");

if (!fs.existsSync(clientsDir)) {
    console.error("Clients directory not found.");
    process.exit(1);
}

const clients = fs.readdirSync(clientsDir).filter(f => {
    return fs.statSync(path.join(clientsDir, f)).isDirectory();
});

console.log(`Found ${clients.length} clients: ${clients.join(", ")}`);

for (const client of clients) {
    const clientPath = path.join("packages/brand-engine/clients", client);
    console.log(`Generating tokens for ${client}...`);
    try {
        execFileSync(process.execPath, [generatorPath, clientPath], { stdio: "inherit" });
    } catch (err) {
        console.error(`Failed to generate tokens for ${client}:`, err.message);
    }
}

console.log("All client tokens generated.");
