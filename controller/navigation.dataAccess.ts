import {Request,Response} from 'express';
import navigationModel from '../models/navigation.model';
 

export async function listNavigation(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("new brand", req.body);
    
    const navigation = await  navigationModel.find();
    res.json({res:navigation});

}

export async function saveNavigation(req:Request,res:Response){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    console.log("new brand", req.body);
    
    const payloadHome = {
        urlFather:{
            name:"Inicio",
            url:"sin url",
            icon:"fas fa-home",
            active:true
        },
        urls:[]
    }

    const payloadIventory = {
        urlFather:{
            name:"Inventario",
            url:"sin url",
            icon:"fas fa-boxes",
            active:true
        },
        urls:[
            {
                name:"Categorias",
                url:"/admin77/manage_categories",
                icon:"fas fa-folder",
                active:true
            },
            {
                name:"Sub Categorias",
                url:"/admin77/manage_sub_categories",
                icon:"fas fa-folder",
                active:true
            },
            {
                name:"Productos",
                url:"/admin77/manage_products",
                icon:"fas fa-tshirt",
                active:true
            },
            {
                name:"Marcas",
                url:"/admin77/manage_brands",
                icon:"fas fa-stamp",
                active:true
            },
            {
                name:"Tallas",
                url:"/admin77/manage_sizes",
                icon:"fas fa-ruler-horizontal",
                active:true
            },
            {
                name:"Tipo de ocación",
                url:"/admin77/manage_type_ocasion",
                icon:"fas fa-umbrella-beach",
                active:true
            }
        ]
    }
    
    const home = new navigationModel(payloadHome);
    await home.save()
    const navigation = new navigationModel(payloadIventory);
    await navigation.save();
    
    res.json({res:"navigation saved"});

}