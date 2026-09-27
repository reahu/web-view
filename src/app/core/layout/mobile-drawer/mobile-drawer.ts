import { CdkTrapFocus } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate-pipe';

/** Keep in sync with $md in src/styles/_breakpoints.scss. */
const COMPACT_QUERY = '(max-width: 59.99rem)';

/**
 * Wraps content that sits inline on wide screens and becomes a modal side panel on
 * compact screens. The projected markup is the same at every width.
 */
@Component({
  imports: [CdkTrapFocus, TranslatePipe],
  selector: 'rg-mobile-drawer',
  styleUrl: './mobile-drawer.scss',
  templateUrl: './mobile-drawer.html',
  host: {
    '[class.is-open]': 'open()',
    '(keydown.escape)': 'dismiss()',
    '(click)': 'onHostClick($event)',
  },
})
export class MobileDrawer {
  readonly open = model(false);
  /** Accessible name for the panel while it acts as a dialog. */
  readonly label = input('Menu');
  /** Emits when the user closes the drawer (Escape, close button, backdrop). */
  readonly dismissed = output<void>();

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  /** True below the md breakpoint. Only known in the browser. */
  protected readonly compact = signal(false);
  protected readonly modal = computed(() => this.open() && this.compact());

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (typeof matchMedia !== 'function') {
        return;
      }
      const query = matchMedia(COMPACT_QUERY);
      const update = () => {
        this.compact.set(query.matches);
        if (!query.matches) {
          this.open.set(false);
        }
      };
      update();
      query.addEventListener('change', update);
      destroyRef.onDestroy(() => query.removeEventListener('change', update));
    });

    afterRenderEffect(() => {
      const modal = this.modal();
      document.documentElement.classList.toggle('scroll-locked', modal);
      if (modal) {
        this.closeButton().nativeElement.focus();
      }
    });

    destroyRef.onDestroy(() => document.documentElement.classList.remove('scroll-locked'));
  }

  dismiss(): void {
    if (!this.open()) {
      return;
    }
    this.open.set(false);
    this.dismissed.emit();
  }

  /** The host is the backdrop while open; a click on it (not the panel) closes. */
  protected onHostClick(event: MouseEvent): void {
    if (event.target === this.host) {
      this.dismiss();
    }
  }
}
