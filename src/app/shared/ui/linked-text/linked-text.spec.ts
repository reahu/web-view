import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LinkedText } from './linked-text';

describe('LinkedText', () => {
  let fixture: ComponentFixture<LinkedText>;
  let el: HTMLElement;

  const render = async (text: string) => {
    fixture.componentRef.setInput('text', text);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedText],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedText);
    fixture.componentRef.setInput('path', '/contact-us');
    el = fixture.nativeElement;
  });

  it('links the marked words, in the current language', async () => {
    await render('Write to us through our <a>contact form</a>.');
    expect(el.textContent).toBe('Write to us through our contact form.');
    const link = el.querySelector('a')!;
    expect(link.textContent).toBe('contact form');
    expect(link.getAttribute('href')).toBe('/en/contact-us');
  });

  it('puts the link wherever the translation has it', async () => {
    await render('សំណួរ អាចផ្ញើតាម<a>ទម្រង់ទំនាក់ទំនង</a>របស់យើង។');
    expect(el.querySelector('a')?.textContent).toBe('ទម្រង់ទំនាក់ទំនង');
    expect(el.textContent).toBe('សំណួរ អាចផ្ញើតាមទម្រង់ទំនាក់ទំនងរបស់យើង។');
  });
});
