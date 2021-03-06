"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const userStoreSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: false },
    tempToken: { type: String, required: true },
    createAt: { type: Date, default: Date.now() }
});
userStoreSchema.pre('save', function (next) {
    const usuario = this;
    console.log(usuario);
    if (!usuario.isModified('password')) {
        return next();
    }
    bcrypt_nodejs_1.default.genSalt(10, (err, salt) => {
        if (err) {
            next(err);
        }
        const a = null;
        bcrypt_nodejs_1.default.hash(usuario.password, salt, a, (err, hash) => {
            if (err) {
                next(err);
            }
            usuario.password = hash;
            console.log(usuario);
            next();
        });
    });
});
exports.default = mongoose_1.model('userStore', userStoreSchema);
