import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { SearchOverlay } from './search-overlay';

@Component({ template: '' })
class Blank {}

// jsdom may lack <dialog> modality; a minimal stand-in keeps the component logic testable.
function ensureDialogApi(): void {
  const proto = HTMLDialogElement.prototype as HTMLDialogElement & Record<string, unknown>;
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
  }
  if (typeof proto.close !== 'function') {
    proto.close = function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
}

describe('SearchOverlay', () => {
  let fixture: ComponentFixture<SearchOverlay>;
  let el: HTMLElement;
  let closed: number;

  const dialog = () => el.querySelector('dialog')!;
  const input = () => el.querySelector<HTMLInputElement>('#site-search')!;
  const search = async (text: string) => {
    input().value = text;
    input().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    ensureDialogApi();
    await TestBed.configureTestingModule({
      imports: [SearchOverlay],
      providers: [provideRouter([{ path: '**', component: Blank }])],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchOverlay);
    el = fixture.nativeElement;
    document.body.appendChild(el);
    closed = 0;
    fixture.componentInstance.closed.subscribe(() => closed++);
    await fixture.whenStable();
  });

  afterEach(() => el.remove());

  it('opens as a modal and starts in the search box', async () => {
    fixture.componentInstance.open();
    await fixture.whenStable();
    expect(dialog().open).toBe(true);
    expect(document.activeElement).toBe(input());
    expect(el.querySelector('[role="status"]')?.textContent).toContain('Type to search');
  });

  it('finds pages, companies and news and announces the count', async () => {
    fixture.componentInstance.open();
    await search('placeholder');

    const kinds = new Set([...el.querySelectorAll('.kind')].map((k) => k.textContent));
    expect(kinds.has('Company')).toBe(true);
    expect(kinds.has('News')).toBe(true);
    expect(el.querySelector('[role="status"]')?.textContent).toMatch(/^\d+ results?$/);

    await search('investors');
    expect(el.querySelector('.result a')?.getAttribute('href')).toBe('/investors');
  });

  it('says when nothing matches', async () => {
    fixture.componentInstance.open();
    await search('zzzz');
    expect(el.querySelector('.results')).toBeNull();
    expect(el.querySelector('[role="status"]')?.textContent).toBe('No results for “zzzz”.');
  });

  it('clears the previous query when reopened', async () => {
    fixture.componentInstance.open();
    await search('bank');
    fixture.componentInstance.close();
    fixture.componentInstance.open();
    await fixture.whenStable();
    expect(input().value).toBe('');
  });

  it('closes on navigation and tells the opener', async () => {
    fixture.componentInstance.open();
    await fixture.whenStable();
    await TestBed.inject(Router).navigateByUrl('/investors');
    await fixture.whenStable();
    expect(dialog().open).toBe(false);
    expect(closed).toBe(1);
  });

  it('closes on a backdrop click but not a panel click', async () => {
    fixture.componentInstance.open();
    await fixture.whenStable();
    el.querySelector<HTMLElement>('.panel')!.click();
    expect(dialog().open).toBe(true);
    dialog().click();
    expect(dialog().open).toBe(false);
  });
});
