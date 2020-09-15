"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enviroment_pro_1 = require("../environment/enviroment.pro");
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
class Server {
    constructor() {
        this.app = express_1.default();
        //coneccion a base de datos
        // const MONGO_URI = 'mongodb://localhost/dblivereat';
        // mongoose.set('useFindAndModify',true);
        // mongoose.connect(MONGO_URI || process.env.MONGDB_URL, {
        //     useNewUrlParser:true,
        //     useCreateIndex:true
        // })
        // .then(DB => console.log('db is connected'));
        //-------------------------- 
        //coneccion a base de datos
        const MONGO_URI = 'mongodb+srv://teytech:Fail0412*@cluster0-hw8sk.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true';
        mongoose_1.default.set('useFindAndModify', true);
        mongoose_1.default.connect(MONGO_URI || process.env.MONGDB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
            .then(DB => console.log('db is connected'));
        //-------------------------- 
        this.port = enviroment_pro_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
    }
    static get instance() {
        return this._intance || (this._intance = new this());
    }
    start(callback) {
        this.httpServer.listen(this.port, () => { });
    }
}
exports.default = Server;
