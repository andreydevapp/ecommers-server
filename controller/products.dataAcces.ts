import {Request,Response} from 'express';
import fs from 'fs';
import aws from 'aws-sdk'; 
import {amazonWs3} from '../environment/enviroment.pro';
import productModel from '../models/product.model';
import categoriasModel from '../models/categorias.model';
import sizesProductsModel from '../models/sizesProducts.model';
import brandModel from '../models/brand.model';
import ocasionModel from '../models/ocasion.model';
aws.config.update({
    secretAccessKey:amazonWs3.ws3SecretAccessKey,
    accessKeyId:amazonWs3.ws3AccessKeyId,
    region:"us-west-1"
});

const s3 = new aws.S3();


export async function saveTypeProduct(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    let payload =  req.body.payload;

    if (payload.subCategorySelected.nameCategory === "") {
        // se aumenta a categorias.
        const category:any = await categoriasModel.findById(payload.categorySelected.idCategory);
        await categoriasModel.findByIdAndUpdate(payload.categorySelected.idCategory,{quantityProducts:category.quantityProducts+1});
    }else{
        // se aumenta a sub categorias
        const category:any = await categoriasModel.findById(payload.subCategorySelected.idCategory);
        await categoriasModel.findByIdAndUpdate(payload.subCategorySelected.idCategory,{quantityProducts:category.quantityProducts+1});
    }

    payload.createAt = new Date();
    const newTypeProduct = new productModel(payload);
    await newTypeProduct.save();
    res.json({res:newTypeProduct}); 
}
      
export async function putTypeProduct(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    await productModel.findByIdAndUpdate(req.body._id,req.body.payload);
    res.json({res:"saved"})
}

export async function deleteTypeProduct(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    const product:any = await productModel.findById(req.body._id);

    //aumentar cate
    if (product.subCategorySelected.nameCategory === "") {
        // se aumenta a categorias.
        const category:any = await categoriasModel.findById(product.categorySelected.idCategory);
        await categoriasModel.findByIdAndUpdate(product.categorySelected.idCategory,{quantityProducts:category.quantityProducts-1});
    }else{
        // se aumenta a sub categorias
        const category:any = await categoriasModel.findById(product.subCategorySelected.idCategory);
        await categoriasModel.findByIdAndUpdate(product.subCategorySelected.idCategory,{quantityProducts:category.quantityProducts-1});
    }

    for(let detail of product.products) {
        
        deleteImagen(detail.images.mainImagen.keyImagenS3);
        for(let item of detail.images.secundaryImages) {
            deleteImagen(item.keyImagenS3);
        }
        
    }

    await productModel.findByIdAndDelete(req.body._id);

    const products = await productModel.find().sort({createAt:-1});
    res.json({res:products});

    function deleteImagen(imagenKeyDb:string) {
        var params = {  Bucket: amazonWs3.bucketImgProduct, Key: imagenKeyDb };

        s3.deleteObject(params, function(err:any, data:any) {
          if (err) console.log(err, err.stack);  // error
          else     console.log(data);                 // deleted
        });
    }
    
}

