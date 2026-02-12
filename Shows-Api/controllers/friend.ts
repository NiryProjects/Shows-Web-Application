import { NextFunction, Request, Response } from "express";
import Friend from "../models/Friend";
import Show from "../models/Show";
import User from "../models/User";
import { isUsernameValid } from "../src/utils/validators";

// ─── Types ──────────────────────────────────────────────────────────────────

/** A lean Show document pulled from Mongoose */
type ShowDocument = Awaited<ReturnType<typeof Show.findOne>>;

// ─── Handlers ───────────────────────────────────────────────────────────────

export const SearchFindUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const friendname = req.params.friendname as string;

    if (!isUsernameValid(friendname)) {
      res.status(400).json({ message: "username not in the right format!" });
      return;
    }

    const usernameId = req.userData!.userId;
    const friend = await User.findOne({ username: friendname });
    const userFriends = await Friend.findOne({ usernameId });

    if (
      userFriends &&
      friend &&
      userFriends.friends.findIndex(
        (fri) => fri.friendUsername === friendname
      ) >= 0
    ) {
      res.status(400).json({
        message: "Friend already in your friends list.",
        found: false,
      });
      return;
    }

    if (friend) {
      res.status(200).json({
        message: "Found Friend :)",
        found: true,
        friendId: friend._id,
      });
    } else {
      res.status(200).json({
        message: "No Friend Around ...",
        found: false,
      });
    }
  } catch (error: unknown) {
    res.status(500).json({
      message: "No Friend Around ...",
      found: false,
      error,
    });
  }
};

export const AddFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const friendUsername = req.params.friendname as string;
    const usernameId = req.userData!.userId;
    const friendId: string = req.body.friendId;

    const userHaveInitFriends = await Friend.findOne({ usernameId });

    if (userHaveInitFriends) {
      (userHaveInitFriends.friends as any[]).push({ friendUsername, friendId });
      const result = await userHaveInitFriends.save();
      res.status(200).json({
        message: "Already created row . added to friendslist.",
        result,
      });
      return;
    }

    const friend = new Friend({
      usernameId,
      friends: [{ friendUsername, friendId }],
    });

    const result = await friend.save();
    res.status(201).json({ message: "success", result });
  } catch (error: unknown) {
    res.status(500).json({ message: "error in save friend", error });
  }
};

export const GetFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usernameId = req.userData!.userId;
    const userFriends = await Friend.findOne({ usernameId });

    if (userFriends) {
      res.status(200).json({
        message: "Found user friends.",
        friends: userFriends.friends,
      });
    } else {
      res.status(200).json({
        message: "No friends to share",
        friends: [],
      });
    }
  } catch (error: unknown) {
    res.status(401).json({ message: "No friends to share", error });
  }
};

export const GetFriendsShows = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const friendId = req.params.friendId;
    const userFriendsShows = await Show.find({ creator: friendId });

    if (userFriendsShows) {
      res.status(200).json({
        message: "Found user friends.",
        shows: userFriendsShows,
      });
    } else {
      res.status(401).json({
        message: "No friends to share",
        error: "No friends to share",
      });
    }
  } catch (error: unknown) {
    res.status(401).json({ message: "No friends to share", error });
  }
};

// ─── Set Operations (Joint / Different / Union) ────────────────────────────

export const GetJointShows = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usernameId = req.userData!.userId;
    const myShows = await Show.find({ creator: usernameId });
    const myMap = new Map<string, ShowDocument>();

    myShows.forEach((show) => myMap.set(show.title, show));

    const friendId = req.params.friendId;
    const friendShows = await Show.find({ creator: friendId });
    const friendMap = new Map<string, ShowDocument>();

    friendShows.forEach((show) => friendMap.set(show.title, show));

    const jointShows: ShowDocument[] = [];
    friendMap.forEach((value, key) => {
      if (myMap.has(key)) jointShows.push(value);
    });

    res.status(200).json({
      message: "Found user joint me and friend.",
      shows: jointShows,
    });
  } catch (error: unknown) {
    res.status(401).json({ message: "No joint shows share", error });
  }
};

export const GetDifferentShows = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usernameId = req.userData!.userId;
    const myShows = await Show.find({ creator: usernameId });
    const myMap = new Map<string, ShowDocument>();

    myShows.forEach((show) => myMap.set(show.title, show));

    const friendId = req.params.friendId;
    const friendShows = await Show.find({ creator: friendId });
    const friendMap = new Map<string, ShowDocument>();

    friendShows.forEach((show) => friendMap.set(show.title, show));

    const diffShows: ShowDocument[] = [];
    myMap.forEach((value, key) => {
      if (!friendMap.has(key)) diffShows.push(value);
    });
    friendMap.forEach((value, key) => {
      if (!myMap.has(key)) diffShows.push(value);
    });

    res.status(200).json({
      message: "Found user joint me and friend.",
      shows: diffShows,
    });
  } catch (error: unknown) {
    res.status(401).json({ message: "No joint shows share", error });
  }
};

export const GetUnionShows = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usernameId = req.userData!.userId;
    const myShows = await Show.find({ creator: usernameId });
    const unionMap = new Map<string, ShowDocument>();

    myShows.forEach((show) => unionMap.set(show.title, show));

    const friendId = req.params.friendId;
    const friendShows = await Show.find({ creator: friendId });

    friendShows.forEach((show) => unionMap.set(show.title, show));

    const unionShows = [...unionMap.values()];

    res.status(200).json({
      message: "Found user joint me and friend.",
      shows: unionShows,
    });
  } catch (error: unknown) {
    res.status(401).json({ message: "No joint shows share", error });
  }
};
