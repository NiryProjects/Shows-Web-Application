import { NextFunction, Request, Response } from "express";
import { dataObj } from "../src/data/staticData";

export const GetShowsGameMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const movies = dataObj.movies;
  res.status(200).json({ msg: "Okay", dataObj: movies });
};

export const GetShowsGameTv = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const tv = dataObj.tv;
  res.status(200).json({ msg: "Okay", dataObj: tv });
};