export async function newProduct(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    console.log("body",req.body);

    const imagenes:any = req.files;
    console.log("imagenes", imagenes);
    
    const mainImagen:any = imagenes.imagen[0];
    const imagesSecundary:any =  imagenes.images;

    console.log("imagen principal",mainImagen);
    console.log("cantidad de imagenes",imagesSecundary);

    let payload:any = JSON.parse(req.body.payload);
    payload.createAt = new Date();
    let contImagen = 0;

    //subir main imagen}

    const fileContent = await fs.readFileSync(mainImagen.path);
    const params = {
        Bucket: amazonWs3.bucketImgProduct,
        Key: mainImagen.filename, // File name you want to save as in S3
        Body: fileContent,
        ACL:'public-read'
    };
    s3.upload(params, async function(err:any, data:any) {
        if (err) {
            console.log("me cai subiendo la imagen");
            throw err;
        }else{
           payload.images.mainImagen.imagenUrl = data.Location;
           payload.images.mainImagen.keyImagenS3 = mainImagen.filename;
           uploadImages();
        }
    });

    async function uploadImages(){
        if (imagesSecundary.length) {
            for (const imagen of imagesSecundary) {
                const fileContent = await fs.readFileSync(imagen.path);
                const params = {
                    Bucket: amazonWs3.bucketImgProduct,
                    Key: imagen.filename, // File name you want to save as in S3
                    Body: fileContent,
                    ACL:'public-read'
                };
                s3.upload(params, async function(err:any, data:any) {
                    if (err) {
                        console.log("me cai subiendo la imagen");
                        throw err;
                    }else{
                        console.log("archivo subido");
                        payload.images.secundaryImages.push({imagenUrl:data.Location, keyImagenS3:imagen.filename});
                        contImagen ++;
                        if (contImagen === imagesSecundary.length) {
                            final();
                        }
                    }
                });
            }
        }else{
            final();
        }
        
    }

    
    async function final() {
        console.log("cantidad de archivos subidos: ", contImagen);
        console.log("payload",payload);
        console.log("id",req.body._id);
        
        await productModel.findByIdAndUpdate(req.body._id,
            {
              $push: { 
                products: {
                   $each: [ payload ]
                }
              }
            }
        );



        const product:any = await productModel.aggregate([
            { $match: {  nameProduct: req.body.nameProduct }},
            { $unwind: '$products' },
            { $sort: { 'products.createAt': -1 }},
            { $group: { _id: '$_id', products: { $push: '$products'}}}]);
        
        
        res.json({res:product[0].products});

        await fs.unlinkSync(mainImagen.path);
        for(let imagen of imagesSecundary) {
            await fs.unlinkSync(imagen.path);
        }
        
    }

}



export async function getProducts(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
    const products = await productModel.find().sort({createAt:-1});
    res.json({res:products});
}

export async function getProduct(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("obtener producto", req.body._id);
    
    const product = await productModel.findById(req.body._id);
    res.json({res:product});

}

export async function getProductsStoreCategory(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("url",req.body);

    const products = await productModel.find({"categorySelected.idCategory":req.body._id}).sort({price: req.body.filterPrice}); 
    const brands = await brandModel.find().sort({createAt: -1});
    const sizes = await sizesProductsModel.find().sort({createAt:-1});
    const ocacions = await ocasionModel.find().sort({createAt:-1});
    const categories = await categoriasModel.find({categoryFather:""}).sort({createAt:-1});
    res.json({res:{products,brands,sizes,ocacions,categories}});

} 


export async function getProductsStoreSubCategory(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("url",req.body);

    const find = "brand.brandIs:5ebcab5561878e35e0fda12e";

    const prueba =  await productModel.find({find});
    console.log("prueba",prueba);
    
    
    const products = await productModel.find({url:req.body.url}).sort({createAt:-1});
    const brands = await brandModel.find().sort({createAt: -1});
    const sizes = await sizesProductsModel.find().sort({createAt:-1});
    const ocacions = await ocasionModel.find().sort({createAt:-1});
    res.json({res:{products,brands,sizes,ocacions}});

}

export async function filterProduct(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("url",req.body);
    let products:any;

    if(req.body.priceMin !== undefined ||req.body.priceMax !== undefined){
        products =  await productModel.find(
            {
                "price": {$gte:parseInt(req.body.priceMin), $lte: parseInt(req.body.priceMax)},
                "brand.idBrand":req.body.filterBrand,
                "typeOcasion.idType":req.body.filterOcasion,
                "products":  { 
                    $elemMatch: { 
                        "size.sizes": { 
                            $elemMatch: 
                            { "size": { "$in": req.body.filterSizes }  } 
                        },
                        "color": { "$in": req.body.filterColor } 
                    }
                }
            }
         
         
        );
        //.sort({price: req.body.filterPrice});
    }else{
        products =  await productModel.find(
            {
                "brand.idBrand":req.body.filterBrand,
                "typeOcasion.idType":req.body.filterOcasion,
                "products":  { 
                    $elemMatch: { 
                        "size.sizes": { 
                            $elemMatch: 
                            { "size": { "$in": req.body.filterSizes }  } 
                        },
                        "color": { "$in": req.body.filterColor } 
                    }
                }
            }
        )
        .sort({price: req.body.filterPrice});   
    }

    console.log("apply filter",products);
    const brands = await brandModel.find().sort({createAt: -1});
    const sizes = await sizesProductsModel.find().sort({createAt:-1});
    const ocacions = await ocasionModel.find().sort({createAt:-1});
    res.json({res:{products,brands,sizes,ocacions}});
    
}

