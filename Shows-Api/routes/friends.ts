import express from "express";
import * as FriendController from "../controllers/friend";
import checkAuth from "../middleware/check-auth";

const router = express.Router();

router.get("/search/:friendname", checkAuth, FriendController.SearchFindUser);

router.post("/:friendname", checkAuth, FriendController.AddFriend);

router.get("", checkAuth, FriendController.GetFriends);

router.get("/:friendId", checkAuth, FriendController.GetFriendsShows);

router.get("/joint/:friendId", checkAuth, FriendController.GetJointShows);

router.get("/different/:friendId", checkAuth, FriendController.GetDifferentShows);

router.get("/union/:friendId", checkAuth, FriendController.GetUnionShows);

export default router;
