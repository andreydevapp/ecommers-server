import {Schema, model} from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const userStoreSchema = new Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true,lowercase:true,unique:true},
    password:{type:String,required:false},
    tempToken:{type:String,required:true},  
    createAt:{type:Date,default:Date.now()}
});
 
userStoreSchema.pre('save',function(next){
    const usuario:any = this;
    console.log(usuario);
    if (!usuario.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10,(err,salt) =>{
        if (err) {
            next(err);
        }
        const a:any = null;
        bcrypt.hash(usuario.password, salt,a, (err, hash) => {
            if (err) {
                next(err);
            }
            usuario.password = hash;
            console.log(usuario);
            next();
        })
    });
})

export default model('userStore', userStoreSchema);