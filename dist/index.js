"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const cors_1 = __importDefault(require("cors"));
//routes admin
const navigation_1 = __importDefault(require("./routes/admin/navigation"));
const category_1 = __importDefault(require("./routes/admin/category"));
const products_1 = __importDefault(require("./routes/admin/products"));
const sizes_1 = __importDefault(require("./routes/admin/sizes"));
const brands_1 = __importDefault(require("./routes/admin/brands"));
const ocasion_1 = __importDefault(require("./routes/admin/ocasion"));
//routes client
const authentication_1 = __importDefault(require("./routes/client/authentication"));
//enviroments
const body_parser_1 = __importDefault(require("body-parser"));
const server = server_1.default.instance;
//cors
server.app.use(cors_1.default());
server.app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
// BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// Rutas de servicios para el admin
server.app.use('/', navigation_1.default);
server.app.use('/', category_1.default);
server.app.use('/', products_1.default);
server.app.use('/', sizes_1.default);
server.app.use('/', brands_1.default);
server.app.use('/', ocasion_1.default);
// Rutas de serviios para el cliente de la tienda
server.app.use('/', authentication_1.default);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
