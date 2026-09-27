import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { QuoteCta } from './quote-cta';

describe('QuoteCta', () => {
  const create = async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteCta],
      providers: [provideRouter([])],
    }).compileComponents();
    return TestBed.createComponent(QuoteCta);
  };

  it('links to the contact page', async () => {
    const fixture = await create();
    await fixture.whenStable();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('href')).toBe('/en/contact-us');
    expect(link?.textContent?.trim()).toBe('Contact us');
  });

  it('takes a page’s own wording', async () => {
    const fixture = await create();
    fixture.componentRef.setInput('heading', 'cta.sand.heading');
    fixture.componentRef.setInput('body', 'cta.sand.body');
    fixture.componentRef.setInput('action', 'cta.sand.action');
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2')?.textContent?.trim()).toBe('Need sand for your project?');
    expect(el.querySelector('a')?.textContent?.trim()).toBe('Request a quote');
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/en/contact-us');
  });
});
