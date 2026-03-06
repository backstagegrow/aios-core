import fs from "node:fs";
import path from "node:path";

const hexToRgb = (hex) => {
    const h = hex.replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

function write(outDir, file, content) {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, file), content, "utf-8");
}

const clientPath = process.argv[2];
if (!clientPath) throw new Error("Pass client path. Example: clients/alpha");

const absClientPath = path.isAbsolute(clientPath) ? clientPath : path.join(process.cwd(), clientPath);
const configPath = path.join(absClientPath, "client.config.json");

if (!fs.existsSync(configPath)) {
    throw new Error(`Config not found at ${configPath}`);
}

const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const slug = cfg.client.slug;
const outDir = path.join(process.cwd(), "packages/brand-engine/dist", slug);

const c = cfg.brand.colors;
const rgb = {
    primary: hexToRgb(c.brandPrimary),
    secondary: hexToRgb(c.brandSecondary),
    accent: hexToRgb(c.brandAccent),
    danger: hexToRgb(c.danger ?? "#E5484D"),
    success: hexToRgb(c.success ?? "#30A46C"),
    warning: hexToRgb(c.warning ?? "#F5A524"),
};

const tokensCss = `:root[data-client="${slug}"]{
  --brand-primary: ${c.brandPrimary};
  --brand-secondary: ${c.brandSecondary};
  --brand-accent: ${c.brandAccent};

  --text-primary: var(--brand-accent);
  --text-secondary: color-mix(in srgb, var(--brand-accent) 70%, transparent);
  --text-muted: color-mix(in srgb, var(--brand-accent) 55%, transparent);

  --bg-page: var(--brand-secondary);
  --bg-surface: color-mix(in srgb, var(--brand-secondary) 86%, var(--brand-accent));
  --bg-elevated: color-mix(in srgb, var(--brand-secondary) 78%, var(--brand-accent));

  --border-subtle: color-mix(in srgb, var(--brand-accent) 10%, transparent);
  --border-strong: color-mix(in srgb, var(--brand-accent) 18%, transparent);

  --status-danger: ${c.danger ?? "#E5484D"};
  --status-success: ${c.success ?? "#30A46C"};
  --status-warning: ${c.warning ?? "#F5A524"};

  --font-heading: "${cfg.brand.typography.fontHeading}";
  --font-body: "${cfg.brand.typography.fontBody}";
  --font-mono: "${cfg.brand.typography.fontMono ?? "JetBrains Mono"}";

  --radius-sm: ${cfg.brand.shape?.radiusScale === "sharp" ? "8px" : "10px"};
  --radius-md: ${cfg.brand.shape?.radiusScale === "sharp" ? "10px" : "14px"};
  --radius-lg: ${cfg.brand.shape?.radiusScale === "sharp" ? "12px" : "18px"};
}`;

const bridgeCss = `:root[data-client="${slug}"]{
  --tw-brand-primary: ${rgb.primary.r} ${rgb.primary.g} ${rgb.primary.b};
  --tw-brand-secondary: ${rgb.secondary.r} ${rgb.secondary.g} ${rgb.secondary.b};
  --tw-brand-accent: ${rgb.accent.r} ${rgb.accent.g} ${rgb.accent.b};

  --tw-status-danger: ${rgb.danger.r} ${rgb.danger.g} ${rgb.danger.b};
  --tw-status-success: ${rgb.success.r} ${rgb.success.g} ${rgb.success.b};
  --tw-status-warning: ${rgb.warning.r} ${rgb.warning.g} ${rgb.warning.b};

  --tw-text-primary: ${rgb.accent.r} ${rgb.accent.g} ${rgb.accent.b};
  --tw-text-secondary: ${Math.round(rgb.accent.r * 0.71)} ${Math.round(rgb.accent.g * 0.71)} ${Math.round(rgb.accent.b * 0.71)};
  --tw-text-muted: ${Math.round(rgb.accent.r * 0.55)} ${Math.round(rgb.accent.g * 0.55)} ${Math.round(rgb.accent.b * 0.55)};

  --tw-bg-page: ${rgb.secondary.r} ${rgb.secondary.g} ${rgb.secondary.b};
  --tw-bg-surface: ${Math.round(rgb.secondary.r * 0.86 + rgb.accent.r * 0.14)} ${Math.round(rgb.secondary.g * 0.86 + rgb.accent.g * 0.14)} ${Math.round(rgb.secondary.b * 0.86 + rgb.accent.b * 0.14)};
}`;

write(outDir, "tokens.css", tokensCss);
write(outDir, "bridge.css", bridgeCss);

console.log("✅ Generated:", outDir);
