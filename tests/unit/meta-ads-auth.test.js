jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}));

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const {
  normalizeSecretValue,
  resolveMetaAdsConfig,
  formatMetaApiError,
} = require('../../scripts/lib/meta-ads-auth');

describe('meta-ads-auth', () => {
  beforeEach(() => {
    execFileSync.mockReset();
  });

  it('normalizes quoted secrets with trailing newline', () => {
    expect(normalizeSecretValue('  "token-value" \n')).toBe('token-value');
    expect(normalizeSecretValue("'another-token'\r\n")).toBe('another-token');
  });

  it('prefers command token source over stale env token', () => {
    execFileSync.mockReturnValue('fresh-token\n');

    const config = resolveMetaAdsConfig({
      META_ADS_ACCESS_TOKEN: 'stale-token',
      META_ADS_ACCESS_TOKEN_COMMAND: 'node --version',
    });

    expect(config.accessToken).toBe('fresh-token');
    expect(config.tokenSource).toBe('command');
  });

  it('loads token from external file source', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'meta-auth-'));
    const tokenPath = path.join(tmpDir, 'meta-token.txt');
    fs.writeFileSync(tokenPath, 'shared-token\n', 'utf8');

    const config = resolveMetaAdsConfig({
      META_ADS_ACCESS_TOKEN_FILE: tokenPath,
      META_AD_ACCOUNT_ID: 'act_123',
    });

    expect(config.accessToken).toBe('shared-token');
    expect(config.tokenSource).toBe('file');
    expect(config.adAccountId).toBe('act_123');
  });

  it('throws helpful error when no token source is configured', () => {
    expect(() => resolveMetaAdsConfig({})).toThrow(
      'Missing Meta Ads token. Configure META_ADS_ACCESS_TOKEN, META_ADS_ACCESS_TOKEN_FILE, or META_ADS_ACCESS_TOKEN_COMMAND.',
    );
  });

  it('formats expired token responses with source-aware guidance', () => {
    const message = formatMetaApiError(
      {
        response: {
          data: {
            error: {
              message: 'Session has expired',
              code: 190,
              error_subcode: 463,
            },
          },
        },
      },
      { tokenSource: 'env' },
    );

    expect(message).toContain('Session has expired');
    expect(message).toContain('token source: env');
    expect(message).toContain('META_ADS_ACCESS_TOKEN_FILE');
  });
});
