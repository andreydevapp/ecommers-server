"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userStore_model_1 = __importDefault(require("../models/userStore.model"));
function registerStoreUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("registrar usuario", req.body);
        const user = yield userStore_model_1.default.findOne({ email: req.body.payload.email });
        if (!user) {
            const payloadToken = {
                email: req.body.payload.email,
                fullName: req.body.payload.fullName
            };
            const token = yield jsonwebtoken_1.default.sign((payloadToken), 'my_secret_token_Key');
            let payload = {
                fullName: req.body.payload.fullName,
                email: req.body.payload.email,
                password: req.body.payload.password,
                tempToken: token,
                createAt: new Date()
            };
            const newUserStore = new userStore_model_1.default(payload);
            yield newUserStore.save();
            res.json({
                res: 'Successful registration',
                //usuario
                user: {
                    _id: newUserStore._id,
                    fullName: newUserStore.fullName,
                    email: newUserStore.email,
                    tempToken: newUserStore.tempToken
                }
            });
        }
        else {
            res.json({ res: 'Existing email' });
        }
    });
}
exports.registerStoreUser = registerStoreUser;
function loginStore(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.loginStore = loginStore;
function registerAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.registerAdmin = registerAdmin;
function lognAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.lognAdmin = lognAdmin;
