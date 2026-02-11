/**
 * Typed wrapper around the static movie/TV data in dataObj.js.
 * The raw data lives in the original JS file (5 500+ lines);
 * this module re-exports it with proper TypeScript types.
 */

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

export interface DataObj {
  movies: { items: MovieItem[] };
  tv: { items: MovieItem[] };
}

// Import raw JS data and cast to typed shape
const rawData = require("../../dataObj");
export const dataObj: DataObj = rawData.dataObj;
