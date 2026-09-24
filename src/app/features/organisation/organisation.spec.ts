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

  it('nests lists to show who reports to whom', () => {
    const ceo = [...el.querySelectorAll('.org__item')].find((li) =>
      li.querySelector(':scope > .person')?.textContent?.includes('Cheng Phally'),
    )!;
    const direct = ceo.querySelectorAll(':scope > ul > li > .person .person__name');
    expect([...direct].map((p) => p.textContent?.trim())).toEqual([
      'Jia Junxian',
      'Hok Cheaven',
      'Cai Liangrong',
      'Chroy Thea',
      'Cai Rixin',
    ]);
  });

  it('shows each portrait beside its own name, with an empty alt', () => {
    const people = [...el.querySelectorAll('.person')];
    expect(people.length).toBe(14);
    for (const person of people) {
      const name = person.querySelector('.person__name')!.textContent!.trim();
      const img = person.querySelector('img')!;
      expect(img.getAttribute('alt')).toBe('');
      expect(img.getAttribute('src')).toBe(`/images/people/${name.toLowerCase().replace(/ /g, '-')}.webp`);
    }
  });

  it('names a second manager in text', () => {
    const notes = [...el.querySelectorAll('.person__also')].map((p) => p.textContent?.trim());
    expect(notes).toEqual(['Also reports to Hok Cheaven', 'Also reports to Cai Rixin']);
  });
});
