import { TestBed } from '@angular/core/testing';
import { OrgNode } from '@core/models/org-member';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let content: ContentService;

  beforeEach(() => (content = TestBed.inject(ContentService)));

  it('lists the process steps in order, each with a title and text', () => {
    const steps = content.process();
    expect(steps.map((step) => step.id)).toEqual(['dredging', 'depot', 'loading']);
    for (const step of steps) {
      expect(step.title).toBeTruthy();
      expect(step.text).toBeTruthy();
    }
  });

  describe('organisation chart', () => {
    const flatten = (nodes: readonly OrgNode[]): OrgNode[] =>
      nodes.flatMap((node) => [node, ...flatten(node.reports)]);
    const find = (id: string) => flatten(content.orgChart()).find((n) => n.member.id === id)!;

    it('has the president as the single root and the CEO under them', () => {
      const roots = content.orgChart();
      expect(roots.map((n) => n.member.id)).toEqual(['sor-bunmalin']);
      expect(roots[0].reports.map((n) => n.member.id)).toEqual(['cheng-phally']);
    });

    it('places everyone exactly once', () => {
      const ids = flatten(content.orgChart()).map((n) => n.member.id);
      expect(ids.length).toBe(content.organisation().length);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('keeps chart order for the CEO’s direct reports', () => {
      expect(find('cheng-phally').reports.map((n) => n.member.id)).toEqual([
        'jia-junxian',
        'hok-cheaven',
        'cai-liangrong',
        'chroy-thea',
        'cai-rixin',
      ]);
    });

    it('nests people with two managers under the first and names the second', () => {
      expect(find('jia-junxian').reports.map((n) => n.member.id)).toEqual(['vith-sreymey']);
      expect(find('vith-sreymey').alsoReportsTo.map((m) => m.id)).toEqual(['hok-cheaven']);
      expect(find('chroy-thea').reports.map((n) => n.member.id)).toEqual(['ya-ratha']);
      expect(find('ya-ratha').alsoReportsTo.map((m) => m.id)).toEqual(['cai-rixin']);
    });
  });
});
