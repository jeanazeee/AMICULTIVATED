class AuthController {
    app = null

    constructor(app) {
        this.app = app;
        this.init();
    }

    init() {
        this.app.post('/login', (req, res) => {
            res.send('Login');
        });
    }
    
}


export default AuthController;