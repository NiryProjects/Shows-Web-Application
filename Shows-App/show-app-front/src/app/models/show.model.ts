export interface Show {
  id?: string; // Frontend ID (optional)
  _id?: string; // Backend ID
  title: string;
  img: string;
  rating: number;
  review: string;
  seasons?: number;
  minutes?: number;
  type: string; // "tv" | "movie"
  apiId: string;
  creator?: string;
}
