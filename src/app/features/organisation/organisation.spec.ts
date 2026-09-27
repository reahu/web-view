import { TestBed } from '@angular/core/testing';
import { ContentService } from '@core/services/content.service';
import { Organisation } from './organisation';

describe('Organisation', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Organisation] }).compileComponents();
    const fixture = TestBed.createComponent(Organisation);
    await fixture.whenStable();
    el = fixture.nativeElement;
  });

  it('has one h1 and lists every person once', () => {
    expect(el.querySelectorAll('h1').length).toBe(1);
    const names = [...el.querySelectorAll('.person__name')].map((p) => p.textContent?.trim());
    expect(names.length).toBe(TestBed.inject(ContentService).organisation().length);
    expect(new Set(names).size).toBe(names.length);
  });

  const namesIn = (root: Element, selector: string) =>
    [...root.querySelectorAll(selector)].map((p) => p.textContent?.trim());

  it('nests lists to show who reports to whom, in the printed chart order', () => {
    const ceo = [...el.querySelectorAll('.org__item')].find((li) =>
      li.querySelector(':scope > .org__heads')?.textContent?.includes('Cheng Phally'),
    )!;
    expect(namesIn(ceo, ':scope > ul > li > .org__heads .person__name')).toEqual([
      'Jia Junxian',
      'Hok Cheaven',
      'Cai Liangrong',
      'Chroy Thea',
      'Cai Rixin',
    ]);

    const cto = ceo.querySelector(':scope > ul > li:nth-child(2)')!;
    expect(namesIn(cto, ':scope > ul > li > .org__heads .person__name')).toEqual([
      'Zhang Quanjian',
      'Khun Chanthol',
      'Shang Deyao',
    ]);
    expect(namesIn(cto, '.org--subteam .person__name')).toEqual(['Sroy Chendy', 'Cha Vin']);
  });

  it('pairs people who share a report, with that person beneath the pair', () => {
    const pairs = [...el.querySelectorAll('.org__item--pair')];
    expect(pairs.map((li) => namesIn(li, ':scope > .org__heads .person__name'))).toEqual([
      ['Jia Junxian', 'Hok Cheaven'],
      ['Chroy Thea', 'Cai Rixin'],
    ]);
    expect(pairs.map((li) => namesIn(li, ':scope > ul .person__name'))).toEqual([
      ['Vith Sreymey'],
      ['Ya Ratha'],
    ]);
  });

  it('shows each portrait above its own name, with an empty alt', () => {
    const people = [...el.querySelectorAll('.person')];
    expect(people.length).toBe(14);
    for (const person of people) {
      const name = person.querySelector('.person__name')!.textContent!.trim();
      const img = person.querySelector('img')!;
      expect(img.getAttribute('alt')).toBe('');
      expect(img.getAttribute('src')).toBe(
        `/images/people/${name.toLowerCase().replace(/ /g, '-')}.webp`,
      );
    }
  });

  it('colours the name plates as printed: leads, the teams, and the people under a pair', () => {
    const names = (selector: string) =>
      [...el.querySelectorAll(`${selector} .person__name`)].map((p) => p.textContent?.trim());
    expect(names('.person--lead')).toEqual(['Sor Bunmalin', 'Cheng Phally']);
    expect(names('.person--team')).toEqual([
      'Zhang Quanjian',
      'Khun Chanthol',
      'Sroy Chendy',
      'Cha Vin',
      'Shang Deyao',
    ]);
    expect(names('.person--shared')).toEqual(['Vith Sreymey', 'Ya Ratha']);
  });

  it('heads the chart with the company and title in all three scripts, as printed', () => {
    const lines = (selector: string) =>
      [...el.querySelectorAll(`${selector} > span`)].map((span) => span.getAttribute('lang'));
    expect(lines('.board__company')).toEqual(['km', 'en', 'zh-Hans']);
    expect(lines('h1')).toEqual(['km', 'en', 'zh-Hans']);
    expect(el.querySelector('h1 [lang="en"]')?.textContent).toBe('Organizational structure');
    expect(el.querySelector('.board__logo')?.getAttribute('alt')).toBe('');
  });

  it('names a second manager for screen readers, hidden where the bracket shows it', () => {
    const notes = [...el.querySelectorAll('.person__also')];
    expect(notes.map((p) => p.textContent?.trim())).toEqual([
      'Also reports to Hok Cheaven',
      'Also reports to Cai Rixin',
    ]);
    expect(notes.every((p) => p.classList.contains('visually-hidden'))).toBe(true);
  });
});
