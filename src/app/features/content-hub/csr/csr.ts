import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'rg-csr',
  styleUrl: './csr.scss',
  templateUrl: './csr.html',
})
export class Csr {
  // Placeholder focus areas; confirm with the client.
  protected readonly areas = [
    { title: 'Education', text: 'Placeholder copy. Scholarships, schools and training.' },
    { title: 'Health', text: 'Placeholder copy. Support for clinics and health campaigns.' },
    { title: 'Environment', text: 'Placeholder copy. Conservation and clean-up programmes.' },
    { title: 'Community', text: 'Placeholder copy. Disaster relief and local development.' },
  ];
}
