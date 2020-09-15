import Server from "./classes/server";
import cors from "cors";

//routes admin
import navigation from "./routes/admin/navigation";
import category from "./routes/admin/category";
import products from "./routes/admin/products";
import sizes from "./routes/admin/sizes";
import brands from "./routes/admin/brands";
import ocasion from "./routes/admin/ocasion";

//routes client
import authenticationClient from "./routes/client/authentication";

//enviroments
import bodyParser from 'body-parser';

const server = Server.instance;

//cors
server.app.use(cors());
server.app.use(function(req, res, next) {
    
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// BodyParser
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );


// Rutas de servicios para el admin
server.app.use('/',navigation);
server.app.use('/',category);
server.app.use('/',products);
server.app.use('/',sizes);
server.app.use('/',brands);
server.app.use('/',ocasion);

// Rutas de serviios para el cliente de la tienda
server.app.use('/',authenticationClient);

server.start( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});