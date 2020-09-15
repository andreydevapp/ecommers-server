import {Schema, model} from 'mongoose';

const sizesSchema = new Schema({

    typeProduct:{type:String,required:true},
    description:{type:String,required:true},
    sizes:{type:[{
        size:{type:String,required:true},
        createAt:{type:Date,required:true}
    }]},
    createAt:{type:Date,required:true}

});

export default model('SIZES_PRODUCTS', sizesSchema);