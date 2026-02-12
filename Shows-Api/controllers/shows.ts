import axios from "axios";
import { NextFunction, Request, Response } from "express";
import Show from "../models/Show";

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface ImdbApiResponse {
  success?: boolean;
  result?: any[]; // The API returns 'result' array for search by ID
  [key: string]: any;
}

interface CreateShowBody {
  apiId: string;
  title: string;
  img: string;
  rating: string;
  review: string;
  type: string;
  seasons?: string;
  minutes?: number;
}

interface UpdateShowBody {
  review: string;
  rating: string;
}

// ─── Handlers ───────────────────────────────────────────────────────────────

export const GetUserShows = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userData!.userId;
    const myShows = await Show.find({ creator: userId });

    console.log({ creator: userId });
    console.log("ping back shows get");

    res.status(200).json({
      message: "shows :)",
      shows: myShows,
    });
  } catch (error) {
    res.status(500).json({
      message: "error !!",
      error,
    });
  }
};

export const GetUserShowByApiId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const creator = req.userData!.userId;
    const apiId = req.params.apiId;

    const show = await Show.findOne({ creator, apiId });

    console.log({ creator });
    console.log("ping back show get");

    res.status(200).json({
      message: "show :)",
      show: show,
    });
  } catch (error) {
    res.status(500).json({
      message: "error !!",
      error,
    });
  }
};

export const SearchShows = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const searchShow = req.params.searchShow;
    const urlApi = `https://api.collectapi.com/imdb/imdbSearchByName?query=${searchShow}`;

    const config = {
      headers: {
        Authorization: `${process.env.ApiKey}`,
      },
    };

    const response = await axios.get<ImdbApiResponse>(urlApi, config);
    const responseApi = response.data;

    console.log("Response?");
    console.log(responseApi);

    if (responseApi.success) {
      res.status(200).json({
        health: "Online ! :)",
        success: responseApi.success,
        responseApi,
      });
    } else {
      res.status(200).json({
        health: "Online ! :)",
        success: responseApi.success,
        responseApi: [],
      });
    }
  } catch (error: any) {
    console.error("External API Error:", error.response?.data || error.message);

    // Mock Fallback
    const mockShows = [
            { Title: "Fallout (Mock)", Year: "2024", imdbID: "tt12637874", Type: "series", Poster: "https://m.media-amazon.com/images/M/MV5MmVlYjY5YTEtNjU2My00M2Q3LWFjOWMtMzY3ZGRhMGU5ZjA1XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg" },
            { Title: "The Matrix (Mock)", Year: "1999", imdbID: "tt0133093", Type: "movie", Poster: "N/A" }
    ];

    res.status(200).json({
        health: "Online ! :) (Mock Fallback)",
        success: true,
        responseApi: { success: true, result: mockShows }
    });
  }
};

export const CreateUserShow = async (
  req: Request<any, any, CreateShowBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiId = req.body.apiId;
    const userId = req.userData!.userId;

    const showInDb = await Show.findOne({ creator: userId, apiId });

    console.log(" showInDb ", showInDb);

    if (showInDb) {
      res.status(401).json({
        message: "Show already the showlist.",
        error: "Show already the showlist.",
      });
      return;
    }

    const urlApi = `https://api.collectapi.com/imdb/imdbSearchById?movieId=${apiId}`;
    const config = {
      headers: {
        Authorization: `${process.env.ApiKey}`,
      },
    };

    // Await API call *before* creating the show document
    const showDataCall = await axios.get(urlApi, config);
    const showData = showDataCall.data.result;

    console.log("showData ", showData);

    const newShow = new Show({
      creator: userId,
      title: req.body.title,
      img: req.body.img,
      rating: req.body.rating,
      review: req.body.review,
      type: req.body.type,
      seasons: req.body.seasons,
      minutes: req.body.minutes,
      apiId: apiId,
    });

    if (newShow.type === "movie") {
        // Safe check for runtime format
      const minutes = showData?.Runtime
        ? +showData.Runtime.split(" ")[0]
        : 0;
      newShow.minutes = minutes;
    } else {
      const seasons = showData?.totalSeasons;
      newShow.seasons = seasons;
      newShow.type = "tv";
    }

    console.log(newShow);

    const response = await newShow.save();

    console.log(" Pow here and well ? ");

    res.status(201).json({
      message: "show created!",
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error !!",
      error,
    });
  }
};

export const UpdateUserShow = async (
  req: Request<any, any, UpdateShowBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiId = req.params.apiId;
    const userId = req.userData!.userId;
    const review = req.body.review;
    const rating = req.body.rating;

    if (!review || !rating || !apiId || !userId) {
      res.status(400).json({ message: "Error in parameters!" }); // Changed to 400 for bad request
      return;
    }

    const filter = { creator: userId, apiId };
    const update = { review, rating };

    const show = await Show.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });

    res.status(200).json({
      health: "Online ! :)",
      show,
    });
  } catch (error) {
    console.log("error update show ", error);
    res.status(500).json({ message: "Fetcing post failed!", error });
  }
};

export const deleteUserShow = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiId = req.params.apiId;
    const userId = req.userData!.userId;

    console.log("apiId : ", apiId);
    console.log("userId : ", userId);

    const result = await Show.deleteOne({ apiId, creator: userId });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Deletion successful!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Fetcing post failed!", error });
  }
};
