import {Request,Response} from 'express';
import categoriasModel from '../models/categorias.model';
import fs from 'fs';
import aws from 'aws-sdk'; 
import {amazonWs3} from '../environment/enviroment.pro';
import productModel from '../models/product.model';
aws.config.update({
    secretAccessKey:amazonWs3.ws3SecretAccessKey,
    accessKeyId:amazonWs3.ws3AccessKeyId,
    region:"us-west-1"
});

const s3 = new aws.S3();

export async function newCategory(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    //category or subcategory
    console.log("crear una nueva categoria");
    
    if (req.body.opc === "category") {
        const newCategory = new categoriasModel({nameCategory:req.body.nameCategory, description:req.body.description, categoryFather:"", createAt: new Date()});
        await newCategory.save();
        const categories = await categoriasModel.find({categoryFather:""}).sort({createAt:-1});
        res.json({res:categories});
    }else{

        console.log("save subcategory");

        let category:any = await categoriasModel.findById(req.body.idFather); 
        
        const newCategory = new categoriasModel({nameCategory:req.body.nameCategory, description:req.body.description, categoryFather:req.body.idFather, nameCategoryFather: category.nameCategory, createAt: new Date()});
        await newCategory.save();
        console.log("id",req.body);
        console.log("id",req.body.idFather);
        
        await categoriasModel.findByIdAndUpdate(req.body.idFather, {quantitySubCategory:category.quantitySubCategory+1})

        const categories = await categoriasModel.find({categoryFather:""}).sort({createAt:-1});
        const subCategories = await categoriasModel.find({categoryFather:req.body.idFather}).sort({createAt:-1})
        res.json({res:{categories,subCategories}});
    }
    
}

export async function newCategoryWhitImagen(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    //category or subcategory
    console.log("crear una nueva categoria", req.body);
    
    let imagenUrl = "";
    let imagenKey = req.file.filename;

    uploadImg(req,res);

    function uploadImg(req:Request, res:Response) {
            
        const fileContent = fs.readFileSync(req.file.path);
        // Setting up S3 upload parameters
        const params = {
            Bucket: amazonWs3.bucketImgCategories,
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
                saveCategory(req,res);
            }
        });
    } 

    async function saveCategory(req:Request, res:Response) {
       
        if (req.body.opc === "category") {
            const newCategory = new categoriasModel({nameCategory:req.body.nameCategory, description:req.body.description, categoryFather:"", imagenUrl, keyImagenS3:imagenKey, createAt: new Date()});
            await newCategory.save();
            const categories = await categoriasModel.find({categoryFather:""}).sort({createAt:-1});
            res.json({res:categories});
        }else{
    
            console.log("save subcategory",req.body.categoryFather);
            
            let category:any = await categoriasModel.findById(req.body.categoryFather); 
            const newCategory = new categoriasModel({nameCategory:req.body.nameCategory, description:req.body.description, categoryFather:req.body.categoryFather, imagenUrl, keyImagenS3:imagenKey, nameCategoryFather: category.nameCategory, createAt: new Date()});
            await newCategory.save();
            console.log("id",req.body);
            console.log("id",req.body.categoryFather);
            
            category = await categoriasModel.findById(req.body.categoryFather); 
            
            await categoriasModel.findByIdAndUpdate(req.body.categoryFather, {quantitySubCategory:category.quantitySubCategory+1})
    
            const categories = await categoriasModel.find({categoryFather:""}).sort({createAt:-1});
            const subCategories = await categoriasModel.find({categoryFather:req.body.categoryFather}).sort({createAt:-1})
            res.json({res:{categories,subCategories}});
        }

    }
    
}

export async function getListCategories(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    //category or subcategory
    console.log("get category");
    
    const categories = await categoriasModel.find({categoryFather:""}).sort({createAt:-1});
    res.json({res:categories});
    
}

export async function getListSubCategories(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    console.log("sub categorias",req.body);
    
    //category or subcategory
    const subCategories = await categoriasModel.find({categoryFather:req.body.idFather}).sort({createAt:-1});
    
    res.json({res:subCategories});
    
}

export async function getListAllSubCategories(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    console.log("sub categorias");
    
    //category or subcategory
    const subCategories = await categoriasModel.find().sort({createAt:-1});
    
    res.json({res:subCategories});
    
}

export async function putCategory(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    //category or subcategory
    await categoriasModel.findByIdAndUpdate(req.body._id,{nameCategory: req.body.nameCategory, description: req.body.description});

    const subCategory:any = await categoriasModel.findById(req.body._id);
    const categories = await categoriasModel.find({categoryFather:""}).sort({createAt:-1});
    const subCategories = await categoriasModel.find({categoryFather:subCategory.categoryFather}).sort({createAt:-1});
    res.json({res:{categories,subCategories}});
}

