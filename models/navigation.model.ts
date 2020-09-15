import {Schema, model} from 'mongoose';

const navigationSchema = new Schema({

    //información personal
    urlFather:{type:{
        name:{type:String,required:true},
        url:{type:String,required:true},
        icon:{type:String,required:true},
        active:{type:Boolean,required:true}
    }},
    urls:{type:[
        {
            name:{type:String,required:false},
            url:{type:String,required:false},
            icon:{type:String,required:false},
            active:{type:Boolean,required:false}
        }
    ]}        

});

export default model('navigation', navigationSchema);