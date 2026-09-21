# web-view patterns

Complete, compile-checked examples for each kind of file, shown as one small "employees"
feature plus the core pieces it needs. Copy the shape and rename. Don't copy the domain
(Employee, Status). The files depend on each other the way a real feature would.

Contents
1. Models: shared response wrapper, shared enum, feature models
2. Feature API service (HttpClient → Observable)
3. Routed list page (rxResource, @if/@for, pagination signal)
4. Routed detail page (route param as input)
5. Presentational child component (input/output/computed, inline template)
6. Shared UI component (host bindings)
7. Reactive form page (typed, nonNullable)
8. Feature routes + wiring into app.routes.ts
9. Core: signal-based auth store, functional guard
10. Core: functional interceptors + registering them in app.config.ts
11. Pipe
12. Unit test (Vitest + TestBed, zoneless)

---

## 1. Models

### `src/app/shared/models/responses/api-response.ts`

```ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### `src/app/shared/models/enums/status.ts`

```ts
export enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}
```

Types used by only one feature stay in that feature:

### `src/app/features/employees/employee.models.ts`

```ts
import { Status } from '@shared/models/enums/status';

export interface Employee {
  id: number;
  name: string;
  email: string;
  status: Status;
}

export type EmployeeInput = Omit<Employee, 'id'>;
```

## 2. Feature API service

Return Observables and unwrap the response envelope here, so components only see domain types.
Use relative URLs. `apiUrlInterceptor` (section 10) adds `environment.api_url`.

### `src/app/features/employees/employee-api.ts`

```ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse, PagedResponse } from '@shared/models/responses/api-response';
import { Employee, EmployeeInput } from './employee.models';

@Injectable({ providedIn: 'root' })
export class EmployeeApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'employees';

  list(page: number, pageSize: number): Observable<PagedResponse<Employee>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http
      .get<ApiResponse<PagedResponse<Employee>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  get(id: number): Observable<Employee> {
    return this.http
      .get<ApiResponse<Employee>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(body: EmployeeInput): Observable<Employee> {
    return this.http
      .post<ApiResponse<Employee>>(this.baseUrl, body)
      .pipe(map((res) => res.data));
  }
}
```

## 3. Routed list page

`rxResource` re-runs `stream` whenever a signal read in `params` changes. It exposes
`value()`, `isLoading()`, `error()` and `reload()`, so you don't need manual `subscribe` or
loading flags.

### `src/app/features/employees/employee-list/employee-list.ts`

```ts
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EmployeeApi } from '../employee-api';
import { EmployeeCard } from '../employee-card/employee-card';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, EmployeeCard],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList {
  private readonly api = inject(EmployeeApi);

  protected readonly page = signal(1);
  protected readonly pageSize = 20;

  protected readonly employees = rxResource({
    params: () => ({ page: this.page() }),
    stream: ({ params }) => this.api.list(params.page, this.pageSize),
  });

  protected nextPage(): void {
    this.page.update((p) => p + 1);
  }
}
```

### `src/app/features/employees/employee-list/employee-list.html`

```html
<a routerLink="new">New employee</a>

@if (employees.isLoading()) {
  <p>Loading…</p>
} @else if (employees.error()) {
  <p class="error">Could not load employees.</p>
  <button type="button" (click)="employees.reload()">Retry</button>
} @else {
  @for (employee of employees.value()?.items ?? []; track employee.id) {
    <app-employee-card [employee]="employee" [routerLink]="[employee.id]" />
  } @empty {
    <p>No employees yet.</p>
  }
  <button type="button" (click)="nextPage()">Next</button>
}
```

### `src/app/features/employees/employee-list/employee-list.scss`

```scss
@use 'variables' as *;

.error {
  color: red;
}
```

## 4. Routed detail page

Route params, query params and resolved data arrive as `input()`s because
`withComponentInputBinding()` is on. The input name must match the param name.

### `src/app/features/employees/employee-detail/employee-detail.ts`

```ts
import { Component, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EmployeeApi } from '../employee-api';

@Component({
  selector: 'app-employee-detail',
  template: `
    @if (employee.value(); as e) {
      <h2>{{ e.name }}</h2>
      <p>{{ e.email }}</p>
    }
  `,
})
export class EmployeeDetail {
  private readonly api = inject(EmployeeApi);

  readonly id = input.required({ transform: numberAttribute });

  protected readonly employee = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.api.get(id),
  });
}
```

## 5. Presentational child component

No services. Data comes in through `input()` and events go out through `output()`. Inline
templates are fine for small components.

### `src/app/features/employees/employee-card/employee-card.ts`

```ts
import { Component, computed, input, output } from '@angular/core';
import { StatusBadge } from '@shared/ui/status-badge/status-badge';
import { Employee } from '../employee.models';

@Component({
  selector: 'app-employee-card',
  imports: [StatusBadge],
  template: `
    <h3>{{ employee().name }}</h3>
    <p>{{ initials() }} · {{ employee().email }}</p>
    <app-status-badge [status]="employee().status" />
    <button type="button" (click)="remove.emit(employee().id)">Remove</button>
  `,
  host: { class: 'card' },
})
export class EmployeeCard {
  readonly employee = input.required<Employee>();
  readonly remove = output<number>();

