export interface MediaVideo {
  id: string;
  /** The 11-character YouTube video id. */
  youtubeId: string;
  title: string;
  /** Local poster image (root-relative, 16:9). Never a hotlinked thumbnail. */
  poster: string;
}
