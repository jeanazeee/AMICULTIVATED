import { getUserModel } from "../Model/UserModel.js";
class AuthController {
    app = null

    user_model = null

    constructor(app) {
        this.app = app;
        this.user_model = getUserModel();
        this.init();
    }

    init() {
        this.login();
    }

    login(){
        this.app.post("/login", async (req, res) => {
            const {username, password} = req.body;

            const user = await this.user_model.findOne({where: {username: username}});
            if(!user){
                return res.status(404).json({message: "User not found"});
            }          

        });
    }
    
}


export default AuthController;