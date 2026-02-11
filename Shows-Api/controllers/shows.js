
const axios = require('axios');
const Show = require("../models/Show");


// const dataStatic = require("../dataObj");

exports.GetUserShows = async (req, res, next) => {

    const myShows = Show.find({ creator: req.userData.userId });

    console.log({ creator: req.userData.userId });

    console.log("ping back shows get");

    myShows.then(response => {

        // console.log("here and the shows is : ", response);

        res.status(200).json({
            message: "shows :)",
            shows: response,
        });

    }).catch(error => {
        res.status(500).json({
            message: "error !!",
        });

    });

}

exports.GetUserShowByApiId = async (req, res, next) => {

    const creator = req.userData.userId;
    const apiId = req.params.apiId;


    const show = Show.findOne({ creator, apiId });

    console.log({ creator });

    console.log("ping back show get");

    show.then(response => {

        res.status(200).json({
            message: "show :)",
            show: response
        });

    }).catch(error => {
        res.status(500).json({
            message: "error !!",
        });

    });

}


exports.SearchShows = async (req, res, next) => {

    const searchShow = req.params.searchShow;

    // const urlApiNotWork = `https://imdb-api.com/en/API/Search/${process.env.ApiKey}/${searchShow}`;

    const urlApi = `https://api.collectapi.com/imdb/imdbSearchByName?query=${searchShow}`;

    const config = {
        headers: {
            'Authorization': `${process.env.ApiKey}`,
        }
    };

    // req from rate api
    await axios.get(urlApi, config)
        .then((response) => {

            const responseApi = response.data;
            console.log("Response?");
            console.log(responseApi);

            // if(responseApi.result && responseApi.result.length > 0) {}

            if (responseApi.success) {
                res.status(200).json({
                    health: "Online ! :)",
                    success: responseApi.success,
                    responseApi
                });

            }
            else {
                res.status(200).json({
                    health: "Online ! :)",
                    success: responseApi.success,
                    responseApi: []
                });
            }


        }).catch(e => {
            console.log({
                message: "oops :(",
                error: e,
            })
        });
}


exports.CreateUserShow = async (req, res, next) => {

    try {

        const apiId = req.body.apiId;
        const userId = req.userData.userId;

        const showInDb = await Show.findOne({ creator: userId, apiId });

        console.log(" showInDb ", showInDb);

        if (showInDb) {
            res.status(401).json(
                {
                    message: "Show already the showlist.",
                    error: "Show already the showlist."
                });
            return;
        }

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

        const urlApi = `https://api.collectapi.com/imdb/imdbSearchById?movieId=${apiId}`;

        const config = {
            headers: {
                'Authorization': `${process.env.ApiKey}`,
                //'Content-Type': 'application/json'
            }
        };

        // req from rate api
        const showDataCall = await axios.get(urlApi, config);
        const showData = showDataCall.data.result;

        console.log("showData ", showData);
        //newShow.type = answerType;

        if (newShow.type === 'movie') {
            const minutes = +showData.Runtime.split(" ")[0];;

            newShow.minutes = minutes;
        } else {
            const seasons = showData.totalSeasons;
            newShow.seasons = seasons;
            newShow.type = "tv";
        }


        console.log(newShow);

        newShow.save().then(response => {

            console.log(" Pow here and well ? ");

            res.status(201).json(
                {
                    message: "show created!",
                    response
                });

        }).catch(error => {
            console.log(error);

            res.status(401).json(
                {
                    message: "error !!",
                    error
                });
        });

    } catch (error) {
        res.status(500).json(
            {
                message: "error !!",
                error
            });
    }

}


exports.UpdateUserShow = async (req, res, next) => {

    try {

        const apiId = req.params.apiId;
        const userId = req.userData.userId;
        const review = req.body.review;
        const rating = req.body.rating;

        if (!review || !rating || !apiId || !userId) {
            res.status(500).json({ message: "Error in parameters!" });
            return;
        }

        const filter = { creator: userId, apiId };
        const update = { review, rating };

        const show = await Show.findOneAndUpdate(filter, update, {
            returnOriginal: false
        });


        res.status(200).json({
            health: "Online ! :)",
            show
        });

    } catch (error) {

        console.log("error update show ", error);

        res.status(500).json({ message: "Fetcing post failed!" });

    }

}

exports.deleteUserShow = async (req, res, next) => {

    const apiId = req.params.apiId;
    const userId = req.userData.userId;

    console.log("apiId : ", apiId);
    console.log("userId : ", userId);

    Show.deleteOne({ apiId: req.params.apiId, creator: req.userData.userId }).then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Deletion successful!" });
        }
        else {
            res.status(401).json({ message: "Not Authorized!" });
        }
    }).catch(error => {
        res.status(500).json({ message: "Fetcing post failed!" });
    });
}

// // // create user show | old code
//{

//     let responseApi = "none";

//     const searchShow = "inception 2010";

//     const urlApi = `https://imdb-api.com/en/API/Search/${process.env.ApiKey}/${searchShow}`;

//     console.log("Here in the Create user show ");

//     // console.log(urlApi);

//     // req from rate api
//     await axios({
//         method: 'get',
//         url: urlApi,
//     })
//         .then((response) => {
//             // rateCAN = response.data.rates.CAD;
//             // rateEuro = response.data.rates.EUR;

//             responseApi = response;
//             // console.log(response);


//         }).catch(e => {
//             console.log({
//                 message: "oops :(",
//                 error: e,
//             })
//         });

//     responseApi = responseApi.data;

//     res.status(200).json({
//         health: "Online ! :)",
//         responseApi
//     });
// }