  protected readonly initials = computed(() =>
    this.employee()
      .name.split(' ')
      .map((part) => part[0])
      .join(''),
  );
}
```

## 6. Shared UI component

Put host bindings in `host: {}` (not `@HostBinding`). Expose an enum to the template through a
`protected readonly` field.

### `src/app/shared/ui/status-badge/status-badge.ts`

```ts
import { Component, input } from '@angular/core';
import { Status } from '@shared/models/enums/status';

@Component({
  selector: 'app-status-badge',
  template: `{{ status() }}`,
  host: {
    '[class.active]': 'status() === Status.Active',
  },
})
export class StatusBadge {
  readonly status = input.required<Status>();
  protected readonly Status = Status;
}
```

## 7. Reactive form page

Use a typed, non-nullable `FormBuilder`. For a one-off action, `subscribe` and write the
outcome to a signal. That's the one place a manual `subscribe` is expected.

### `src/app/features/employees/employee-form/employee-form.ts`

```ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Status } from '@shared/models/enums/status';
import { EmployeeApi } from '../employee-api';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <label>Name <input formControlName="name" /></label>
      <label>Email <input type="email" formControlName="email" /></label>
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
      <button type="submit" [disabled]="form.invalid || saving()">Save</button>
    </form>
  `,
})
export class EmployeeForm {
  private readonly api = inject(EmployeeApi);
  private readonly router = inject(Router);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    status: [Status.Active],
  });
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set(null);
    this.api.create(this.form.getRawValue()).subscribe({
      next: (created) => this.router.navigate(['/employees', created.id]),
      error: () => {
        this.error.set('Could not save. Please try again.');
        this.saving.set(false);
      },
    });
  }
}
```

## 8. Feature routes

The routes file has a default export, so `loadChildren` needs no `.then()`. Put static paths
(`new`) before param paths (`:id`).

### `src/app/features/employees/employees.routes.ts`

```ts
import { Routes } from '@angular/router';

export default [
  {
    path: '',
    title: 'Employees',
    loadComponent: () => import('./employee-list/employee-list').then((m) => m.EmployeeList),
  },
  {
    path: 'new',
    title: 'New employee',
    loadComponent: () => import('./employee-form/employee-form').then((m) => m.EmployeeForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./employee-detail/employee-detail').then((m) => m.EmployeeDetail),
  },
] satisfies Routes;
```

### `src/app/app.routes.ts`

```ts
import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'employees' },
  {
    path: 'employees',
    canActivate: [authGuard],
    loadChildren: () => import('@features/employees/employees.routes'),
  },
];
```

## 9. Core: auth store and guard

A store is a root service that holds signals. Expose read-only views and mutate state only
through its methods.

### `src/app/core/auth/auth-store.ts`

```ts
import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly token = signal<string | null>(null);

  readonly accessToken = this.token.asReadonly();
  readonly isAuthenticated = computed(() => this.token() !== null);

  signIn(token: string): void {
    this.token.set(token);
  }

  signOut(): void {
    this.token.set(null);
  }
}
```

Guards return `true` or a `UrlTree` (redirect). Don't call `router.navigate` inside a guard.

### `src/app/core/auth/auth-guard.ts`

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth-store';

export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthStore).isAuthenticated()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
```

## 10. Core: interceptors

### `src/app/core/http/api-url-interceptor.ts`

```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';

/** Prefixes relative request URLs with environment.api_url. */
export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//.test(req.url) || req.url.startsWith('/')) {
    return next(req);
  }
  const base = environment.api_url.replace(/\/$/, '');
  return next(req.clone({ url: `${base}/${req.url}` }));
};
```

### `src/app/core/http/auth-interceptor.ts`

```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '@core/auth/auth-store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStore).accessToken();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};
```

Order matters: interceptors run in array order on the request.

### `src/app/app.config.ts`

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { apiUrlInterceptor } from '@core/http/api-url-interceptor';
import { authInterceptor } from '@core/http/auth-interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([apiUrlInterceptor, authInterceptor])),
  ],
};
```

## 11. Pipe

Pipes are pure by default. Keep them pure and put them in `shared/ui` if they're generic.

### `src/app/shared/ui/initials-pipe.ts`

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return (value ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0]!.toUpperCase())
      .join('');
  }
}
```

## 12. Unit test

The tests use Vitest globals (`describe`, `it`, `expect`, `vi`). Use `provideHttpClientTesting()`
with `HttpTestingController` to fake the backend. Use `await fixture.whenStable()` (zoneless),
not `fakeAsync` or `tick`.

### `src/app/features/employees/employee-list/employee-list.spec.ts`

```ts
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Status } from '@shared/models/enums/status';
import { EmployeeList } from './employee-list';

describe('EmployeeList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployeeList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('renders employees from the API', async () => {
    const fixture = TestBed.createComponent(EmployeeList);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    http.expectOne((req) => req.url === 'employees').flush({
      data: {
        items: [{ id: 1, name: 'Sok Dara', email: 'dara@example.com', status: Status.Active }],
        total: 1,
        page: 1,
        pageSize: 20,
      },
    });
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Sok Dara');
    http.verify();
  });
});
```
