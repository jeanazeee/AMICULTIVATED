import Logger from "../Logger/Logger.js";
import Route from "../Route/Route.js";
import AuthMiddleware from "../Middlewares/AuthMiddleware.js";
import BaseController from "./BaseController.js";
import ArtApiService from "../Services/ArtApiService.js";

class ArtController extends BaseController{

    app = null;
    static prefix = "/arts" 
    

    defineRoutes() {
        return [
            new Route(ArtController.prefix + "/random/:difficulty/:artId","get", this.randomArt.bind(this)),
            new Route(ArtController.prefix + "/:pageStart/:pageEnd", "get", this.getAllArt.bind(this)),
            new Route(ArtController.prefix + "/checkRoundAnswer", "post", this.checkRoundAnswer.bind(this)),
        ];
    }
    constructor(app) {
        super(app);
    }

    async randomArt(req, res) {
        return res.status(200).json(await ArtApiService.getRandomArt(req.params.difficulty, req.params.artId));
    }

    async checkRoundAnswer(req, res) {}


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

        console.log(arts);


        return res.status(200).json(arts);
    }

}

export default ArtController;