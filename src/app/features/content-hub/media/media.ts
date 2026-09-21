import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { VideoFacade } from '@shared/ui/video-facade/video-facade';

@Component({
  imports: [RouterLink, VideoFacade],
  selector: 'rg-media',
  styleUrl: './media.scss',
  templateUrl: './media.html',
})
export class Media {
  protected readonly videos = inject(ContentService).videos;
}
