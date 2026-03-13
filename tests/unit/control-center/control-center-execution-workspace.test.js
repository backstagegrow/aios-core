'use strict';

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

describe('control center execution workspace', () => {
  test('has story scaffold for the execution workspace', () => {
    const content = readProjectFile(
      'docs/stories/workspace/story-aios-control-center-execution-workspace.md',
    );

    expect(content).toContain('**Story ID:** WS-025');
    expect(content).toContain('**Status:** Done');
    expect(content).toContain('- [x] AC6 atendido');
  });

  test('creates the /control-center/execute route and navigation entry', () => {
    const pagePath = 'apps/brand-console/app/control-center/execute/page.tsx';
    const sidebarPath = 'apps/brand-console/components/control-center/ControlCenterSidebar.tsx';

    expect(fs.existsSync(path.join(projectRoot, pagePath))).toBe(true);

    const pageContent = readProjectFile(pagePath);
    const sidebarContent = readProjectFile(sidebarPath);

    expect(pageContent).toContain('ExecutionWorkspace');
    expect(pageContent).toContain('buildDashboardSnapshot');
    expect(pageContent).toContain('readExecutionSessions');
    expect(pageContent).toContain('readExecutionMessages');
    expect(sidebarContent).toContain('/control-center/execute');
    expect(sidebarContent).toContain('Workspace');
  });

  test('provides local-first adapters and runtime for execution chat', () => {
    const files = [
      'apps/brand-console/lib/control-center/adapters/execution-sessions.js',
      'apps/brand-console/lib/control-center/adapters/execution-messages.js',
      'apps/brand-console/lib/control-center/execution-runtime.ts',
      '.aios-core/data/control-center/execution-sessions.json',
      '.aios-core/data/control-center/execution-messages.jsonl',
    ];

    files.forEach((relativePath) => {
      expect(fs.existsSync(path.join(projectRoot, relativePath))).toBe(true);
    });

    const runtimeContent = readProjectFile(
      'apps/brand-console/lib/control-center/execution-runtime.ts',
    );

    expect(runtimeContent).toContain('buildExecutionSystemPrompt');
    expect(runtimeContent).toContain('runExecutionTurn');
    expect(runtimeContent).toContain('OPENAI_API_KEY');
  });

  test('wires server actions and chat UI surfaces for execution', () => {
    const actionsContent = readProjectFile('apps/brand-console/lib/control-center/actions.ts');
    const workspaceContent = readProjectFile(
      'apps/brand-console/components/control-center/chat/ExecutionWorkspace.tsx',
    );
    const composerContent = readProjectFile(
      'apps/brand-console/components/control-center/chat/ExecutionComposer.tsx',
    );

    expect(actionsContent).toContain('openExecutionSession');
    expect(actionsContent).toContain('sendExecutionMessage');
    expect(workspaceContent).toContain('ExecutionComposer');
    expect(workspaceContent).toContain('ExecutionMessageList');
    expect(workspaceContent).toContain('ExecutionTargetPicker');
    expect(composerContent).toContain('action={sendExecutionMessage}');
  });
});