export async function putCategoryWhitImagen(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    let imagenUrl = "";
    let imagenKey = req.file.filename;
   console.log(req.body);
   
    uploadImg(req,res);

    function uploadImg(req:Request, res:Response) {
            
        const fileContent = fs.readFileSync(req.file.path);
        // Setting up S3 upload parameters
        const params = {
            Bucket: amazonWs3.bucketImgCategories,
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
                editCategory(req,res);
            }
        });
    } 

    async function editCategory(req:Request, res:Response) {
       
        //category or subcategory
        console.log("entre a modificar la imagen");
        
        const category:any = await categoriasModel.findById(req.body._id);
        const imagenKeyDb = category.keyImagenS3;
        await categoriasModel.findByIdAndUpdate(req.body._id,{nameCategory: req.body.nameCategory, description: req.body.description, imagenUrl, keyImagenS3:imagenKey});

        const subCategory:any = await categoriasModel.findById(req.body._id);
        const categories = await categoriasModel.find({categoryFather:""}).sort({createAt:-1});
        const subCategories = await categoriasModel.find({categoryFather:subCategory.categoryFather}).sort({createAt:-1});
        res.json({res:{categories,subCategories}});

        
        if (imagenKeyDb !== "") {
            console.log("Eliminar imagen");
            deleteImagenCategory(imagenKeyDb);
        }

    }
}

export async function deleteCategory(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    console.log(req.body);
    
    //category or subcategory
    if (req.body.opc === "category") {

        console.log("entre a eliminar categoria");
        
        //catidades de sub categorias y productos
        const quatitySubCategory = await categoriasModel.find({categoryFather:req.body._id}).countDocuments();
        const quatityProducts = await productModel.find({"categorySelected.idCategory":req.body._id}).countDocuments();

        //variables para payload
        let category:any = await categoriasModel.findById(req.body._id);
        const imagenKeyDb = category.keyImagenS3;

        if (quatityProducts > 0) {
            let products:any =  await productModel.find({"categorySelected.idCategory"
                :req.body._id});
            for(let product of products) {
                console.log("elimino la imagen del producto ", product.nameProduct
                );
                
                if (product.keyImagenS3 !== '') {
                    deleteImagenProduct(product.keyImagenS3);
                }
                await productModel.findByIdAndRemove({_id:product._id});
            }
            console.log("elimino todos los productos");
        }
    
        
        if (quatitySubCategory > 0) {

            const subCategories:any = await categoriasModel.find({categoryFather:req.body._id});
            for(let subCategory of subCategories) {
                console.log("elimino la sub categoria ", subCategory.nameCategory);
            
                if (subCategory.keyImagenS3 !== '') {
                    deleteImagenCategory(subCategory.keyImagenS3);
                    await categoriasModel.findByIdAndRemove({_id:subCategory._id});
                }
            }   
        }

        await categoriasModel.findByIdAndRemove(req.body._id);
        category = await categoriasModel.find({categoryFather:""}).sort({createAt:-1});
        res.json({res:category});

        if (imagenKeyDb !== "") {
            console.log("Eliminar imagen");
            deleteImagenCategory(imagenKeyDb);
        }
    }else{
        

        const subCategory:any = await categoriasModel.findById(req.body._id);
        const imagenKeyDb = subCategory.keyImagenS3;
        const quatityProducts = await productModel.find({"subCategorySelected.idCategory":req.body._id}).countDocuments();
        console.log("cantidad de productos", quatityProducts);
        
        const category:any = await categoriasModel.findById(subCategory.categoryFather);
        await categoriasModel.findByIdAndUpdate(category._id,{quantitySubCategory:category.quantitySubCategory-1});

        if (quatityProducts > 0) {
            let products:any =  await productModel.find({"subCategorySelected.idCategory"
                :req.body._id});
            for(let product of products) {
                console.log("elimino la imagen del producto ", product.nameProduct
                );
                
                if (product.keyImagenS3 !== '') {
                    deleteImagenProduct(product.keyImagenS3);
                }
                await productModel.findByIdAndRemove({_id:product._id});
            }
            console.log("elimino todos los productos");
        }

        await categoriasModel.findByIdAndDelete(req.body._id);

        const categories = await categoriasModel.find({categoryFather:""}).sort({createAt:-1});
        const subCategories = await categoriasModel.find({categoryFather:subCategory.categoryFather}).sort({createAt:-1});

        res.json({res:{categories,subCategories}});
        if (imagenKeyDb !== "") {
            console.log("Eliminar imagen");
            deleteImagenCategory(imagenKeyDb);
        }

    }
    
    
}

async function deleteImagenCategory(imagenKey:string){
    var params = {  Bucket: amazonWs3.bucketImgCategories, Key: imagenKey };

    s3.deleteObject(params, function(err:any, data:any) {
      if (err) console.log(err, err.stack);  // error
      else     console.log(data);                 // deleted
    });
}

function deleteImagenProduct(imagenKeyDb:string) {
    var params = {  Bucket: amazonWs3.bucketImgProduct, Key: imagenKeyDb };

    s3.deleteObject(params, function(err:any, data:any) {
      if (err) console.log(err, err.stack);  // error
      else     console.log(data);                 // deleted
    });
}