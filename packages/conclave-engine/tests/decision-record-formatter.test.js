'use strict';

const formatter = require('../decision-record-formatter');

// ---------------------------------------------------------------------------
// formatDecisionRecord
// ---------------------------------------------------------------------------

describe('formatDecisionRecord', () => {
  function makeDr(overrides = {}) {
    return {
      drNumber: 1,
      title: 'Technology Stack Decision',
      trigger: 'COMPLEX score=18',
      cloneNames: ['alex_hormozi', 'charlie_munger'],
      recommendation: 'Use microservices architecture',
      perspectives: [
        { cloneName: 'Alex Hormozi Clone', perspective: 'Focus on scalability and revenue.' },
        { cloneName: 'Charlie Munger Clone', perspective: 'Apply mental models for governance.' }
      ],
      date: '2026-03-14',
      ...overrides
    };
  }

  test('includes DR number and title', () => {
    const md = formatter.formatDecisionRecord(makeDr());
    expect(md).toContain('### DR-1: Technology Stack Decision');
  });

  test('includes date, trigger, and clones', () => {
    const md = formatter.formatDecisionRecord(makeDr());
    expect(md).toContain('**Data:** 2026-03-14');
    expect(md).toContain('**Trigger:** COMPLEX score=18');
    expect(md).toContain('alex_hormozi, charlie_munger');
  });

  test('includes recommendation', () => {
    const md = formatter.formatDecisionRecord(makeDr());
    expect(md).toContain('Use microservices architecture');
  });

  test('includes perspectives for each clone', () => {
    const md = formatter.formatDecisionRecord(makeDr());
    expect(md).toContain('**Alex Hormozi Clone:**');
    expect(md).toContain('**Charlie Munger Clone:**');
  });

  test('includes placeholder for final decision', () => {
    const md = formatter.formatDecisionRecord(makeDr());
    expect(md).toContain('[A preencher pelo @architect]');
  });

  test('handles empty perspectives gracefully', () => {
    const md = formatter.formatDecisionRecord(makeDr({ perspectives: [] }));
    expect(md).toContain('_Nenhuma perspectiva disponível_');
  });

  test('handles missing recommendation', () => {
    const md = formatter.formatDecisionRecord(makeDr({ recommendation: undefined }));
    expect(md).toContain('_Sem recomendação_');
  });

  test('truncates long perspective to 200 chars', () => {
    const longText = 'A'.repeat(300);
    const md = formatter.formatDecisionRecord(makeDr({
      perspectives: [{ cloneName: 'Clone', perspective: longText }]
    }));
    // The perspective line should not exceed 200 chars of the original text
    expect(md).not.toContain('A'.repeat(201));
  });

  test('uses today as default date', () => {
    const md = formatter.formatDecisionRecord(makeDr({ date: undefined }));
    const today = new Date().toISOString().split('T')[0];
    expect(md).toContain(`**Data:** ${today}`);
  });
});

// ---------------------------------------------------------------------------
// getNextDrNumber
// ---------------------------------------------------------------------------

describe('getNextDrNumber', () => {
  test('returns 1 for story with no DRs', () => {
    expect(formatter.getNextDrNumber('# Story\n\nNo decision records here.')).toBe(1);
  });

  test('returns 2 when DR-1 exists', () => {
    const content = '### DR-1: First Decision\n**Data:** 2026-01-01\n';
    expect(formatter.getNextDrNumber(content)).toBe(2);
  });

  test('returns max+1 when multiple DRs exist', () => {
    const content = '### DR-1: A\n### DR-3: B\n### DR-2: C\n';
    expect(formatter.getNextDrNumber(content)).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// appendDecisionRecord
// ---------------------------------------------------------------------------

describe('appendDecisionRecord', () => {
  const drMd = '### DR-1: Test\n**Data:** 2026-03-14\n**Decisão Final:** [pending]\n\n';

  test('creates Decision Records section when not present', () => {
    const story = '# Story\n\nSome content.\n';
    const updated = formatter.appendDecisionRecord(story, drMd);
    expect(updated).toContain('## Decision Records');
    expect(updated).toContain('### DR-1: Test');
  });

  test('appends to existing Decision Records section', () => {
    const story = '# Story\n\n## Decision Records\n\n### DR-1: Old\n\n## Other Section\n';
    const drMd2 = '### DR-2: New\n**Data:** 2026-03-14\n\n';
    const updated = formatter.appendDecisionRecord(story, drMd2);
    expect(updated).toContain('### DR-1: Old');
    expect(updated).toContain('### DR-2: New');
  });

  test('appends at end when Decision Records is last section', () => {
    const story = '# Story\n\n## Decision Records\n\n### DR-1: Old\n';
    const drMd2 = '### DR-2: New\n\n';
    const updated = formatter.appendDecisionRecord(story, drMd2);
    expect(updated).toContain('### DR-1: Old');
    expect(updated).toContain('### DR-2: New');
  });

  test('preserves existing content', () => {
    const story = '# Story\n\n## Background\n\nSome important text.\n';
    const updated = formatter.appendDecisionRecord(story, drMd);
    expect(updated).toContain('Some important text.');
  });
});
