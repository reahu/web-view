import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ExternalLink } from './external-link';

@Component({
  imports: [ExternalLink],
  template: `<rg-external-link href="https://example.com" linkClass="button">Example</rg-external-link>`,
})
class Host {}

describe('ExternalLink', () => {
  it('opens in a new tab safely and says so', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const a = (fixture.nativeElement as HTMLElement).querySelector('a')!;

    expect(a.getAttribute('href')).toBe('https://example.com');
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    expect(a.classList).toContain('button');
    expect(a.textContent?.replace(/\s+/g, ' ').trim()).toBe('Example (opens in a new tab)');
    expect(a.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
});
