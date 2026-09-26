import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CONTACT_DEMO, CONTACT_SENDER, ContactMessage } from './contact-sender';
import { Contact } from './contact';

describe('Contact', () => {
  let fixture: ComponentFixture<Contact>;
  let el: HTMLElement;
  let send: ReturnType<typeof vi.fn<(message: ContactMessage) => Promise<void>>>;

  const input = (id: string) =>
    el.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`#contact-${id}`)!;
  const type = (id: string, value: string) => {
    const field = input(id);
    field.value = value;
    field.dispatchEvent(new Event(field instanceof HTMLSelectElement ? 'change' : 'input'));
  };
  const submit = async () => {
    el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  };
  const fillValid = () => {
    type('name', 'Sokha Chan');
    type('email', 'sokha@example.com');
    type('message', 'Hello');
  };

  // Most tests describe the form connected to a real service; demo mode has its own tests.
  const setup = async (demo: boolean) => {
    send = vi.fn<(message: ContactMessage) => Promise<void>>();
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [
        { provide: CONTACT_SENDER, useValue: send },
        { provide: CONTACT_DEMO, useValue: demo },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    el = fixture.nativeElement;
    document.body.appendChild(el);
    await fixture.whenStable();
  };

  beforeEach(() => setup(false));

  afterEach(() => el.remove());

  it('preselects the topic from the query parameter and ignores unknown ones', async () => {
    fixture.componentRef.setInput('topic', 'quote');
    await fixture.whenStable();
    expect(input('topic').value).toBe('quote');

    fixture.componentRef.setInput('topic', 'nonsense');
    await fixture.whenStable();
    expect(input('topic').value).toBe('quote');
  });

  it('shows no errors before the user submits', () => {
    expect(el.querySelector('.error-summary')).toBeNull();
    expect(el.querySelector('[aria-invalid="true"]')).toBeNull();
  });

  it('summarises errors in page order and focuses the summary', async () => {
    await submit();

    const summary = el.querySelector<HTMLElement>('.error-summary')!;
    const messages = [...summary.querySelectorAll('button')].map((b) => b.textContent?.trim());
    expect(messages).toEqual(['Enter your name', 'Enter your email address', 'Enter your message']);
    expect(document.activeElement).toBe(summary);
    expect(send).not.toHaveBeenCalled();

    expect(input('name').getAttribute('aria-invalid')).toBe('true');
    expect(input('name').getAttribute('aria-describedby')).toBe('contact-name-error');
    expect(input('organisation').hasAttribute('aria-invalid')).toBe(false);
  });

  it('moves focus to a field from its summary link', async () => {
    await submit();
    el.querySelectorAll<HTMLButtonElement>('.error-summary button')[1].click();
    expect(document.activeElement).toBe(input('email'));
  });

  it('checks the email format', async () => {
    fillValid();
    type('email', 'not-an-email');
    await submit();

    expect(el.querySelector('#contact-email-error')?.textContent).toContain('correct format');
    expect(send).not.toHaveBeenCalled();
  });

  it('sends a valid message, confirms it and clears the form', async () => {
    send.mockResolvedValue();
    fixture.componentRef.setInput('topic', 'partnerships');
    await fixture.whenStable();
    fillValid();
    await submit();

    expect(send).toHaveBeenCalledWith({
      name: 'Sokha Chan',
      email: 'sokha@example.com',
      organisation: '',
      topic: 'partnerships',
      message: 'Hello',
    });
    const notice = el.querySelector<HTMLElement>('.notice--success')!;
    expect(notice.textContent).toContain('has been sent');
    expect(document.activeElement).toBe(notice);
    expect(input('name').value).toBe('');
    expect(input('topic').value).toBe('partnerships');
    expect(el.querySelector('[aria-invalid="true"]')).toBeNull();
  });

  it('keeps the answers and says so when sending fails', async () => {
    send.mockRejectedValue(new Error('offline'));
    fillValid();
    await submit();

    const notice = el.querySelector<HTMLElement>('.notice--error')!;
    expect(notice.textContent).toContain("couldn't be sent");
    expect(document.activeElement).toBe(notice);
    expect(input('name').value).toBe('Sokha Chan');
  });

  it('fails honestly by default outside demo mode, with no endpoint configured', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: CONTACT_DEMO, useValue: false }] });
    const real = TestBed.createComponent(Contact);
    const host: HTMLElement = real.nativeElement;
    await real.whenStable();
    const set = (id: string, value: string) => {
      const field = host.querySelector<HTMLInputElement>(`#contact-${id}`)!;
      field.value = value;
      field.dispatchEvent(new Event('input'));
    };
    set('name', 'A');
    set('email', 'a@example.com');
    set('message', 'Hi');
    host.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await real.whenStable();

    expect(host.querySelector('.notice--error')).not.toBeNull();
    expect(host.querySelector('.notice--success')).toBeNull();
  });

  describe('demo mode', () => {
    beforeEach(async () => {
      el.remove();
      TestBed.resetTestingModule();
      await setup(true);
    });

    it('says up front that messages are not sent', () => {
      expect(el.querySelector('.demo-note')?.textContent).toContain('demo');
    });

    it('never claims a message was sent', async () => {
      send.mockResolvedValue();
      fillValid();
      await submit();

      const notice = el.querySelector<HTMLElement>('.notice--demo')!;
      expect(notice.textContent).toContain('was not sent');
      expect(document.activeElement).toBe(notice);
      expect(el.querySelector('.notice--success')).toBeNull();
    });
  });

  it('labels sample contact details and does not link their phone or email', () => {
    expect(el.querySelector('.sample-tag')).not.toBeNull();
    expect(el.querySelector('.details a[href^="tel:"], .details a[href^="mailto:"]')).toBeNull();
    expect(el.querySelector('.details')?.textContent).toContain('+855 00 000 000');
  });
});
