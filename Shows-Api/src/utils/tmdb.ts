import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Define strict types for TMDB responses
interface TmdbResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  original_title?: string; // Movies
  original_name?: string;  // TV
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;   // Movies
  first_air_date?: string; // TV
  overview?: string;
}

interface AppShow {
  title: string;
  img: string;
  rating: number;
  year: string;
  apiId: string;
  type: "movie" | "tv";
}

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    accept: "application/json",
  },
});

export const searchMulti = async (query: string): Promise<AppShow[]> => {
  try {
    const response = await tmdbClient.get("/search/multi", {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page: 1,
      },
    });

    const results: TmdbResult[] = response.data.results;

    // Transform TMDB results to our AppShow format
    const transformedShows: AppShow[] = results
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map((item) => {
        const title = item.original_title || item.original_name || "Unknown Title";
        const img = item.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
          : "https://placehold.co/500x750?text=No+Image"; // Fallback image

        // Handle ratings (round to 1 decimal)
        const rating = item.vote_average ? Math.round(item.vote_average * 10) / 10 : 0;

        // Parse year
        const dateStr = item.release_date || item.first_air_date || "";
        const year = dateStr.slice(0, 4) || "N/A";

        return {
          title,
          img,
          rating,
          year,
          apiId: item.id.toString(),
          type: item.media_type as "movie" | "tv",
        };
      });

    return transformedShows;
  } catch (error) {
    console.error("TMDB API Error:", error instanceof Error ? error.message : error);
    throw error; // Let the controller handle the fallback
  }
};

export const getShowDetails = async (
  apiId: string,
  type: "movie" | "tv"
): Promise<{ minutes?: number; seasons?: number }> => {
  try {
    const endpoint = type === "movie" ? `/movie/${apiId}` : `/tv/${apiId}`;
    const response = await tmdbClient.get(endpoint);
    const data = response.data;

    if (type === "movie") {
      return { minutes: data.runtime || 0 };
    } else {
      return { seasons: data.number_of_seasons || 0 };
    }
  } catch (error) {
    console.error(`TMDB Details Error (${type}/${apiId}):`, error instanceof Error ? error.message : error);
    return type === "movie" ? { minutes: 0 } : { seasons: 0 }; // Fail safe
  }
};

export default {
  searchMulti,
  getShowDetails,
};
