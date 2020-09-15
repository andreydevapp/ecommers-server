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
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const enviroment_pro_1 = require("../environment/enviroment.pro");
const ocasion_model_1 = __importDefault(require("../models/ocasion.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
aws_sdk_1.default.config.update({
    secretAccessKey: enviroment_pro_1.amazonWs3.ws3SecretAccessKey,
    accessKeyId: enviroment_pro_1.amazonWs3.ws3AccessKeyId,
    region: "us-west-1"
});
const s3 = new aws_sdk_1.default.S3();
function newOcasionWhitImagen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("new ocasion", req.body);
        let imagenUrl = "";
        let imagenKey = req.file.filename;
        uploadImg(req, res);
        function uploadImg(req, res) {
            const fileContent = fs_1.default.readFileSync(req.file.path);
            // Setting up S3 upload parameters
            const params = {
                Bucket: enviroment_pro_1.amazonWs3.bucketImgOcasion,
                Key: req.file.filename,
                Body: fileContent,
                ACL: 'public-read'
            };
            // Uploading files to the bucket
            s3.upload(params, function (err, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log("me cai subiendo la imagen");
                        throw err;
                    }
                    else {
                        console.log("archivo subido");
                        imagenUrl = data.Location;
                        yield fs_1.default.unlinkSync(req.file.path);
                        saveOcasion(req, res);
                    }
                });
            });
        }
        function saveOcasion(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const newOcasion = new ocasion_model_1.default({ type: req.body.name, description: req.body.description, imagenUrl, keyImagenS3: imagenKey, createAt: new Date() });
                yield newOcasion.save();
                res.json({ res: "saved" });
            });
        }
    });
}
exports.newOcasionWhitImagen = newOcasionWhitImagen;
function getOcasions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("get ocacion");
        const ocacions = yield ocasion_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: ocacions });
    });
}
exports.getOcasions = getOcasions;
function putOcasion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("put ocacion", req.body);
        const ocasion = yield ocasion_model_1.default.findById(req.body._id);
        deleteImagen(ocasion.keyImagenS3);
        if (ocasion.type !== req.body.type) {
            yield product_model_1.default.update({ "typeOcasion.idType": req.body._id }, { "$set": { "typeOcasion.type": req.body.type } }, { "multi": true });
        }
        yield ocasion_model_1.default.findByIdAndUpdate(req.body._id, { type: req.body.type, description: req.body.description });
        res.json({ res: "updated" });
    });
}
exports.putOcasion = putOcasion;
function putOcasionWhitImagen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("put ocacion", req.body);
        let imagenUrl = "";
        let imagenKey = req.file.filename;
        uploadImg(req, res);
        function uploadImg(req, res) {
            const fileContent = fs_1.default.readFileSync(req.file.path);
            // Setting up S3 upload parameters
            const params = {
                Bucket: enviroment_pro_1.amazonWs3.bucketImgOcasion,
                Key: req.file.filename,
                Body: fileContent,
                ACL: 'public-read'
            };
            // Uploading files to the bucket
            s3.upload(params, function (err, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log("me cai subiendo la imagen");
                        throw err;
                    }
                    else {
                        console.log("archivo subido");
                        imagenUrl = data.Location;
                        yield fs_1.default.unlinkSync(req.file.path);
                        savePutOcasion(req, res);
                    }
                });
            });
        }
        function savePutOcasion(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const ocasion = yield ocasion_model_1.default.findById(req.body._id);
                deleteImagen(ocasion.keyImagenS3);
                if (ocasion.type !== req.body.type) {
                    yield product_model_1.default.update({ "typeOcasion.idType": req.body._id }, { "$set": { "typeOcasion.type": req.body.type } }, { "multi": true });
                }
                yield ocasion_model_1.default.findByIdAndUpdate(req.body._id, { type: req.body.type, description: req.body.description, imagenUrl, keyImagenS3: imagenKey });
                res.json({ res: "updated" });
            });
        }
    });
}
exports.putOcasionWhitImagen = putOcasionWhitImagen;
function deleteOcasion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("get ocacion");
        const ocasion = yield ocasion_model_1.default.findById(req.body._id);
        deleteImagen(ocasion.keyImagenS3);
        yield product_model_1.default.update({ "typeOcasion.idType": req.body._id }, { "$set": { "typeOcasion.idType": "5ec01296781f295258425a64", "typeOcasion.type": "Sin tipo de ocasión" } }, { "multi": true });
        yield ocasion_model_1.default.findByIdAndRemove(req.body._id);
        const ocacions = yield ocasion_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: ocacions });
    });
}
exports.deleteOcasion = deleteOcasion;
function deleteImagen(imagenKeyDb) {
    var params = { Bucket: enviroment_pro_1.amazonWs3.bucketImgOcasion, Key: imagenKeyDb };
    s3.deleteObject(params, function (err, data) {
        if (err)
            console.log(err, err.stack); // error
        else
            console.log(data); // deleted
    });
}
