const path = require('path');

const WINDOWS_CMD_SHIMS = new Set([
  'aios',
  'aios-pro',
  'claude',
  'npm',
  'npx',
  'pnpm',
  'yarn',
  'yarnpkg',
]);

function parseCommandString(command) {
  if (typeof command !== 'string' || command.trim() === '') {
    throw new Error('Command must be a non-empty string');
  }

  const tokens = [];
  let current = '';
  let quote = null;

  for (let index = 0; index < command.length; index++) {
    const char = command[index];
    const next = command[index + 1];

    if (quote === "'") {
      if (char === "'") {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (quote === '"') {
      if (char === '"') {
        quote = null;
        continue;
      }

      if (char === '\\' && (next === '"' || next === '\\')) {
        current += next;
        index++;
        continue;
      }

      current += char;
      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }

    if (char === '\\' && (next === '"' || next === "'" || next === '\\' || /\s/.test(next || ''))) {
      current += next || '';
      index++;
      continue;
    }

    if (/\s/.test(char)) {
      if (current !== '') {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (quote) {
    throw new Error('Unterminated quoted argument in command');
  }

  if (current !== '') {
    tokens.push(current);
  }

  if (tokens.length === 0) {
    throw new Error('Command must be a non-empty string');
  }

  return {
    command: tokens[0],
    args: tokens.slice(1),
  };
}

function hasShellMetacharacters(command) {
  if (typeof command !== 'string') {
    return false;
  }

  let quote = null;

  for (let index = 0; index < command.length; index++) {
    const char = command[index];
    const next = command[index + 1];

    if (quote === "'") {
      if (char === "'") {
        quote = null;
      }
      continue;
    }

    if (quote === '"') {
      if (char === '"' && command[index - 1] !== '\\') {
        quote = null;
      }
      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }

    if (
      char === '\n' ||
      char === '\r' ||
      char === ';' ||
      char === '|' ||
      char === '<' ||
      char === '>' ||
      char === '`'
    ) {
      return true;
    }

    if ((char === '&' && next === '&') || (char === '$' && next === '(')) {
      return true;
    }
  }

  return false;
}

function normalizeExecutable(command) {
  if (typeof command !== 'string' || command.trim() === '') {
    return command;
  }

  if (process.platform !== 'win32') {
    return command;
  }

  if (path.extname(command)) {
    return command;
  }

  return WINDOWS_CMD_SHIMS.has(command) ? `${command}.cmd` : command;
}

function resolveCommandSpec(commandSpec) {
  if (typeof commandSpec === 'string') {
    if (hasShellMetacharacters(commandSpec)) {
      throw new Error('Shell control operators are not allowed in command strings');
    }

    const parsed = parseCommandString(commandSpec);
    return {
      command: normalizeExecutable(parsed.command),
      args: parsed.args,
    };
  }

  if (
    commandSpec &&
    typeof commandSpec === 'object' &&
    typeof commandSpec.command === 'string' &&
    Array.isArray(commandSpec.args)
  ) {
    return {
      command: normalizeExecutable(commandSpec.command),
      args: [...commandSpec.args],
    };
  }

  throw new Error('Invalid command specification');
}

function escapePosixShellArg(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

module.exports = {
  escapePosixShellArg,
  hasShellMetacharacters,
  normalizeExecutable,
  parseCommandString,
  resolveCommandSpec,
};
