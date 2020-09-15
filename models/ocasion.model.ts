import {Schema, model} from 'mongoose';

const ocasionSchema = new Schema({

    //información personal
    type:{type:String,required:true},
    description:{type:String,required:true},
    imagenUrl:{type:String,required:true,default:""},
    keyImagenS3:{type:String,required:true,default:""},
    active:{type:Boolean,required:false,default:true},
    createAt:{type:Date,required:true}

});

export default model('ocasion', ocasionSchema);