import {Request,Response} from 'express';
import brandModel from '../models/brand.model';
import fs from 'fs';
import aws from 'aws-sdk'; 
import {amazonWs3} from '../environment/enviroment.pro';
aws.config.update({
    secretAccessKey:amazonWs3.ws3SecretAccessKey,
    accessKeyId:amazonWs3.ws3AccessKeyId,
    region:"us-west-1"
});

const s3 = new aws.S3();

export async function newBrand(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("new brand", req.body);
    
    const newBrand = new brandModel({nameBrand:req.body.nameBrand, description:req.body.description, createAt: new Date()});
    await newBrand.save();
    const brands = await brandModel.find().sort({createAt: -1});
    res.json({res:brands});

}

export async function newBrandWhitImagen(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("new brand");
    console.log("new brand", req.body);
    let imagenUrl = "";
    let imagenKey = req.file.filename;

    uploadImg(req,res);

    function uploadImg(req:Request, res:Response) {
            
        const fileContent = fs.readFileSync(req.file.path);
        // Setting up S3 upload parameters
        const params = {
            Bucket: amazonWs3.bucketImgBrands,
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
                saveBrand(req,res);
            }
        });
    } 

    async function saveBrand(req:Request, res:Response) {
       
        const newBrand = new brandModel({nameBrand:req.body.nameBrand, description:req.body.description, imagenUrl, keyImagenS3:imagenKey, createAt: new Date()});
        await newBrand.save();
        const brands = await brandModel.find().sort({createAt: -1});
        res.json({res:brands});

    }

}


export async function getListBrand(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    const brands = await brandModel.find().sort({createAt: -1});
    res.json({res:brands});

}

export async function putBrand(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    await brandModel.findByIdAndUpdate(req.body._id, {nameBrand:req.body.nameBrand, description:req.body.description});
    const brands = await brandModel.find().sort({createAt: -1});
    res.json({res:brands});
    
}


export async function putBrandWithImagen(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    let imagenUrl = "";
    let imagenKey = req.file.filename;
    uploadImg(req,res);

    function uploadImg(req:Request, res:Response) {
            
        const fileContent = fs.readFileSync(req.file.path);
        // Setting up S3 upload parameters
        const params = {
            Bucket: amazonWs3.bucketImgBrands,
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
                updateBrand(req,res);
            }
        });
    } 

    async function updateBrand(req:Request,res:Response){
        const brand:any = await brandModel.findById(req.body._id);
        const imagenKeyDb = brand.keyImagenS3;
        await brandModel.findByIdAndUpdate(req.body._id, {nameBrand:req.body.nameBrand, description:req.body.description, imagenUrl, keyImagenS3:imagenKey});
        const brands = await brandModel.find().sort({createAt: -1});
        res.json({res:brands});
        if (imagenKeyDb !== "") {
            console.log("Eliminar imagen");
            deleteImagenCategory(imagenKeyDb);
        }
    }

    
    
}

export async function deleteBrand(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    let category:any = await brandModel.findById(req.body._id);
    const imagenKeyDb = category.keyImagenS3;

    await brandModel.findByIdAndRemove(req.body._id);
    const brands = await brandModel.find().sort({createAt: -1});
    res.json({res:brands});

    if (imagenKeyDb !== "") {
        console.log("Eliminar imagen");
        deleteImagenCategory(imagenKeyDb);
    }
    
}

async function deleteImagenCategory(imagenKey:string){
    var params = {  Bucket: amazonWs3.bucketImgBrands, Key: imagenKey };

    s3.deleteObject(params, function(err:any, data:any) {
      if (err) console.log(err, err.stack);  // error
      else     console.log(data);                 // deleted
    });
}