import Logger from "../Logger/Logger.js";
import Route from "../Route/Route.js";
import AuthMiddleware from "../Middlewares/AuthMiddleware.js";
import BaseController from "./BaseController.js";
import ArtApiService from "./../Services/ArtApiService.js";

class ArtController extends BaseController{

    app = null;
    static prefix = "/arts" 
    

    defineRoutes() {
        return [
            new Route(ArtController.prefix + "/random","get", this.randomArt.bind(this)),
            new Route(ArtController.prefix + "/:pageStart/:pageEnd", "get", this.getAllArt.bind(this)),
            new Route(ArtController.prefix + "/checkRoundAnswer", "post", this.checkRoundAnswer.bind(this)),
        ];
    }
    constructor(app) {
        super(app);
    }

    //0 = easy, 1 = medium, 2 = hard
    async randomArt(req, res) {
        let difficulty = parseInt(req.query.difficulty);
        let artId = req.query.artId;

        if (difficulty == null) {
            difficulty = 0;
        }
        if (artId == null) {
            artId = 0;
        }

        if (difficulty < 0 || difficulty > 2) {
            return res.status(400).json({ message: "Invalid difficulty" });
        }

        return res.status(200).json(await ArtApiService.getRandomArt(difficulty, artId));
    }

    async checkRoundAnswer(req, res) {
        //TODO In the body of the request, we will have infos like userIds, artId and user answer.
        // We will have to check if the answers are correct and return the result.
        //THe data structure will be like this:
        // Map <artTitle, Map<userId, userAnswer>>
        // We will return a Map <artId, Map<userId, isCorrect>>
        //The body will be like this:
        // {
        //     "ArtTitle": {
        //         "userId1": "userAnswer1",
        //         "userId2": "userAnswer2",
        //         "userId3": "userAnswer3",
        //     },


        const { answers } = req.body;
        if (answers == null) {
            return res.status(400).json({ message: "Invalid request" });
        }


        
    }


    async getAllArt(req, res) {
        const { pageStart, pageEnd } = req.params;
        let pageStartInt = parseInt(pageStart);
        let pageEndInt = parseInt(pageEnd);
        if (isNaN(pageStartInt) || isNaN(pageEndInt)) {
            return res.status(400).json({ message: "Invalid page number" });
        }
        if (pageStartInt < 0 || pageEndInt < 0) {
            return res.status(400).json({ message: "Invalid page number" });
        }
        if (pageStartInt > pageEndInt) {
            return res.status(400).json({ message: "Invalid page number" });
        }

        let arts = await ArtApiService.getArt(pageStartInt, pageEndInt);



        return res.status(200).json(arts);
    }

}

export default ArtController;