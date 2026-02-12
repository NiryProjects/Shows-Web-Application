export interface Show {
  id: string;
  title: string;
  img: string;
  rating: number;
  review: string; // "true" or "false" string in DB (legacy) or actual text review
  seasons: number;
  minutes: number;
  type: string; // "tv" | "movie"
  apiId: string;
  creator: string; // UserId
}

export interface MovieItem {
  id: string;
  rank: string;
  title: string;
  fullTitle: string;
  year: string;
  image: string;
  crew: string;
  imDbRating: string;
  imDbRatingCount: string;
}
