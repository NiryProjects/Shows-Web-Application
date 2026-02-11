const User = require("../models/User");
const Friend = require("../models/Friend");
const Shows = require("../models/Show");
const Validators = require("../validators");




exports.SearchFindUser = async (req, res, next) => {

    try {
        const friendname = req.params.friendname;


        if (!Validators.isUsernameValid(friendname)) {
            res.status(400).json({
                message: "username not in the right format!"
            });
            return;
        }

        const usernameId = req.userData.userId;
        const friend = await User.findOne({ username: friendname });
        const userFriends = await Friend.findOne({ usernameId });

        if (userFriends && friend &&
            userFriends
                .friends
                .findIndex(fri => fri.friendUsername === friendname) >= 0) {

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
                friendId: friend._id
            });
        } else {
            res.status(400).json({
                message: "No Friend Around ...",
                found: false
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "No Friend Around ...",
            found: false,
            error
        });
    }

};


exports.AddFriend = async (req, res, next) => {

    try {
        const friendUsername = req.params.friendname;
        const usernameId = req.userData.userId;
        const friendId = req.body.friendId;

        console.log("Here in the Addfriend controller ");
        const userHaveInitFriends = await Friend.findOne({ usernameId });

        if (userHaveInitFriends) {
            console.log("Here and created");
            // here inject my code to add more friend to this user .!!
            userHaveInitFriends.friends.push({ friendUsername, friendId });
            userHaveInitFriends.save().then(result => {
                res.status(200).json({
                    message: "Already created row . added to friendslist.",
                    result
                });
                return;

            }).catch(error => {
                res.status(400).json({
                    message: "error in save friend",
                    error
                });

                return;
            });

            return;
        }

        const friend = new Friend({ usernameId: usernameId, friends: [{ friendUsername, friendId }] });

        friend.save().then(result => {
            res.status(201).json(
                {
                    message: "success",
                    result
                });
        }).catch(error => {
            res.status(400).json({
                message: "error in save friend",
                error
            });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "error in save friend",
            error
        });
    }
}


exports.GetFriends = async (req, res, next) => {
    try {
        const usernameId = req.userData.userId;

        const userFriends = await Friend.findOne({ usernameId });

        if (userFriends) {
            res.status(200).json({
                message: "Found user friends.",
                friends: userFriends.friends
            });
        } else {
            res.status(200).json({
                message: "No friends to share",
                friends: []
                // error: "No friends to share",
            });

        }
    } catch (error) {
        res.status(401).json({
            message: "No friends to share",
            error: error
        });
    }

}


exports.GetFriendsShows = async (req, res, next) => {
    try {

        console.log("Here in friend shows and more");

        const friendId = req.params.friendId;

        const userFriendsShows = await Shows.find({ creator: friendId });

        if (userFriendsShows) {

            res.status(200).json({
                message: "Found user friends.",
                shows: userFriendsShows
            });
        } else {
            res.status(401).json({
                message: "No friends to share",
                error: "No friends to share"
            });

        }
    } catch (error) {
        res.status(401).json({
            message: "No friends to share",
            error: error
        });
    }

}

// joint
exports.GetJointShows = async (req, res, next) => {
    try {

        console.log("joint joint joint joint in friend shows and more");

        const usernameId = req.userData.userId;
        const myShows = await Shows.find({ creator: usernameId });
        const myMap = new Map();

        myShows.forEach(show => {
            myMap.set(show.title, show);
        });

        const friendId = req.params.friendId;
        const userFriendsShows = await Shows.find({ creator: friendId });

        const friendMap = new Map();

        userFriendsShows.forEach(show => {
            friendMap.set(show.title, show);
        });


        //  const jointShows = [...jointShows.values()];


        const jointShows = [];
        friendMap.forEach((value, key) => {
            if (myMap.has(key)) {
                jointShows.push(value);
            }
        });

        // console.log(myMap);
        // console.log(jointShows);


        res.status(200).json({
            message: "Found user joint me and friend.",
            shows: jointShows
        });

    } catch (error) {
        res.status(401).json({
            message: "No joint shows share",
            error: error
        });
    }

}

// Different
exports.GetDifferentShows = async (req, res, next) => {
    try {

        console.log("Different Different in friend shows and more");

        const usernameId = req.userData.userId;
        const myShows = await Shows.find({ creator: usernameId });
        const myMap = new Map();

        myShows.forEach(show => {
            myMap.set(show.title, show);
        });

        const friendId = req.params.friendId;
        const userFriendsShows = await Shows.find({ creator: friendId });

        const friendMap = new Map();

        userFriendsShows.forEach(show => {
            friendMap.set(show.title, show);
        });


        //  const jointShows = [...jointShows.values()];


        const diffShows = [];
        myMap.forEach((value, key) => {
            if (!friendMap.has(key)) {
                diffShows.push(value);
            }
        });

        friendMap.forEach((value, key) => {
            if (!myMap.has(key)) {
                diffShows.push(value);
            }
        });

        // console.log(myMap);
        // console.log(jointShows);


        res.status(200).json({
            message: "Found user joint me and friend.",
            shows: diffShows
        });

    } catch (error) {
        res.status(401).json({
            message: "No joint shows share",
            error: error
        });
    }

}


// Union
exports.GetUnionShows = async (req, res, next) => {
    try {

        console.log("GetUnionShows GetUnionShows GetUnionShows in friend shows and more");

        const usernameId = req.userData.userId;
        const myShows = await Shows.find({ creator: usernameId });
        const myMap = new Map();

        myShows.forEach(show => {
            myMap.set(show.title, show);
        });

        const friendId = req.params.friendId;
        const userFriendsShows = await Shows.find({ creator: friendId });


        userFriendsShows.forEach(show => {
            myMap.set(show.title, show);
        });


        //  const jointShows = [...jointShows.values()];


        const unionShows = [];
        myMap.forEach((value, key) => {
            unionShows.push(value);
        });

        // console.log(myMap);
        // console.log(jointShows);

        if (userFriendsShows) {
            res.status(200).json({
                message: "Found user joint me and friend.",
                shows: unionShows
            });
        } else {
            res.status(401).json({
                message: "No joint shows share",
                error: "No joint shows share"
            });

        }
    } catch (error) {
        res.status(401).json({
            message: "No joint shows share",
            error: error
        });
    }

}

