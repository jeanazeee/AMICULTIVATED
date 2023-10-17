import API from "../API/API.js";

export default class Route {
    constructor(path, method, handler, middleware = null) {
        this.path = path;
        this.method = method;
        this.handler = handler;
        this.middleware = middleware;
    }

    register(app) {
        if (this.middleware) {
            app[this.method](this.path, this.middleware, this.handler);
        } else {
            app[this.method](this.path, this.handler);
        }
    }
}