import {Request,Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import userStoreModel from '../models/userStore.model';

export async function registerStoreUser(req:Request, res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    console.log("registrar usuario",req.body);

    const user = await userStoreModel.findOne({email:req.body.payload.email});

    if (!user) {
 
        const payloadToken = {
            email:req.body.payload.email,
            fullName:req.body.payload.fullName
        } 

        const token = await jwt.sign((payloadToken), 'my_secret_token_Key');

        let payload:any = {
            fullName: req.body.payload.fullName,
            email: req.body.payload.email,
            password: req.body.payload.password,
            tempToken: token,
            createAt:new Date()
        };

        const newUserStore:any = new userStoreModel(payload);
        await newUserStore.save();

        res.json({
            res:'Successful registration',   
            //usuario
            user:{
                _id:newUserStore._id,
                fullName:newUserStore.fullName,
                email:newUserStore.email,
                tempToken:newUserStore.tempToken
            }
     
        }); 

    }else{
        res.json({res:'Existing email'});
    }

}

export async function loginStore(req:Request, res:Response){
    
}

export async function registerAdmin(req:Request, res:Response){
    
}

export async function lognAdmin(req:Request, res:Response){
    
}