export async function getProductUrl(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("url",req.body);
    
    const products = await productModel.find({url:req.body.url}).sort({createAt:-1});
    res.json({res:products});

}

export async function putProduct(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
   console.log(req.body);

    let payload = req.body.payload;
    
    
    if (payload.description === ''){
        payload.description = "Este producto no cuenta con una descripción";
    }
    
    await productModel.findByIdAndUpdate(req.body._id, payload);
    const products = await productModel.find().sort({createAt:-1});
    res.json({res:products});
    
}

export async function putProductWhitImagen(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    let payload = JSON.parse(req.body.payload);
    payload.keyImagenS3 = req.file.filename;
    if (payload.description === ''){ 
        payload.description = "Este producto no cuenta con una descripción";
    }
    
    //subir imagen
    uploadImg(req,res);
    function uploadImg(req:Request, res:Response) {
            
        const fileContent = fs.readFileSync(req.file.path);
        // Setting up S3 upload parameters
        const params = {
            Bucket: amazonWs3.bucketImgProduct,
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
                payload.imagenUrl = data.Location;
                console.log(payload);
                
                
                saveProduct(req,res);
            }
        });
    } 

    async function saveProduct(req:Request, res:Response) {

        const category:any = await productModel.findById(req.body._id);
        const imagenKeyDb = category.keyImagenS3;
        await productModel.findByIdAndUpdate(req.body._id, payload);
        const products = await productModel.find().sort({createAt:-1});
        res.json({res:products});
        await fs.unlinkSync(req.file.path);
        if (imagenKeyDb !== "") {
            console.log("Eliminar imagen");
            deleteImagen(imagenKeyDb);
        }
    }

    //uploadImg(req,res);
    
    function deleteImagen(imagenKeyDb:string) {
        var params = {  Bucket: amazonWs3.bucketImgProduct, Key: imagenKeyDb };

        s3.deleteObject(params, function(err:any, data:any) {
          if (err) console.log(err, err.stack);  // error
          else     console.log(data);                 // deleted
        });
    }
    
}

export async function deleteProduct(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    
   console.log(req.body);
    
    const product:any = await productModel.findById(req.body._id);

    //elimino las fotos
    for(let detail of product.products) {
        console.log("product", detail);
        console.log("id product", detail._id);
        
        if (detail.id === req.body.idDetail) {
            console.log("lo encontre");
            deleteImagen(detail.images.mainImagen.keyImagenS3);
            for(let item of detail.images.secundaryImages) {
                deleteImagen(item.keyImagenS3);
            }
            break;
        }
    }
    
    // elimino el detalle del producto
    await productModel.findByIdAndUpdate(
        req.body._id, 
        { $pull: { "products" : { _id: req.body.idDetail} } },
    );
    
    if (product.products.length === 1) {
        res.json({res:[]});
    }else{
        //devuelvo los detalles del producto
        const products:any = await productModel.aggregate([
            { $match: {  nameProduct: req.body.nameProduct }},
            { $unwind: '$products' },
            { $sort: { 'products.createAt': -1 }},
            { $group: { _id: '$_id', products: { $push: '$products'}}}]);
            
        res.json({res:products[0].products});
    }

    function deleteImagen(imagenKeyDb:string) {
        var params = {  Bucket: amazonWs3.bucketImgProduct, Key: imagenKeyDb };

        s3.deleteObject(params, function(err:any, data:any) {
          if (err) console.log(err, err.stack);  // error
          else     console.log(data);                 // deleted
        });
    }
    
}





export async function prueba(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("obtener producto", req.body._id);
    
    
    const product:any = await productModel.aggregate([
        { $unwind: '$products' },
        { $sort: { 'products.createAt': -1 }},
        { $group: { _id: '$nameProduct', brand:{$push:"$brand"}, typeOcasion:{$push:"$typeOcasion"}, products: { $push: '$products'}}}]);

    res.json({product});    

}