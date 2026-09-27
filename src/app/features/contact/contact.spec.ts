import { TestBed } from '@angular/core/testing';
import { Contact } from './contact';

describe('Contact', () => {
  it('links the phone, WhatsApp and map, and leaves out rows with no details yet', async () => {
    await TestBed.configureTestingModule({ imports: [Contact] }).compileComponents();
    const fixture = TestBed.createComponent(Contact);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const hrefs = [...el.querySelectorAll('.details a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('tel:+85585886336');
    expect(hrefs).toContain('https://wa.me/85585886336');
    expect(hrefs).toContain('https://maps.app.goo.gl/3E3FKrWdcBAqes5j9');
    expect(el.querySelector('.details a[href^="mailto:"]')).toBeNull();
    expect(el.querySelector('form')).toBeNull();
  });
});
