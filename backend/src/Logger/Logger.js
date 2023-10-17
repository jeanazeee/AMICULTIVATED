

export default class Logger {

    static reset = "\x1b[0m";

    static textBlue = "\x1b[34m";
    static textRed = "\x1b[31m";
    static textOrange = "\x1b[33m";
    static textGreen = "\x1b[32m";



    static #log(message, textColor="", end="\n"){
        process.stdout.write(textColor + message + Logger.reset + end);
    }

    static info(message){
        Logger.#log("[INFO] >> " + message, Logger.textBlue)
    }

    static error(message){
        Logger.#log("[ERROR] >> " + message, Logger.textRed)
    }

    static warning(message){
        Logger.#log("[WARNING] >> " + message, Logger.textOrange)
    }

    static success(message){
        Logger.#log("[SUCCESS] >> " + message, Logger.textGreen)
    }

}