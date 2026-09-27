import { Service, Signal, computed, signal } from '@angular/core';
import { CONTACT_DETAILS } from '@content/contact';
import { ORGANISATION } from '@content/organisation';
import { PROCESS } from '@content/process';
import { ContactDetails } from '@core/models/contact-details';
import { OrgMember, OrgNode } from '@core/models/org-member';
import { ProcessStep } from '@core/models/process-step';

/**
 * The only way components read site content. Everything is exposed as signals so the
 * static arrays in src/app/content can later be swapped for httpResource() calls
 * without touching any component.
 */
@Service()
export class ContentService {
  /** The company's work, in order: dredging, pumping to the depot, loading trucks. */
  readonly process: Signal<readonly ProcessStep[]> = signal(PROCESS).asReadonly();

  readonly organisation: Signal<readonly OrgMember[]> = signal(ORGANISATION).asReadonly();

  readonly contactDetails: Signal<ContactDetails> = signal(CONTACT_DETAILS).asReadonly();

  /**
   * The chart as a tree: each person under their first manager, in chart order. Anyone
   * whose manager isn't on the chart is a root.
   */
  readonly orgChart: Signal<readonly OrgNode[]> = computed(() => {
    const members = this.organisation();
    const byId = new Map(members.map((member) => [member.id, member]));
    const build = (member: OrgMember): OrgNode => ({
      member,
      alsoReportsTo: member.reportsTo.slice(1).flatMap((id) => byId.get(id) ?? []),
      reports: members.filter((other) => other.reportsTo[0] === member.id).map(build),
    });
    return members.filter((member) => !byId.has(member.reportsTo[0] ?? '')).map(build);
  });
}
