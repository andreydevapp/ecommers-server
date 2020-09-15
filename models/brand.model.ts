import {Schema, model} from 'mongoose';

const brandsSchema = new Schema({

    nameBrand:{type:String,required:true},
    description:{type:String,required:false},
    imagenUrl:{type:String,required:false,default:""},
    keyImagenS3:{type:String,required:false,default:""},
    createAt:{type:Date,required:true}
    
});

export default model('BRANDS', brandsSchema);