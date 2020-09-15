import {Schema, model} from 'mongoose';

const categoriasSchema = new Schema({

    //información personal
    nameCategory:{type:String,required:true},
    imagenUrl:{type:String,required:false,default:""},
    keyImagenS3:{type:String,required:false,default:""},
    quantitySubCategory:{type:Number,required:true,default:0},
    quantityProducts:{type:Number,required:true,default:0},
    description:{type:String,required:true},
    categoryFather:{type:String,required:false},
    nameCategoryFather:{type:String,required:false,default:""},
    createAt:{type:Date,required:true}

});

export default model('CATEGORIES', categoriasSchema);