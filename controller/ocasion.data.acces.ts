import {Request,Response} from 'express';
import fs from 'fs';
import aws from 'aws-sdk'; 
import {amazonWs3} from '../environment/enviroment.pro';
import ocasionModel from '../models/ocasion.model';
import productModel from '../models/product.model';
aws.config.update({
    secretAccessKey:amazonWs3.ws3SecretAccessKey,
    accessKeyId:amazonWs3.ws3AccessKeyId,
    region:"us-west-1"
});

const s3 = new aws.S3();


export async function newOcasionWhitImagen(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    console.log("new ocasion", req.body);
    let imagenUrl = "";
    let imagenKey = req.file.filename;

    uploadImg(req,res);

    function uploadImg(req:Request, res:Response) {
            
        const fileContent = fs.readFileSync(req.file.path);
        // Setting up S3 upload parameters
        const params = {
            Bucket: amazonWs3.bucketImgOcasion,
            Key: req.file.filename, // File name you want to save as in S3
            Body: fileContent,
            ACL:'public-read'
        };

        // Uploading files to the bucket
        s3.upload(params, async function(err:any, data:any) {
            if (err) {
                console.log("me cai subiendo la imagen");
                throw err;
            }else{
                console.log("archivo subido");
                imagenUrl = data.Location;
                                
                await fs.unlinkSync(req.file.path);
                saveOcasion(req,res);
            }
        });
    } 

    async function saveOcasion(req:Request, res:Response) {
        const newOcasion = new ocasionModel({type:req.body.name, description:req.body.description, imagenUrl, keyImagenS3:imagenKey, createAt: new Date()});
        await newOcasion.save();
        res.json({res:"saved"});

    }

}

export async function getOcasions(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("get ocacion");
    
    const ocacions = await ocasionModel.find().sort({createAt:-1});
    res.json({res:ocacions});
 
}

export async function putOcasion(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("put ocacion", req.body);
    
    
    const ocasion:any = await ocasionModel.findById(req.body._id);
        
    deleteImagen(ocasion.keyImagenS3);

    if (ocasion.type !== req.body.type) {
        await productModel.update({"typeOcasion.idType": req.body._id}, {"$set":{"typeOcasion.type": req.body.type}}, {"multi": true});
    }

    await ocasionModel.findByIdAndUpdate(req.body._id,{type:req.body.type, description:req.body.description});

    res.json({res:"updated"});

}

export async function putOcasionWhitImagen(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("put ocacion", req.body);

    let imagenUrl = "";
    let imagenKey = req.file.filename;

    uploadImg(req,res);

    function uploadImg(req:Request, res:Response) {
            
        const fileContent = fs.readFileSync(req.file.path);
        // Setting up S3 upload parameters
        const params = {
            Bucket: amazonWs3.bucketImgOcasion,
            Key: req.file.filename, // File name you want to save as in S3
            Body: fileContent,
            ACL:'public-read'
        };

        // Uploading files to the bucket
        s3.upload(params, async function(err:any, data:any) {
            if (err) {
                console.log("me cai subiendo la imagen");
                throw err;
            }else{
                console.log("archivo subido");
                imagenUrl = data.Location;
                                
                await fs.unlinkSync(req.file.path);
                savePutOcasion(req,res);
            }
        });
    } 

    async function savePutOcasion(req:Request, res:Response) {
        const ocasion:any = await ocasionModel.findById(req.body._id);
        
        deleteImagen(ocasion.keyImagenS3);

        if (ocasion.type !== req.body.type) {
            await productModel.update({"typeOcasion.idType": req.body._id}, {"$set":{"typeOcasion.type": req.body.type}}, {"multi": true});
        }

        await ocasionModel.findByIdAndUpdate(req.body._id,{type:req.body.type, description:req.body.description, imagenUrl, keyImagenS3:imagenKey});

        res.json({res:"updated"});

        
    }
    
}

export async function deleteOcasion(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("get ocacion");
    
    const ocasion:any = await ocasionModel.findById(req.body._id);
        
    deleteImagen(ocasion.keyImagenS3);

    await productModel.update({"typeOcasion.idType": req.body._id}, {"$set":{"typeOcasion.idType": "5ec01296781f295258425a64", "typeOcasion.type": "Sin tipo de ocasión"}}, {"multi": true});

    await ocasionModel.findByIdAndRemove(req.body._id);

    const ocacions = await ocasionModel.find().sort({createAt:-1});
    res.json({res:ocacions});

}

function deleteImagen(imagenKeyDb:string) {
    var params = {  Bucket: amazonWs3.bucketImgOcasion, Key: imagenKeyDb };

    s3.deleteObject(params, function(err:any, data:any) {
      if (err) console.log(err, err.stack);  // error
      else     console.log(data);                 // deleted
    });
}