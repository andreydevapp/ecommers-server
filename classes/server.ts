import express from 'express';
import { SERVER_PORT } from '../environment/enviroment.pro';
import http from 'http';
import mongoose from 'mongoose';



export default class Server {

    private static _intance: Server;

    public app: express.Application;
    public port: number;

    private httpServer: http.Server;


    private constructor() {
 
        this.app = express();

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

         mongoose.set('useFindAndModify',true);
         mongoose.connect(MONGO_URI || process.env.MONGDB_URL, {
             useNewUrlParser:true,
             useCreateIndex:true
         })   
         .then(DB => console.log('db is connected'));
        //-------------------------- 

        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
    }

    public static get instance() {
        return this._intance || ( this._intance = new this() );
    }


    start( callback: Function ) {

        this.httpServer.listen( this.port, () => {} );

    }

}