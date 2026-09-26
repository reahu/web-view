import { DOCUMENT, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from '@layout/footer/footer';
import { Header } from '@layout/header/header';
import { filter, map } from 'rxjs';

@Component({
  selector: 'rg-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  /**
   * With a <base href> a bare "#main" would resolve to the language's home page, so the
   * skip link points at the current path, including the base ("/en/…" in English).
   */
  protected readonly skipHref = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.mainHref()),
    ),
    { initialValue: this.mainHref() },
  );

  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.document.getElementById('main')?.focus();
  }

  private mainHref(): string {
    return `${this.location.prepareExternalUrl(this.router.url.split(/[?#]/, 1)[0])}#main`;
  }
}
