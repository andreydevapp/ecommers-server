import {Request,Response} from 'express';
import categoriasModel from '../models/categorias.model';
import sizesProductsModel from '../models/sizesProducts.model';

//nameProduct, opc
export async function newSize(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    //category or subcategory
    console.log("crear una nueva talla",req.body);

    const payloadSizes:any = [];

    for(let s of req.body.sizes) {
        const payload = {
            size:s.size,
            createAt: new Date()
        };
        payloadSizes.push(payload);
    }
    
    console.log(payloadSizes);
    
    const newSize = new sizesProductsModel({typeProduct: req.body.typeProduct,description: req.body.description, sizes:payloadSizes, createAt: new Date()});
    await newSize.save();
    const sizes =  await sizesProductsModel.find().sort({createAt:-1});
    res.json({res:sizes});
    
    if (req.body.opc === "newType") {
        
        

    }else{
        console.log(req.body);
        
        const size:any = await sizesProductsModel.findById(req.body._id);
        await sizesProductsModel.findByIdAndUpdate(req.body._id,{quatitySizes:size.quatitySizes+1,$push:{sizes:{size:req.body.size,description:req.body.description,createAt:new Date()}}});
        const sizes =  await sizesProductsModel.find().sort({createAt:-1});
        res.json({res:sizes});
    }
    
}

export async function getSizes(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    //category or subcategory
    console.log("crear una nueva categoria");
    
    const sizes = await sizesProductsModel.find().sort({createAt:-1});
    res.json({res:sizes});
}

export async function getSize(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    //category or subcategory
    console.log("editar las categoria");

    const sizes = await sizesProductsModel.findById(req.body._id).sort({createAt:-1});
    res.json({res:sizes});
}

export async function putSize(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    //category or subcategory
    console.log("editar categoria", req.body);
    console.log("sizes", req.body.sizes);
    
    const payloadSizes:any = [];

    for(let s of req.body.sizes) {
        const payload = {
            size:s.size,
            createAt: new Date()
        };
        payloadSizes.push(payload);
    }
    
    console.log(payloadSizes);
    
    await sizesProductsModel.findByIdAndUpdate(req.body._id,{typeProduct:req.body.typeProduct,description: req.body.description, sizes:payloadSizes});

    const sizes =  await sizesProductsModel.find().sort({createAt:-1});
    res.json({res:sizes});
    
}

export async function deleteSize(req:Request,res:Response){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed

    //category or subcategory
    console.log("crear una nueva categoria");
    
    await sizesProductsModel.findOneAndDelete(req.body._id);
    const sizes = await sizesProductsModel.find().sort({createAt:-1});
    res.json({res:sizes});
    
}