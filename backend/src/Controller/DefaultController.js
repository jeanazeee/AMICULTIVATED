class DefaultController {

    app = null;
    constructor(app) {
        this.app = app;
        this.init();
    }

    init(){
        this.defaultRoute();
    }

    defaultRoute(){
        this.app.get('/', (req, res) => {
            res.send('Server Working!');
        });
    }
}

export default DefaultController;