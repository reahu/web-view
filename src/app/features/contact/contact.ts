import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  FieldTree,
  FormField,
  FormRoot,
  email,
  form,
  maxLength,
  required,
} from '@angular/forms/signals';
import { ContentService } from '@core/services/content.service';
import {
  CONTACT_DEMO,
  CONTACT_SENDER,
  CONTACT_TOPICS,
  ContactMessage,
  isContactTopic,
} from './contact-sender';

const EMPTY: ContactMessage = {
  name: '',
  email: '',
  organisation: '',
  topic: 'general',
  message: '',
};

/** Field order for the error summary; matches the order on the page. */
const FIELDS = ['name', 'email', 'organisation', 'topic', 'message'] as const;
type FieldKey = (typeof FIELDS)[number];

@Component({
  imports: [FormRoot, FormField],
  selector: 'rg-contact',
  styleUrl: './contact.scss',
  templateUrl: './contact.html',
})
export class Contact {
  /** From the ?topic= query parameter, e.g. /contact-us?topic=quote. */
  readonly topic = input<string>();

  private readonly send = inject(CONTACT_SENDER);
  /** A demo form says plainly that nothing was sent. */
  protected readonly demo = inject(CONTACT_DEMO);
  protected readonly details = inject(ContentService).contactDetails;
  private readonly injector = inject(Injector);
  private readonly summary = viewChild<ElementRef<HTMLElement>>('summary');
  private readonly statusMessage = viewChild<ElementRef<HTMLElement>>('statusMessage');

  protected readonly topics = CONTACT_TOPICS;
  protected readonly status = signal<'idle' | 'sent' | 'failed'>('idle');
  protected readonly showSummary = signal(false);

  private readonly model = signal<ContactMessage>({ ...EMPTY });

  protected readonly contactForm = form(
    this.model,
    (path) => {
      required(path.name, { message: $localize`:@@contact.error.nameRequired:Enter your name` });
      required(path.email, {
        message: $localize`:@@contact.error.emailRequired:Enter your email address`,
      });
      email(path.email, {
        message: $localize`:@@contact.error.emailFormat:Enter an email address in the correct format, like name@example.com`,
      });
      maxLength(path.organisation, 200, {
        message: $localize`:@@contact.error.organisationLength:Organisation must be 200 characters or fewer`,
      });
      required(path.message, {
        message: $localize`:@@contact.error.messageRequired:Enter your message`,
      });
      maxLength(path.message, 3000, {
        message: $localize`:@@contact.error.messageLength:Message must be 3,000 characters or fewer`,
      });
    },
    {
      submission: {
        action: async (field) => {
          this.showSummary.set(false);
          try {
            await this.send(field().value());
            this.status.set('sent');
            field().reset({ ...EMPTY, topic: field.topic().value() });
          } catch {
            this.status.set('failed');
          }
          this.focusAfterRender(this.statusMessage);
          return undefined;
        },
        onInvalid: () => {
          this.status.set('idle');
          this.showSummary.set(true);
          this.focusAfterRender(this.summary);
        },
      },
    },
  );

  /** First error of each invalid field, in page order. */
  protected readonly errors = computed(() =>
    FIELDS.flatMap((key) => {
      const error = this.field(key)().errors()[0];
      return error
        ? [
            {
              key,
              message: error.message ?? $localize`:@@contact.error.fallback:Check this answer`,
            },
          ]
        : [];
    }),
  );

  constructor() {
    effect(() => {
      const topic = this.topic();
      if (isContactTopic(topic)) {
        untracked(() => this.contactForm.topic().value.set(topic));
      }
    });
  }

  protected hasError(field: FieldTree<string>): boolean {
    return field().touched() && field().invalid();
  }

  protected errorOf(field: FieldTree<string>): string {
    return field().errors()[0]?.message ?? '';
  }

  protected focusField(key: FieldKey): void {
    this.field(key)().focusBoundControl();
  }

  private field(key: FieldKey): FieldTree<string> {
    return this.contactForm[key];
  }

  private focusAfterRender(target: () => ElementRef<HTMLElement> | undefined): void {
    afterNextRender(() => target()?.nativeElement.focus(), { injector: this.injector });
  }
}
