import axios from "axios";
import { NextFunction, Request, Response } from "express";

let numberOfTrys = 1;

/**
 * Mock polling handler that periodically queries an exchange rate API.
 */
export const testingPollOnlyXTimes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let rateCAN = 1.0;
  let rateEuro = 1.0;

  numberOfTrys++;

  if (numberOfTrys % 3 == 0) {
    try {
      // req from rate api
      const response = await axios.get("https://open.er-api.com/v6/latest/USD");
      rateCAN = response.data.rates.CAD;
      rateEuro = response.data.rates.EUR;
    } catch (e) {
      console.log({
        message: "oops :(",
        error: e,
      });
    }

    numberOfTrys = 1;
  }

  res.status(200).json({
    rateCAN,
    rateEuro,
  });
};

/**
 * Handler to test external IMDB search APIs.
 */
export const TestExternalApis = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // const iUseApi = false;
  const iUseApi = true;

  if (iUseApi) {
    try {
      const searchShow = req.params.searchShow;
      const urlApi = `https://imdb-api.com/en/API/Search/${process.env.ApiKey}/${searchShow}`;

      // req from search api
      const response = await axios.get(urlApi);
      const responseApi = response.data;

      res.status(200).json({
        health: "Online ! :)",
        responseApi,
      });
    } catch (e) {
      console.log({
        message: "oops :(",
        error: e,
      });
      res.status(500).json({ message: "oops :(", error: e });
    }
  } else {
    console.log(" -- Not from the Api -----");

    res.status(200).json({
      health: "Online ! :)",
      responseApi: {
        searchType: "Title",
        expression: "inception 2010",
        results: [
          {
            id: "tt1375666",
            resultType: "Title",
            image:
              "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_Ratio0.6800_AL_.jpg",
            title: "Inception",
            description: "(2010)",
          },
          // ... (truncated for brevity in actual file content)
        ],
        errorMessage: "",
      },
    });
  }
};

/**
 * Basic middleware test endpoint.
 */
export const testingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(200).json({
    msg: "After the middleware :)",
  });
};
